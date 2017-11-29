'use strict';
import * as crossfilter from 'crossfilter2';
import * as d3 from 'd3';

export let env = {
    $STATIC_API : false,
    $EVE_API_STATIC : 'static/data/api/',
    $EVE_API : 'http://localhost:5000/api/'
};

// export const query_winners = 'winners?projection=' + JSON.stringify( {'mini_bio': 0, 'bio_image': 0});
export const query_winners = 'winners?projection=' + JSON.stringify( {'mini_bio':0});
// export const query_winners = 'winners?where=' + JSON.stringify({'country': 'Hong Kong'});
// export const query_winners = 'winners';

// export const query_winners = 'winners?where=' + JSON.stringify({'name': 'Frédéric Mistral'});


export let nbviz = {
  ALL_CATS  : 'All Categories',
  CATEGORIES : [ 'Chemistry', 'Economics', 'Literature', 'Peace', 'Physics', 'Physiology or Medicine' ],
  COUNTRIES : [ 'All Countries', 'Single Winning Countries', 'Double Winning Countries' ],
  ALL_WINNERS : 'All Countries',
  SINGLE_WINNERS : 'Single Winning Countries',
  DOUBLE_WINNERS : 'Double Winning Countries',
  TRANS_DURATION : 2000,

  COLORS : {palegold: '#E6BE8A'},
  data : {countryData: null, winnersData: null, mapData: null, years: null},
  valuePerCapita : 0,
  activeCountry : null,
  activeCategory : this.ALL_CATS,
  filter : null,
  countryDim : null,
  categoryDim : null,
  genderDim : null,
  countrySelectGroups : null,

  rootComponent: null,
  menuComponent : null,
  graphmainComponent : null,

  MAX_CENTROID_RADIUS : 30,
  MIN_CENTROID_RADIUS : 2,

  makeFilterAndDimensions: function () {
    let winnersData = nbviz.data.winnersData;
    // ADD OUR FILTER AND CREATE CATEGORY DIMENSIONS
    nbviz.filter = crossfilter(winnersData);
    console.log("Count: " + nbviz.filter.groupAll().reduceCount().value());

    nbviz.countryDim = nbviz.filter.dimension(function (o) {
      return o.country;
    });

    nbviz.categoryDim = nbviz.filter.dimension(function (o) {
      return o.category;
    });

    nbviz.genderDim = nbviz.filter.dimension(function (o) {
      return o.gender;
    });
  },

  filterByCategory: function(cat) {
    console.log('filterByCategory', cat);
          nbviz.activeCategory = cat;
    if (cat !== nbviz.ALL_CATS) {
      nbviz.categoryDim.filter(cat);
    } else {
      nbviz.categoryDim.filter();
    }
  },
  filterByCountries : function(countryNames) {
    console.log('filterByCountries');
    if (countryNames.length) {
      nbviz.countryDim.filter(function (name) {
        return countryNames.indexOf(name) > -1;
      });
    } else {
      nbviz.countryDim.filter();
    }
    if (countryNames.length !== 1) {
      nbviz.activeCountry = null;
    } else {
      nbviz.activeCountry = countryNames[0];
    }
  },

  categoryFill : function(category):any{
        var i = nbviz.CATEGORIES.indexOf(category);
        return d3.hcl(i / nbviz.CATEGORIES.length * 360, 60, 70);
  },

  nestDataByYear : function(entries):any {
        return nbviz.data.years = d3.nest()
            .key(function(w:any) {
                return w.year;
            })
            .entries(entries);
    }
};
