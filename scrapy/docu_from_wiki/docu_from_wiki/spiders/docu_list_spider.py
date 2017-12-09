# -*- coding:utf-8 -*-

import scrapy
import re
from ..items import DocListItem

BASE_URL = 'http://en.wikipedia.org'
BASE_URL_JA = 'http://ja.wikipedia.org'

"""
＜コマンド＞
1)scrapy/doc_from_wikiに移動。
2)
scrapy crawl docu_list -o ../../app/static/data/doclist.json

＜スクレイプの起点＞
英語圏
https://en.wikipedia.org/wiki/List_of_documentary_films
https://en.wikipedia.org/wiki/Category:Documentary_films_by_country
https://en.wikipedia.org/wiki/Category:Documentaries_by_topic
日本語圏（量が少ない）
https://ja.wikipedia.org/wiki/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%82%BF%E3%83%AA%E3%83%BC

"""

# B. Create a named spider
class NWinnerSpider(scrapy.Spider):
    name = 'docu_list'
    allowed_domains = ['en.wikipedia.org']
    start_urls = ["https://en.wikipedia.org/wiki/List_of_documentary_films"]

    # For Scrapy v 1.0+, custom_settings can override the item pipelines in settings
    # ScrapyのImageパイプライン設定と保存場所を指定（settings.pyでは設定しないでこちらで設定する！）
    custom_settings = {
        'ITEM_PIPELINES': {'docu_from_wiki.pipelines.DocuFromWikiImagesPipeline': 1},
        'IMAGES_STORE'  : '../../app/static/images/docu_from_wiki'
    }

    # C. A parse method to deal with the HTTP response
    def parse(self, response):
        h2s = response.xpath('//h2')
        for h2 in h2s:
            order = h2.xpath('span[@class="mw-headline"]/text()').extract()
            if order:
                docs = h2.xpath('following-sibling::table[@class="wikitable sortable"]')[0]
                if docs:
                    tr_args = docs.xpath('tr')
                    tr_args = tr_args[1:]
                    for tr_arg in tr_args:
                        # text = w.xpath('descendant-or-self::text()').extract()
                        ddata = process_doc_tr(tr_arg, order)

                        ddata['category'] = 'film'

                        if ddata['title_link']:
                            # WIKIに作品(英語）ページがある場合
                            request = scrapy.Request(BASE_URL + ddata['title_link'], callback=self.get_work_info, dont_filter=True)
                            request.meta['item'] = DocListItem(**ddata)
                            yield request

                        else:
                            # ない場合はここまでの情報を
                            yield DocListItem(
                                order=order[0],
                                title=ddata['title'],
                                title_link=ddata['title_link'],
                                year=ddata['year'],
                                dir = ddata['dir'],
                                pro =  ddata['pro'],
                                dir_link =  ddata['dir_link'],
                                pro_link =  ddata['pro_link'],
                                category = 'film'
                            )


    # クロールの二段目(ここの映画作品のwikiページ)
    def get_work_info(self,response):
        item = response.meta['item']

        # ITEM IMAGE
        item['work_imgs'] = []


        infobox = response.xpath('//table[contains(@class,"infobox")]')

        if infobox:
            # info_args = infobox.xpath('tr/descendant-or-self::text()')
            info_args = infobox.xpath('tr')

            # COUNTRY, WEBSITE,
            for info_arg in info_args:
                info = info_arg.extract()

                # WEBSITE
                if info.find('Website') > 0:
                    print('Website  FOUND')
                    website = info_arg.xpath('td/span/a/@href')[0].extract()
                    item['website'] = website

                # COUNTRY
                elif info.find('Country') > 0:
                    country_arg = info_arg.xpath('td/text()')
                    if len(country_arg) > 0:
                        item['country'] = country_arg.extract()[0]

                # Running Time
                elif info.find('Running time') > 0:
                    running_time_arg = info_arg.xpath('td/text()')
                    if len(running_time_arg) > 0:
                        item['running_time'] = running_time_arg.extract()[0]

            # WORK IMAGES
            img_src = response.xpath('//table[contains(@class,"infobox")]//img/@src')
            # img_src = infobox.xpath('//img/@src')
            if img_src:
                item['work_imgs'] = ['http:' + img_src[0].extract()]

        # STORY
        mini_story = ''
        # Get the paragraphs in the biography's body-text
        ps = response.xpath('//*[@id="mw-content-text"]/div[@class="mw-parser-output"]/p[text() or  normalize-space(.)=""]').extract()
        for p in ps:
            if p == '<p></p>':
                break
            mini_story += p
        # correct for wiki-links
        mini_story = mini_story.replace('href="/wiki', 'href="' + BASE_URL + '/wiki')
        mini_story= mini_story.replace('href="#', 'href="' + item['title_link'] + '#')
        item['story'] = mini_story

        # DISTRIBUTIONS
        p_langs = response.xpath('//div[@id="p-lang"]/div[@class="body"]/ul/li')
        item['distributions'] = 'English'
        if len(p_langs)>0:

            distributions_ary = []
            for pl in p_langs:

                distri = pl.xpath('descendant-or-self::text()').extract()[0]
                if distri:

                    print('distri', distri)
                    distributions_ary.append(distri)

            item['distributions'] =  ' / '.join(distributions_ary)
            print(item['distributions'])

            # 日本語というワードに引っかかたら、リンクをさらにパースして情報を得る。
            ja_lang_link = response.xpath('//div[@id="p-lang"]/div[@class="body"]/ul/li[contains(@class,"interwiki-ja")]/a/@href')
            print(ja_lang_link)
            if len(ja_lang_link) > 0:
                item['ja_link'] = ja_lang_link.extract()[0]
                request = scrapy.Request(item['ja_link'], callback=self.get_japsite_info, dont_filter=True)
                request.meta['item'] = DocListItem(**item)
                yield request
            else:
                yield item
        else:
            yield item


    # クロールの三段目(日本語ページのクロール）
    def get_japsite_info(self, response):
        print("日本語ページのクロール中.....")
        item = response.meta['item']

        ja_title_arg = response.xpath('//h1[@id="firstHeading"]/descendant-or-self::text()')
        if len(ja_title_arg) > 0:
            item['ja_title'] = ja_title_arg.extract()[0]

        # STORY
        ja_story = ''
        # Get the paragraphs in the biography's body-text
        ps = response.xpath(
            '//*[@id="mw-content-text"]/div[@class="mw-parser-output"]/p[text() or  normalize-space(.)=""]').extract()
        if len(ps) > 0:
            for p in ps:
                if p == '<p></p>':
                    break
                ja_story += p
            # correct for wiki-links
            ja_story = ja_story.replace('href="/wiki', 'href="' + BASE_URL_JA + '/wiki')
            ja_story = ja_story.replace('href="#', 'href="' + item['title_link'] + '#')
            item['ja_story'] = ja_story
        infobox = response.xpath('//table[contains(@class,"infobox")]')

        yield item

