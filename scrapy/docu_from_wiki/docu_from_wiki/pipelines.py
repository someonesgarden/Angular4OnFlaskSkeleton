# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html


import scrapy
from scrapy.contrib.pipeline.images import ImagesPipeline
# For Scrapy v1.0+:
from scrapy.pipelines.images import ImagesPipeline
from scrapy.pipelines.files import FilesPipeline
from scrapy.exceptions import DropItem

class DocuFromWikiPipeline(object):
    def process_item(self, item, spider):
        return item

class DocuFromWikiImagesPipeline(ImagesPipeline):

    # def process_item(self, item, spider):
    #     if spider.name not in ['nwinners_minibio']:
    #         return item

    def get_media_requests(self, item, info):

        for image_url in item['work_imgs']:

            yield scrapy.Request(image_url)

    def item_completed(self, results, item, info):

        image_paths = [x['path'] for ok, x in results if ok]

        # if not image_paths:
        #     raise DropItem('Item contains no images')
        # item['bio_image'] = image_paths

        if image_paths:
            item['work_imgs_local'] = image_paths[0]

        return item