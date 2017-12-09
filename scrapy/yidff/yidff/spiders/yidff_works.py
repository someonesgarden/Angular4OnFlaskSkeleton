# -*- coding: utf-8 -*-
import scrapy
import re,os
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from ..items import YidffItem
os.environ['PYTHONIOENCODING'] = 'UTF-8'

"""
scrapy crawl yidff_works -o ../../app/static/data/yidff_works.json
"""

class YidffWorksSpider(CrawlSpider):
    name = 'yidff_works'
    allowed_domains = ['www.yidff.jp/festivals.html']
    start_urls = ['http://www.yidff.jp/festivals.html']

    rules = (
        Rule(LinkExtractor(allow=r'Items/'), callback='parse_item', follow=True),
    )

    # For Scrapy v 1.0+, custom_settings can override the item pipelines in settings
    custom_settings = {
        'ITEM_PIPELINES': {'yidff.pipelines.YidffImagesPipeline': 1},
        'IMAGES_STORE': '../../app/static/images/yidff'
    }

    def parse_work_page(self, response):
        item = response.meta['item']
        title_link = item['title_link']
        # 最後のバックスラッシュ以降は削除する
        title_link_re = re.sub(r'/([^/]+)$', "", title_link)
        sharp_ary = title_link.split('#')

        type1 = response.xpath('//div[@id="article"]')
        if len(sharp_ary)>1:
            item['etc'] = 'type1#'+sharp_ary[1]

            dir_arg = response.xpath('//*[@id="article"]/dl/dd/descendant-or-self::text()')
            if len(dir_arg)>0:
                dir_ary = dir_arg.extract()
                item['dir'] = "|".join(dir_ary)

            str_ = sharp_ary[1].replace('t','')
            type1_0 = response.xpath('//div[4]/div[2]/div/div[2]/a')
            if len(type1_0)>0:

                type1_2 = type1_0[int(str_) - 1].xpath('following-sibling::dl')[0]
                type1_2_2 = type1_2.xpath('dd/descendant-or-self::text()')
                if len(type1_2_2) > 0:
                    dir_ary = type1_2_2.extract()
                    item['dir'] = "|".join(dir_ary)

                type1_0 = type1_0[int(str_) - 1].xpath('following-sibling::p/text()')
                if len(type1_0)>0:
                    story = type1_0.extract()[0]
                    if story.strip() != "":
                        item['story'] = story.strip()

                        img_arg = response.xpath('//img/@src')
                        if len(img_arg) > 0:
                            for ii in img_arg:
                                if ii.extract().find('png') > 0 or ii.extract().find('jpg') > 0:
                                    if item['work_imgs'] == "":
                                        item['work_imgs'] = title_link_re + '/' + ii.extract()
                                        yield item

        elif len(type1)>0:
            item['etc'] = 'type1'

            dir_arg = response.xpath('//*[@id="article"]/dl/dd/descendant-or-self::text()')
            if len(dir_arg) > 0:
                dir_ary = dir_arg.extract()
                item['dir'] = "|".join(dir_ary)

            type1 = response.xpath('//h2/following-sibling::p/text()')
            if len(type1) > 0:
                item['story'] = type1[0].extract()

                img_arg = response.xpath('//img/@src')
                if len(img_arg)>0:
                    for ii in img_arg:
                        if ii.extract().find('png') > 0 or ii.extract().find('jpg') > 0 :
                            if item['work_imgs']=="":
                                item['work_imgs'] = title_link_re+'/'+ii.extract()
                yield item
        else:
            type2 = response.xpath('//table[2]/tr[2]/td[3]/table')
            type2 = type2.xpath('tr[3]/td/font/descendant-or-self::text()')

            if len(type2) >0:
                item['etc'] = 'type2'
                story = type2[0].extract()
                if story.strip() != "":
                    item['story'] = story.strip()
                    yield item
            else:
                # type3 = response.xpath('//center[1]/table/tr[1]/td[2]/font/table/tr/td[2]/text()')
                type3 = response.xpath('//center[1]/table/tr[1]/td[2]/font/table/tr/td[2]/descendant-or-self::text()')
                if len(type3)>0:
                    item['etc'] = 'type3'
                    item['story'] = type3.extract()[0]
                    yield item
                else:
                    item['etc'] = ''


    def parse_year_page(self, response):
        item = response.meta['item']
        article_arg = response.xpath('//div[@id="article"]')[0]
        table_args = article_arg.xpath('table')
        if len(table_args)>0:
            for ta in table_args:
                subcategory = ta.xpath('tr/td/descendant-or-self::text()').extract()
                item['subcategory'] = ''
                for ti in subcategory:
                    item['subcategory'] +=ti
                li_args = ta.xpath('following-sibling::ul[1]/li')

                if len(li_args)>0:
                    for li_arg in li_args:
                        li_title1 = li_arg.xpath('descendant-or-self::text()')
                        title_link_arg = li_arg.xpath('a/@href')
                        if len(title_link_arg)>0:
                            title_link = title_link_arg[0].extract()
                            pattern = r"\.\.\/"
                            matchObj = re.search(pattern, title_link)
                            if matchObj: # ../libraryになっている場合
                                item['title_link'] = ''
                            else:
                                item['title_link'] = item['etc']+'/'+title_link

                                if len(li_title1)>0:
                                    item['title'] = li_title1[0].extract()
                                    item['title'] = item['title'].strip()
                                    request = scrapy.Request(item['title_link'], callback=self.parse_work_page, dont_filter=True)
                                    request.meta['item'] = YidffItem(**item)
                                    yield request


    def parse(self, response):
        BASEURL = 'https://www.yidff.jp/'
        a_table = response.xpath('//div[@id="article"]/table')[0]
        tr_args = a_table.xpath('tr')

        if len(tr_args) > 0:
                for tr in tr_args:
                    ddata = {}
                    ddata['work_imgs'] = ""
                    year_link = tr.xpath('td/a/@href')
                    year_title = tr.xpath('td/dl/dt/b/descendant-or-self::text()')

                    if len(year_title)>0:
                        ddata['category']=year_title[0].extract()

                        if len(year_link)>0:
                            year_link = BASEURL+year_link[0].extract()
                            list_link = year_link.replace('.html', 'list.html')
                            list_link_ary = list_link.split('/')
                            list_link_ary.pop()
                            link_base = '/'.join(list_link_ary)
                            #! 最後の/以降を捨てて、"/"でjoinする！
                            ddata['etc'] = link_base
                            request = scrapy.Request(list_link, callback=self.parse_year_page, dont_filter=True)
                            request.meta['item'] = YidffItem(**ddata)
                            yield request