# クロール一段目の情報処理
def process_doc_tr(tr_arg, order=None):

    ddata = {}
    td_arg = tr_arg.xpath('td')

    # WORK TITLE
    if td_arg[0]:
        ddata['title'] = ''
        ddata['title_link'] = ''
        title_arg = td_arg[0].xpath('descendant-or-self::text()')
        title_link_arg = td_arg[0].xpath('i/a/@href')
        if len(title_arg)>0:
            ddata['title']= title_arg.extract()[0]

        if len(title_link_arg)>0:
            ddata['title_link'] = title_link_arg.extract()[0]

    # YEAR
    ddata['year'] = ''
    if td_arg[1]:
        year_arg = td_arg[1].xpath('text()')
        if len(year_arg)>0:
            ddata['year'] = year_arg.extract()[0]

    # DIRECTOR
    ddata['dir'] = ''
    ddata['dir_link'] = ''
    if td_arg[2]:
        dir_arg = td_arg[2].xpath('descendant-or-self::text()')
        if len(dir_arg):
            ddata['dir'] = dir_arg.extract()[0]

        dir_link_arg = td_arg[2].xpath('a/@href')

        if len(dir_link_arg):
            ddata['dir_link'] = dir_link_arg.extract()[0]

    # PRODUCERS
    ddata['pro'] = ''
    ddata['pro_link'] = ''
    if len(td_arg)>=4:
        pro_arg = td_arg[3].xpath('descendant-or-self::text()')
        if len(pro_arg):
            ddata['pro'] = pro_arg.extract()[0]

        pro_link_arg = td_arg[3].xpath('a/@href')

        if len(pro_link_arg):
            ddata['pro_link'] = pro_link_arg.extract()[0]

    # order
    ddata['order'] = order[0]

    return ddata