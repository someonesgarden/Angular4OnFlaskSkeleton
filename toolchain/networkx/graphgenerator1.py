#!/usr/bin/env python3
# -*- coding:utf-8 -*-

import os
import sys
rootdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
print(rootdir)
sys.path.append(rootdir)

import numpy as np
import networkx as nx
import json
import matplotlib.pyplot as plt
import requests
import json
from networkx.readwrite import json_graph


class GenerateGraph:

    G = None
    jsonfile= 'graph.json'

    def __init__(self, filename=jsonfile):
        self.jsonfile = filename

    def drawGraph(self, n=50,p=4.0/30):
        self.G = nx.erdos_renyi_graph(n, p)
        while not nx.is_connected(self.G):
            # self.G = nx.erdos_renyi_graph(n,p)
            # self.G = nx.fast_gnp_random_graph(n, p)
            # self.G= nx.hypercube_graph(n)
            # self.G = nx.star_graph(n)
            # self.G = nx.lollipop_graph(2, n)
            # self.G = nx.dorogovtsev_goltsev_mendes_graph(n)
            # self.G = nx.wheel_graph(n)
            # self.G = nx.circular_ladder_graph(n)
            self.G = nx.cycle_graph(n)
        plt.figure(figsize=(6, 4))
        nx.draw(self.G)

    def GG(self):
        for ix, deg in list(self.G.degree()):
            self.G.node[ix]['degree'] = deg
            self.G.node[ix]['parity'] = (1 - deg % 2)
        for ix, katz in nx.katz_centrality(self.G).items():
            self.G.node[ix]['katz'] = katz

    def export_json(self,filename=jsonfile):
        data = json_graph.node_link_data(self.G)
        with open(rootdir+'/app/static/data/graph/'+filename, 'w') as f:
            print("exporting json to.."+rootdir+'/app/static/data/graph/'+filename)
            json.dump(data, f, indent=4)

        return data

    def graphOutJSON(self, n=50, p=4.0/30):
        self.drawGraph(n, p)
        self.GG()
        datajson = self.export_json(self.jsonfile)
        return datajson
