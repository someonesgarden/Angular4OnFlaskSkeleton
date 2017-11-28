import {Component, QueryList, ViewChildren} from '@angular/core';
import {OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Http, Response, RequestOptions, Headers} from '@angular/http';
import {Book} from './models/book';
import {ChildComponent} from './components/child/child.component';
import 'rxjs/add/operator/map';
// python Eveからmongo読み込み時にJSONになるように。
const headers = new Headers({ 'Accept': 'application/json' });
const options = new RequestOptions({ headers: headers });


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

  img = 'http://livedoor.blogimg.jp/booq/imgs/2/b/2b384c0c.jpg';
  msg = '<h1><strong>test</strong></h1>';
  q = d3.queue();
  resString = '';

  // ChildComponent
  @ViewChildren(ChildComponent) children: QueryList<ChildComponent>;

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
      this.q.await(this.ready);
  }
  //   httpGet(url) {
  //     url = G.env.$EVE_API + G.query_winners;
  //   return this.http.get(url, options).map((res: Response) => res.json());
  // }

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
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    // console.log('ngAfterViewChecked');
    // this.children.forEach((item, index) => {
    //   if (this.poems[index] !== item.poem) {
    //     setTimeout(() => {
    //       this.poems[index] = item.poem;
    //     }, 0);
    //   }
    // });
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

ready(error, worldMap, countryNames, countryData, winnersData) {
  console.log('ready');
  // LOG ANY ERROR TO CONSOLE
  if (error) {
    return console.warn(error);
  }

  console.log('countryData');
  console.log(countryData);
  // console.log(countryNames);
  // console.log(worldMap);
  console.log('winnersData');
  console.log(winnersData);

  // STORE OUR COUNTRY-DATA DATASET
  G.nbviz.data.countryData = countryData;
  // MAKE OUR FILTER AND ITS DIMENSIONS
  G.nbviz.makeFilterAndDimensions(winnersData);
  // // INITIALIZE MENU AND MAP
  // nbviz.initMenu();

  G.nbviz.initMap(worldMap, countryNames);
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  G.nbviz.onDataChange();
}

// $EVE_API (by default 'http://localhost:5000/api/') is set in
// index.html (STATIC FILES) and templates/index.html (MONGODB EVE API);
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
