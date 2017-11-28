///<reference path="../../../node_modules/@types/d3-selection/index.d.ts"/>
import {Component, OnInit, ElementRef} from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import * as d3 from 'd3';
import * as G from '../../globals';

declare var jQuery: any;


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  @Output() onvoted = new EventEmitter<String>();

  searthtxt = '...';
  menu_show = true;
  catList = null;
  selectData = null;

  constructor(private elementRef: ElementRef) {
    this.catList = [G.nbviz.ALL_CATS].concat(G.nbviz.CATEGORIES);
    this.selectData = G.nbviz.COUNTRIES;
  }

  ngOnInit() {
    setTimeout(function () {
      jQuery('.ui.dropdown').dropdown();
      jQuery('.ui.radio.checkbox').checkbox();
    }, 1000);
  }


  menuInit() {
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
    G.nbviz.onDataChange();
  }

  genderSelect(ev: any): void {
    const gender = ev.target.value;
    console.log('gender', gender);
    if (gender === 'All') {
      G.nbviz.genderDim.filter();
    } else {
      G.nbviz.genderDim.filter(gender);
    }
    G.nbviz.onDataChange();
  }

  metricRadio(ev: any): void {
    const val = ev.target.value;
    // noinspection TsLint
    G.nbviz.valuePerCapita = parseInt(val);
    G.nbviz.onDataChange();
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
    G.nbviz.onDataChange();
  }
}
