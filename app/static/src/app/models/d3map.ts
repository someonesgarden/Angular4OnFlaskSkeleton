import * as d3 from 'd3';
import * as topojson from 'topojson';
import * as G from '../../globals';

export class D3Map {
  map_dom: any;
  tooltip: any;
  svg: any;
  path: any;
  width: number;
  height: number;
  projection: any;
  cnameToCountry: any;
  radiusScale: any;
  MANUAL_CENTROIDS: any;


  init(): void {
    // DIMENSIONS AND SVG
    this.map_dom = d3.select('#nobel-map');
    this.tooltip = d3.select('#map-tooltip');
    var boundingRect = this.map_dom.node().getBoundingClientRect();
    this.width = boundingRect.width;
    this.height = boundingRect.height;
    this.svg = this.map_dom.append('svg');

    this.MANUAL_CENTROIDS = {
      France: [2, 46],
      'United States': [-98, 35, 39.5]
    };

    // A FEW D3 PROJECTIONS
    // default scale = 153
    var projection_eq = d3.geoEquirectangular()
      .scale(193 * (this.height / 430))
      .center([15, 15])
      // .translate([0.9* width / 2, 1.2* height / 2])
      .translate([this.width / 2, this.height / 2])
      .precision(.1);

    var projection_cea = d3.geoConicEqualArea()
      .center([0, 26])
      .scale(128)
      .translate([this.width / 2, this.height / 2])
      .precision(.1);

    var projection_ceq = d3.geoConicEquidistant()
      .center([0, 22])
      .scale(128)
      .translate([this.width / 2, this.height / 2])
      .precision(.1);

    var projection_merc = d3.geoMercator()
      .scale((this.width + 1) / 2 / Math.PI)
      .translate([this.width / 2, this.height / 2])
      .precision(.1);
    // END PROJECTIONS
    this.projection = projection_eq;

    this.path = d3.geoPath().projection(this.projection);

    // ADD GRATICULE (MAP GRID)
    var graticule = d3.geoGraticule()
      .step([20, 20]);

    this.svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", this.path);

    this.radiusScale = d3.scaleSqrt()
      .range([G.nbviz.MIN_CENTROID_RADIUS, G.nbviz.MAX_CENTROID_RADIUS]);

    this.cnameToCountry = {}; // called when the Noble-viz is initialised with the Nobel dataset
  }

  getCentroid(mapData): any {
    var latlng = G.nbviz.data.countryData[mapData.name].latlng;
    return this.projection([latlng[1], latlng[0]]);
  }

  initMap(world, names): void {

    // geojson objects extracted from topojson features
    var land = topojson.feature(world, world.objects.land),
      countries = topojson.feature(world, world.objects.countries).features,
      borders = topojson.mesh(world, world.objects.countries, function (a, b) {
        return a !== b;
      });

    var idToCountry = {};
    countries.forEach(function (c) {
      idToCountry[c.id] = c;
    });

    this.cnameToCountry = {};
    names.forEach((n) => {
      this.cnameToCountry[n.name] = idToCountry[n.id];
    });


    // MAIN WORLD MAP
    this.svg.insert("path", ".graticule")
      .datum(land)
      .attr("class", "land")
      .attr("d", this.path)
    ;

    // WINNING COUNTRIES
    this.svg.insert("g", ".graticule")
      .attr("class", 'countries');


    // COUNTRIES VALUE-INDICATORS
    this.svg.insert("g")
      .attr("class", "centroids");

    // BOUNDRY MARKS
    this.svg.insert("path", ".graticule")
    // filter separates exterior from interior arcs...
      .datum(borders)
      .attr("class", "boundary")
      .attr("d", this.path);
  }

  updateMap(countryData): void {

    console.log('updateMap');
    console.log(countryData);

    var that = this;

    var mapData = G.nbviz.data.mapData = countryData
      .filter((d: any) => {
        if (d) {
          return d.value > 0;
        } else {
          return false;
        }
      })
      .map((d: any) => {
        return {
          geo: this.cnameToCountry[d.key],
          name: d.key,
          number: d.value
        };
      });

    var maxWinners = d3.max(mapData.map((d: any) => {
      return d.number;
    }));

    // DOMAIN OF VALUE-INDINCATOR SCALE
    this.radiusScale.domain([0, maxWinners]);

    var countries = this.svg.select('.countries').selectAll('.country')
      .data(mapData, (d: any) => {
        return d.name;
      });


    countries.enter()
      .append('path')
      .attr('class', 'country')
      .on('mouseenter', function (d) {
        // console.log('Entered ' + d.name);
        var country = d3.select(this);
        if (!country.classed('visible')) {
          return;
        }

        var mouseCoords = d3.mouse(this);
        var cData: any = country.datum();
        var prize_string = (cData.number === 1) ? ' prize in ' : ' prizes in ';
        that.tooltip.select('h2').text(cData.name);
        that.tooltip.select('p').text(cData.number + prize_string + G.nbviz.activeCategory);
        var borderColor = (G.nbviz.activeCategory === G.nbviz.ALL_CATS) ? 'goldenrod' : G.nbviz.categoryFill(G.nbviz.activeCategory);
        that.tooltip.style('border-color', borderColor);
        var countryClass = cData.name.replace(/ /g, '-');

        var w = parseInt(that.tooltip.style('width')),
          h = parseInt(that.tooltip.style('height'));
        that.tooltip.style('top', (mouseCoords[1]) - h + 'px');
        that.tooltip.style('left', (mouseCoords[0] - w / 2) + 'px');

        d3.select(this).classed('active', true);
      })
      .on('mouseout', function (d) {
        that.tooltip.style('left', '-9999px');
        d3.select(this).classed('active', false);
      });

    countries
      .attr('name', function (d) {
        return d.name;
      })
      .classed('visible', true)
      .transition().duration(G.nbviz.TRANS_DURATION)
      .style('opacity', 1)
      .attr('d', (d) => {
        return that.path(d.geo);
      });

    countries.exit()
      .classed('visible', false)
      .transition().duration(G.nbviz.TRANS_DURATION)
      .style('opacity', 0);

    var centroids = this.svg.select('.centroids').selectAll(".centroid")
      .data(mapData, function (d) {
        return d.name;
      });

    centroids.enter().append('circle').attr("class", "centroid");
    centroids.attr("name", (d) => {
      return d.name;
    })
      .attr("cx", (d) => {
        return this.getCentroid(d)[0];
      })
      .attr("cy", (d) => {
        return this.getCentroid(d)[1];
      })
      .classed('active', function (d) {
        return d.name === G.nbviz.activeCountry;
      })
      .transition().duration(G.nbviz.TRANS_DURATION)
      .style('opacity', 1)
      .attr("r", (d) => {
        return this.radiusScale(+d.number);
      });

    centroids.exit().style('opacity', 0);

  };
}
