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
import {Book} from './models/book';
import 'rxjs/add/operator/map';
import {MenuComponent} from './menu/menu.component';

// python Eveからmongo読み込み時にJSONになるように。
const headers = new Headers({'Accept': 'application/json'});
const options = new RequestOptions({headers: headers});
import {trigger, state, style, transition, animate, keyframes, group} from '@angular/animations';
import * as G from '../globals';
import * as d3 from 'd3';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class AppComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy {

  q = d3.queue();
  resString = '';
  test = 'テスト';
  @ViewChildren(MenuComponent) children: QueryList<MenuComponent>;

  constructor(private sanitizer: DomSanitizer, private http: Http) {
    console.log('constructor');
    this.q.defer(d3.json, '/assets/data/world-110m.json');
    this.q.defer(d3.csv, '/assets/data/world-country-names-nobel.csv');
    this.q.defer(d3.json, '/assets/data/winning_country_data.json');

    if (G.env.$STATIC_API) {
      this.q.defer(this.getDataFromAPI, '_winners');
    } else {
      this.q.defer(this.getDataFromAPI, G.query_winners);
    }

    this.httpGetJSON(G.env.$EVE_API + G.query_winners).subscribe(
      (data) => {
        this.children.first.menuInit();
      }
    )

    this.q.await(this.ready);
  }

  httpGetJSON(url) {
      url = G.env.$EVE_API + G.query_winners;
    return this.http.get(url, options).map((res: Response) => res.json());
  }

  onchange(): void {
    // console.log('onchange');
  }

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
    // console.log('APP:ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    // console.log('APP:ngAfterViewChecked');
  }

  ngOnDestroy(): void {
    //  console.log('ngOnDestroy');
  }

  onclick(book: Book): void {
    console.log(book);
  }

  onedited(book: Book): void {
    console.log(book);
  }

  ready(error, worldMap, countryNames, countryData, winnersData): void {
    console.log('ready');
    // LOG ANY ERROR TO CONSOLE
    if (error) {
      return console.warn(error);
    }
    // console.log('countryData');
    // console.log(countryData);
    // console.log('winnersData');
    // console.log(winnersData);
    // STORE OUR COUNTRY-DATA DATASET
    G.nbviz.data.countryData = countryData;
    // MAKE OUR FILTER AND ITS DIMENSIONS
    G.nbviz.makeFilterAndDimensions(winnersData);
    // // INITIALIZE MENU AND MAP
    // nbviz.initMenu();

    G.nbviz.initMap(worldMap, countryNames);
    G.nbviz.onDataChange();
  }

  onReady(): void {
        // console.log('this.children');
        // console.log(this.children.length);
  }

// $EVE.API
  getDataFromAPI(resource, callback) {
    console.log('getDataFromAPI:', G.env.$EVE_API + resource);
    d3.json(G.env.$EVE_API + resource, function (error, data: any) {
      if (error) {
        console.log('error');
        return callback(error);
      }

      if ('_items' in data) {
        callback(null, data._items);
      } else {
        callback(null, data);
      }
    });
  }
}
