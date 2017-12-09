# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ..items import DocListItem

"""
scrapy crawl idfa_works -o ../../app/static/data/idfa_works.json

"""


class IdfaWorksSpider(CrawlSpider):
    name = 'idfa_works'
    allowed_domains = ['https://www.idfa.nl/en/collection/films']
    start_urls = ['https://www.idfa.nl/en/collection/films/']

    rules = (
        Rule(LinkExtractor(allow=r'Items/'), callback='parse_item', follow=True),
    )

    custom_settings = {
        'ITEM_PIPELINES': {'docu_from_wiki.pipelines.DocuFromWikiImagePipeline': 1},
        'IMAGES_STORE': '../../app/static/images/idfa'
    }


    BASE_URL = 'https://www.idfa.nl'
    BASE_PAGE_URL = 'https://www.idfa.nl/en/collection/films?page='
    MAX_PAGE = 10 # 679

    def parse(self, response):
        a_arg = response.xpath('//article')
        if len(a_arg) > 0:
            for a in a_arg:
                ddata = parse_idfa_first(a)
                yield DocListItem(**ddata)

        for num in range(2,self.MAX_PAGE+1):
            next_link = self.BASE_PAGE_URL+str(num)
            print(next_link)
            request = scrapy.Request(next_link, callback=self.parse_next, dont_filter=True)
            request.meta['item'] = {}
            yield request

    def parse_next(self,response):
        item = response.meta['item']
        a_arg = response.xpath('//article')
        if len(a_arg) > 0:
            for a in a_arg:
                ddata1 = parse_idfa_first(a)
                item['title']=ddata1['title']
                item['title_link'] = ddata1['title_link']
                item['etc'] = ddata1['etc']
                item['story'] = ddata1['story']
                item['work_imgs'] = ddata1['work_imgs']

                # print("a_arg=", ddata)

                if ddata1['title'] != "":
                    yield DocListItem(
                       **item
                    )

def parse_idfa_first(a):
    ddata = {}
    title_h2 = a.xpath('div/h2/text()')
    title_uls = a.xpath('div/ul/descendant-or-self::text()').extract()
    p = a.xpath('div/div/p/descendant-or-self::text()')
    link = a.xpath('a/@href')

    if len(title_h2) > 0:
        ddata['title'] = title_h2.extract()[0]
    else:
        ddata['title'] = ''

    if len(link) > 0:
        ddata['title_link'] = 'https://www.idfa.nl' + link.extract()[0]
    else:
        ddata['title_link'] = ""

    if len(title_uls) > 0:
        title_uls = map(lambda s: s.replace('\n',''), title_uls)
        title_uls = map(lambda s: s.strip(), title_uls)
        title_uls = filter(lambda s: s != '', title_uls)
        ddata['etc'] = '|'.join(title_uls)
    else:
        ddata['etc'] = ''

    if len(p) > 0:
        ddata['story'] = ' '.join(p.extract())
    else:
        ddata['story'] = ''

    fig = a.xpath('figure/div/div/div[2]/img/@src')
    if len(fig) > 0:
        work_img = fig.extract()[0]
        work_img = work_img.split('?')
        ddata['work_imgs'] = work_img[0]
    else:
        ddata['work_imgs'] = ''

    return ddata
