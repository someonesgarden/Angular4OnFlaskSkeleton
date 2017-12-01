///<reference path="../../../node_modules/@types/d3-selection/index.d.ts"/>
import {Component, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
//Services
import {ListService} from '../services/list.service';
import {D3mapService} from '../services/d3map.service';
import {TimegraphService} from "../services/timegraph.service";
import {BargraphService} from "../services/bargraph.service";
// Commons
import * as G from '../../globals';
// Declare
declare var jQuery: any;


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @Output() onvoted = new EventEmitter<String>();

  searthtxt = '...';
  menu_show = true;
  catList = null;
  selectData = null;
  graphmainComp = null;

  constructor(
    private elementRef: ElementRef,
    private listservice: ListService,
    private d3mapservice: D3mapService,
    private timegraphservice: TimegraphService,
    private bargraphservice: BargraphService
  ) {
    this.catList = [G.nbviz.ALL_CATS].concat(G.nbviz.CATEGORIES);
  }


  //--- Component LifeCycle ----------------------------
  ngOnInit() {
    setTimeout(function () {
      jQuery('.ui.dropdown').dropdown();
      jQuery('.ui.radio.checkbox').checkbox();
    }, 1000);
  }

  ngAfterViewInit(): void{
  }

  //-- Functions ----------------------------------------
  initMenu() {
    console.log('MENU:menuInit');
    const nats = G.nbviz.countrySelectGroups = G.nbviz.countryDim.group().all()
      .sort(function (a, b) {
        return b.value - a.value; // descending
      });

    const fewWinners = {1: [], 2: []};
    this.selectData = [G.nbviz.ALL_WINNERS];
    nats.forEach((o) => {
      if (o.value <= 2) {
        fewWinners[o.value].push(o.key);
      } else {
        this.selectData.push(o.key);
      }
    });

    this.selectData.push(
      G.nbviz.DOUBLE_WINNERS,
      G.nbviz.SINGLE_WINNERS
    );

    this.onDataChange();
  }

  initMapFromMenu(world, names): void {
    this.d3mapservice.initMap(world, names);
    this.onDataChange();
  }

  gotoLink(e: any, addr: string): void {
    console.log(e);
    e.stopPropagation();
    window.location.href = addr;
  }

  inputShow(e: any): void {
    e.stopPropagation();
    console.log(e.target.value);
  }

  submitSearch(input: string): void {
    console.log(input);
    this.searthtxt = '';
  }

  commuAction(ev) {
    this.onvoted.emit('test_commu');
    console.log('afasdf');
  }

  dropdownOpen(e: any): void {
    console.log('test');
    setTimeout(function () {
      jQuery('.ui.dropdown').dropdown();
      jQuery('.ui.radio.checkbox').checkbox();
      e.stopPropagation();
    }, 1000);
  }

  //////// ---------------  dataViz ------------------- ////
  catSelect(ev: any): void {
    const category = ev.target.value;
    G.nbviz.filterByCategory(category);
    this.onDataChange();
  }

  genderSelect(ev: any): void {
    const gender = ev.target.value;
    console.log('gender', gender);
    if (gender === 'All') {
      G.nbviz.genderDim.filter();
    } else {
      G.nbviz.genderDim.filter(gender);
    }
    this.onDataChange();
  }

  metricRadio(ev: any): void {
    const val = ev.target.value;
    // noinspection TsLint
    G.nbviz.valuePerCapita = parseInt(val);
    this.onDataChange();
  }

  countrySelect(ev: any): void {
    const country = ev.target.value;
    const fewWinners = {1: [], 2: []};
    let countries;
    if (country === G.nbviz.ALL_WINNERS) {
      countries = [];
    } else if (country === G.nbviz.DOUBLE_WINNERS) {
      countries = fewWinners[2];
    } else if (country === G.nbviz.SINGLE_WINNERS) {
      countries = fewWinners[1];
    } else {
      countries = [country];
    }

    G.nbviz.filterByCountries(countries);
    this.onDataChange();
  }

  onDataChange(): void {
    console.log('onDataChange');
    let data = this.getCountryData();
    this.bargraphservice.updateBarChart(data);
    this.d3mapservice.updateMap(data);

    this.listservice.updateList(G.nbviz.countryDim.top(Infinity));
    data = G.nbviz.nestDataByYear(G.nbviz.countryDim.top(Infinity));
    this.timegraphservice.updateTimeChart(data);
    }


    getCountryData() {
        const countryGroups = G.nbviz.countryDim.group().all();
        // make main data-ball
        const data = countryGroups.map( function(c) {
          let cData = G.nbviz.data.countryData[c.key];

          if(cData){
            let value = c.value;
            // if per-capita value then divide by pop. size
            if (G.nbviz.valuePerCapita) {
                value /= cData.population;
            }

            return {
                key: c.key,
                value: value,
                code: cData.alpha3Code,
                // population: cData.population
            };
            }

        }).sort(function(a, b) {
                return b.value - a.value; // descending
            });

        return data;
    }
}
