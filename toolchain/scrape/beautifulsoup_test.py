#!/usr/bin/env python3
# -*- coding:utf-8 -*-
import os
import sys
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
"""
rootdir should be
/Users/user/PycharmProjects/Angular4OnFlaskSkeleton
"""
print(rootdir)
sys.path.append(rootdir)
import pandas as pd


"""
簡単なスクレイピングのテストコード。
BeautifulSoup4で
"""

from app.models.mongofunc import get_mongo_database

from bs4 import BeautifulSoup
import requests
import requests_cache
requests_cache.install_cache()

BASE_URL = 'http://en.wikipedia.org'
HEADERS = {'User-Agent' : 'Mozilla/5.0'}


def get_Nobel_soup():
    response = requests.get(BASE_URL + '/wiki/List_of_Nobel_laureates', headers = HEADERS)
    return BeautifulSoup(response.content, "lxml")


def get_column_titles(table):
    """ Get the Nobel categories from the table header """
    cols = []
    for th in table.select_one('tr').select('th')[1:]:
        link = th.select_one('a')

        if link:
            cols.append({'name':link.text, 'href':link.attrs['href']})
        else:
            cols.append({'name':th.text, 'href':None})
    return cols

def get_Nobel_winners(table):
    cols = get_column_titles(table)
    winners = []
    for row in table.select('tr')[1:-1]:
        year = row.select_one('td').text
        for i, td in enumerate(row.select('td')[1:]):
            for winner in td.select('a'):
                href = winner.attrs['href']
                if not href.startswith('#endnote'):
                    winners.append({
                        'year': year,
                        'category': cols[i]['name'],
                        'name': winner.text,
                        'link': winner.attrs['href']
                    })
    return winners

def get_winner_nationality(w):
    response = requests.get('http://en.wikipedia.org' + w['link'], headers=HEADERS)
    soup = BeautifulSoup(response.content, "lxml")
    person_data = {'name': w['name']}
    attr_rows = soup.select('table.infobox tr')
    print("attr_rows:")
    # print(attr_rows)
    for tr in attr_rows:
        try:
            attribute = tr.select_one('th').text
            if attribute == 'Nationality':
                person_data[attribute] = tr.select_one('td').text
                print(person_data[attribute])
        except AttributeError:
            pass
    return person_data


soup = get_Nobel_soup()

tab1 = soup.find('table', {'class': 'wikitable sortable'})

# print(tab1)

tab2 = soup.select_one('table.sortable.wikitable')

winners = get_Nobel_winners(tab2)

wdata = []
for w in winners[:50]:
    wdata.append(get_winner_nationality(w))
missing_nationality = []
for w in wdata:
    if not w.get('Nationality'):
        missing_nationality.append(w)

print(missing_nationality)



db = get_mongo_database('nobel_prize')