import scrapy
import re
BASE_URL = 'http://en.wikipedia.org'



# A. Define the data to be scraped
class NWinnerItem(scrapy.Item):
    name = scrapy.Field()
    link = scrapy.Field()
    year = scrapy.Field()
    category = scrapy.Field()
    country = scrapy.Field()
    gender = scrapy.Field()
    born_in = scrapy.Field()
    date_of_birth = scrapy.Field()
    place_of_birth = scrapy.Field()
    place_of_death = scrapy.Field()
    text = scrapy.Field()

# B. Create a named spider
class NWinnerSpider(scrapy.Spider):
    name = 'nwinners_list'
    allowed_domains = ['en.wikipedia.org']
    start_urls = [
        "https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country"
    ]

    # C. A parse method to deal with the HTTP response
    def parse(self, response):
        h2s = response.xpath('//h2')

        for h2 in h2s:
            country = h2.xpath('span[@class="mw-headline"]/text()').extract()

            if country:
                winners = h2.xpath('following-sibling::ol[1]')
                for w in winners.xpath('li'):
                    # text = w.xpath('descendant-or-self::text()').extract()
                    wdata = process_winner_li(w, country[0])

                    yield NWinnerItem(
                        country=country[0], name=wdata['name'], text= wdata['text']
                    )


# D.

def get_persondata(table, item):
    fields = ['Date of birth', 'Place of birth', 'Date of death', 'Place of death']
    for tr in table.xpath('tr'):
        label = tr.xpath('td[@class="persondata-label"]/text()').extract()
        if label and label[0] in fields:
            text = ' '.join(tr.xpath('td[not(@class)]/descendant-or-self::text()').extract())
            print(text)
            item[label[0].lower().replace(' ', '_')] = text

def guess_gender(text, threshold=0):
    import re

    he = len(list(re.finditer(' he ', text)))
    she = len(list(re.finditer(' she ', text)))
    diff = she - he

    print('she %d, he %d, diff %d'%(she, he, diff))
    if diff > threshold:
        return 'female'
    elif diff < -threshold:
        return 'male'
    else:
        return None

def process_winner_li(w, country=None):
    """
    Process a winner's <li> tag, adding country of birth or nationality,
    as applicable.
    """
    wdata = {}
    # get the href link-adress from the <a> tag
    wdata['link'] = BASE_URL + w.xpath('a/@href').extract()[0]
    text = ' '.join(w.xpath('descendant-or-self::text()').extract())
    # we use the comma-delimited text-elements, stripping whitespace from
    # the ends.
    # split the text at the commas and take the first (name) string
    wdata['name'] = text.split(',')[0].strip()

    year = re.findall('\d{4}', text)
    if year:
        wdata['year'] = int(year[0])
    else:
        wdata['year'] = 0
        print('Oops, no year in ', text)

    category = re.findall(
            'Physics|Chemistry|Physiology or Medicine|Literature|Peace|Economics',
                text)
    if category:
        wdata['category'] = category[0]
    else:
        wdata['category'] = ''
        print('Oops, no category in ', text)

    if country:
        if text.find('*') != -1:
            wdata['country'] = ''
            wdata['born_in'] = country
        else:
            wdata['country'] = country
            wdata['born_in'] = ''

    # store a copy of the link's text-string for any manual corrections
    wdata['text'] = text
    return wdata
