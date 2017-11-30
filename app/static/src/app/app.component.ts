import {Component, QueryList, ViewChildren} from '@angular/core';
import {
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {MenuComponent} from './menu/menu.component';
import {GraphmainComponent} from './graphmain/graphmain.component';
import * as G from '../globals';
import * as d3 from 'd3';

const headers = new Headers({'Accept': 'application/json'}); // python Eveからmongo読み込み時にJSONに。
const options = new RequestOptions({headers: headers});


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class AppComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {

  q = d3.queue();

  @ViewChildren(MenuComponent) menus: QueryList<MenuComponent>;
  @ViewChildren(GraphmainComponent) graphmains: QueryList<GraphmainComponent>;


  constructor(private sanitizer: DomSanitizer, private http: Http) {

    this.loadJsonData();

  }


  //--------------------------- Component LifeCycle
  ngOnChanges(): void {
    // console.log('ngOnChanges');
  }

  ngOnInit(): void {
    // console.log('ngOnInit');
  }

  ngDoCheck(): void {
    // console.log('ngDoCheck');
  }

  ngAfterContentInit(): void {
    // console.log('ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    // console.log('ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
     console.log('APP:ngAfterViewInit');
     G.nbviz.rootComp = this;
     G.nbviz.menuComp = this.menus.first;
     G.nbviz.graphComp = this.graphmains.first;
  }

  ngAfterViewChecked(): void {
    // console.log('APP:ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    //  console.log('ngOnDestroy');
  }


  // ---------------- Functions -------------------


  loadJsonData(): void {

    this.httpGetJSON(G.env.$EVE_API + G.nbviz.query_winners).subscribe(
      (data) => {

        if ('_items' in data) {
          G.nbviz.data.winnersData = data._items;
        }
        else {
          G.nbviz.data.winnersData = data;
        }
        this.q.defer(d3.json, '/assets/data/world-110m.json');
        this.q.defer(d3.csv, '/assets/data/world-country-names-nobel.csv');
        this.q.defer(d3.json, '/assets/data/winning_country_data.json');
        this.q.await(this.ready);
      }
    )
  }

  httpGetJSON(url) {
      url = G.env.$EVE_API + G.nbviz.query_winners;
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  onchange(): void {
    console.log('onchange');
  }

  ready(error, worldMap, countryNames, countryData): void {
    console.log('ready');
    // LOG ANY ERROR TO CONSOLE
    if (error) {
      return console.warn(error);
    }

    G.nbviz.data.countryData = countryData; // STORE OUR COUNTRY-DATA DATASET
    G.nbviz.makeFilterAndDimensions(); // MAKE OUR FILTER AND ITS DIMENSIONS
    G.nbviz.menuComp.initMenu();
    G.nbviz.graphComp.d3Map.initMap(worldMap, countryNames); // INITIALIZE MAP
    G.nbviz.filterByCountries([]);
    G.nbviz.menuComp.onDataChange();
  }
}
