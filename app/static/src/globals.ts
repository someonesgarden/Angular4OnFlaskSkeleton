'use strict';
import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';

export let env = {
    $STATIC_API : false,
    $EVE_API_STATIC : 'static/data/api/',
    $EVE_API : 'http://localhost:5000/api/'
};


// export const query_winners = 'winners?projection=' + JSON.stringify( {'mini_bio': '0', 'bio_image': '0'});
export const query_winners = 'winners?where=' + JSON.stringify({'country': 'Denmark'});
// export const query_winners = 'winners?where=' + JSON.stringify({'name': 'Frédéric Mistral'});


export let nbviz = {
  ALL_CATS  : 'All Categories',
  CATEGORIES : [ 'Chemistry', 'Economics', 'Literature', 'Peace', 'Physics', 'Physiology or Medicine' ],
  COUNTRIES : [ 'All Countries', 'Single Winning Countries', 'Double Winning Countries' ],
  ALL_WINNERS : 'All Countries',
  SINGLE_WINNERS : 'Single Winning Countries',
  DOUBLE_WINNERS : 'Double Winning Countries',
  TRANS_DURATION : 2000,
  MAX_CENTROID_RADIUS : 30,
  MIN_CENTROID_RADIU : 2,
  COLORS : {palegold: '#E6BE8A'},
  data : {countryData: null},
  valuePerCapita : 0,
  activeCountry : null,
  activeCategory : this.ALL_CATS,
  filter : null,
  countryDim : null,
  categoryDim : null,
  genderDim : null,
  countrySelectGroups : null,
  makeFilterAndDimensions : function(winnersData){
        // ADD OUR FILTER AND CREATE CATEGORY DIMENSIONS
        nbviz.filter = crossfilter(winnersData);
        nbviz.countryDim = nbviz.filter.dimension(function(o){
            return o.country;
        });

        nbviz.categoryDim = nbviz.filter.dimension(function(o) {
            return o.category;
        });

        nbviz.genderDim = nbviz.filter.dimension(function(o) {
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
  getCountryData : function() {
        const countryGroups = nbviz.countryDim.group().all();
        // make main data-ball
        const data = countryGroups.map( function(c) {
            const cData = nbviz.data.countryData[c.key];
            console.log('cData');
            console.log(cData);
            let value = c.value;
            console.log('value');
            console.log(value);
            // if per-capita value then divide by pop. size
            if (nbviz.valuePerCapita) {
                value /= cData.population;
            }
            return {
                key: c.key,
                value: value,
                code: cData.alpha3Code,
                // population: cData.population
            };
        })
            .sort(function(a, b) {
                return b.value - a.value; // descending
            });

        console.log(data);
        return data;
    },
  onDataChange : function() {
    console.log('onDataChange');
    const data = nbviz.getCountryData();
    console.log(data);
    // nbviz.updateBarChart(data);
    // nbviz.updateMap(data);
    // nbviz.updateList(nbviz.countryDim.top(Infinity));
    // data = nestDataByYear(nbviz.countryDim.top(Infinity));
    // nbviz.updateTimeChart(data);
    }
};
