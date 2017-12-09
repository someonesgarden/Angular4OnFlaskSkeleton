# -*- coding: utf-8 -*-

# Define here the models for your scraped items
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class YidffItem(scrapy.Item):
    order = scrapy.Field()
    country = scrapy.Field()
    language = scrapy.Field()
    media = scrapy.Field()
    category = scrapy.Field()
    subcategory = scrapy.Field()
    title = scrapy.Field()
    title_link = scrapy.Field()
    year = scrapy.Field()
    dir = scrapy.Field()
    pro = scrapy.Field()
    title_link =  scrapy.Field()
    dir_link  = scrapy.Field()
    pro_link = scrapy.Field()
    running_time = scrapy.Field()
    story = scrapy.Field()
    distributions = scrapy.Field()
    work_imgs = scrapy.Field()
    work_imgs_local= scrapy.Field()
    website = scrapy.Field()
    ja_title = scrapy.Field()
    ja_link = scrapy.Field()
    ja_story = scrapy.Field()
    etc = scrapy.Field()
