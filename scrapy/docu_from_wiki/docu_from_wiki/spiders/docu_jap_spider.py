#!/usr/bin/env python3
# -*- coding:utf-8 -*-
"""
japandas: 日本語の日付を英語に変換する

"""
import scrapy
import re
import japandas as jpd
from ..items import DocListItem
"""
https://ja.wikipedia.org/wiki/Category:各国のドキュメンタリー映画
https://ja.wikipedia.org/wiki/Category:日本のドキュメンタリー映画

scrapy crawl docu_list_jap -o ../../app/static/data/doclistjap.json
"""

BASE_URL_JA = 'http://ja.wikipedia.org'

# B. Create a named spider
class NWinnerSpider(scrapy.Spider):
    name = 'docu_list_jap'
    allowed_domains = ['https://ja.wikipedia.org']
    start_urls = ["https://ja.wikipedia.org/wiki/Category:日本のドキュメンタリー映画"]

    # C. A parse method to deal with the HTTP response
    def parse(self, response):
        mw = response.xpath('//div[@class="mw-category"]/div[@class="mw-category-group"]')

        ddata = {}

        for m in mw:
            ddata['order'] = m.xpath('h3/text()').extract()[0]

            m_list = m.xpath('ul/li')

            for l in m_list:

                if len(l.xpath('a')) > 0:
                    ddata['ja_link'] = l.xpath('a/@href').extract()[0]
                    ddata['ja_title'] = l.xpath('a/text()').extract()[0]
                elif len(l.xpath('span/a')) >0:
                    ddata['ja_link'] = l.xpath('span/a/@href').extract()[0]
                    ddata['ja_title'] = l.xpath('span/a/text()').extract()[0]
                else:
                    ddata['ja_link'] = ''
                    ddata['ja_title'] = ''

                if ddata['ja_link'] == '':
                    yield DocListItem(
                        order=ddata['order'],
                        ja_title=ddata['ja_title'],
                        ja_link = ddata['ja_link']
                    )
                else:
                    request = scrapy.Request(BASE_URL_JA + ddata['ja_link'], callback=self.get_work_info, dont_filter=True)
                    request.meta['item'] = DocListItem(**ddata)
                    yield request

    def get_work_info(self, response):
        item = response.meta['item']

        infobox = response.xpath('//table[contains(@class,"infobox")]')

        if infobox:
            # info_args = infobox.xpath('tr/descendant-or-self::text()')
            info_args = infobox.xpath('tr')

            for info_arg in info_args:
                info = info_arg.extract()

                #DIR
                if info.find(u'監督') > 0:
                    dir_site = info_arg.xpath('td/a/@href')
                    if len(dir_site) > 0:
                        item['dir_link'] = dir_site[0].extract()
                        item['dir'] = info_arg.xpath('td/a/text()')[0].extract()
                    else:
                        item['dir'] = info_arg.xpath('td/text()')[0].extract()
                # PRO
                if info.find(u'製作会社') > 0:
                    pro_arg = info_arg.xpath('td/descendant-or-self::text()')
                    if pro_arg:
                        item['pro'] = pro_arg[0].extract()

                # LANGUAGE
                if info.find(u'言語') > 0:
                    lang_arg = info_arg.xpath('td/descendant-or-self::text()')
                    if len(lang_arg) > 0:
                        item['language'] =lang_arg[0].extract()

                # RUNNING_TIME
                if info.find(u'上映時間') > 0:
                    if len(info_arg.xpath('td/text()')) > 0:
                        item['running_time'] = info_arg.xpath('td/text()')[0].extract()

                # year
                if info.find(u'公開') > 0:
                    if len(info_arg.xpath('td/text()')) > 0:
                        year_arg = info_arg.xpath('td/descendant-or-self::text()')
                        if len(year_arg) > 0:
                            year_ja = year_arg[0].extract()
                            year_ja = year_ja.strip()
                            year_ja = year_ja.replace(u'秋', '')
                            year_ja = year_ja.replace(u'春', '')
                            year_ja = year_ja.replace(u'夏', '')
                            year_ja = year_ja.replace(u'冬', '')
                            if year_ja != "":
                                time_ja = jpd.to_datetime(year_ja)
                                item['year'] = time_ja.strftime('%Y-%m-%d')
                                #!!! AttributeError: 'unicode' object has no attribute 'strftime'
        # STORY
        mini_story = ''
        # Get the paragraphs in the biography's body-text
        ps = response.xpath(
            '//*[@id="mw-content-text"]/div[@class="mw-parser-output"]/p[text() or  normalize-space(.)=""]').extract()
        for p in ps:
            if p == '<p></p>':
                break
            mini_story += p
        # correct for wiki-links
        mini_story = mini_story.replace('href="/wiki', 'href="' + BASE_URL_JA + '/wiki')
        mini_story = mini_story.replace('href="#', 'href="' + item['ja_link'] + '#')
        item['ja_story'] = mini_story
        # DISTRIBUTIONS
        p_langs = response.xpath('//div[@id="p-lang"]/div[@class="body"]/ul/li')
        if len(p_langs) > 0:

            distributions_ary = [u'日本語']
            for pl in p_langs:

                distri = pl.xpath('descendant-or-self::text()')
                if len(distri) > 0:
                    print('distri', distri)
                    distributions_ary.append(distri.extract()[0])

            item['distributions'] = ' / '.join(distributions_ary)

        yield item