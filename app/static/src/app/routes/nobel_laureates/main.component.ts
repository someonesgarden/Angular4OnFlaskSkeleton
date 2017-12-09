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
// Components
import {MenuComponent} from './menu/menu.component';
import {GraphmainComponent} from './graphmain/graphmain.component';
import * as G from '../../../globals';
import * as d3 from 'd3';
// Services
import {FirebaseService} from "../../services/firebase.service";
import {isUndefined} from "util";
// Declare
declare var jQuery: any;

const headers = new Headers({'Accept': 'application/json'}); // python Eveからmongo読み込み時にJSONに。
const options = new RequestOptions({headers: headers});


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements
   OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  data_isready = false;
  user = null;
  q = d3.queue();

  @ViewChildren(MenuComponent) menus: QueryList<MenuComponent>;
  @ViewChildren(GraphmainComponent) graphmains: QueryList<GraphmainComponent>;

  constructor(
    private sanitizer: DomSanitizer,
    private http: Http,
    private firebaseservice: FirebaseService
  ) {
    this.loadJsonData();
  }

  //---- Component LifeCycle --------------------------
  ngOnChanges(): void {
    // console.log('ngOnChanges');
  }

  ngOnInit(): void {
    // this.firebaseservice.getAuthState().subscribe(
    //   function(user){
    //     this.user = user;
    //     console.log("firebase.user=",this.user);
    //   }
    // );
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

  // ----- Functions ----------------------------------
  loadJsonData(): void {

     // $DB_TYPE == "firevase"の場合
     if(G.env.$DB_TYPE=='firebase') {
       this.firebaseservice.query_collection_itemref('winners_all', 0, 0).snapshotChanges()
         .subscribe(actions => {
           let fire_winners_all = [];
           actions.forEach(action => {
             let val = action.payload.val();
             val._id = action.key;
             fire_winners_all.push(val);
           });
           G.nbviz.data.winnersData = fire_winners_all;
           this.q.defer(d3.json, '/assets/data/world-110m.json');
           this.q.defer(d3.csv, '/assets/data/world-country-names-nobel.csv');
           this.q.defer(d3.json, '/assets/data/winning_country_data.json');
           this.q.await(this.ready);
           this.data_isready = true;
         });
     }

     // $DB_TYPEが$EYE
     else {
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
           this.data_isready = true;
         }
       )

     }
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
    G.nbviz.data.countryData = countryData;
    G.nbviz.makeFilterAndDimensions();
    G.nbviz.menuComp.initMenu();
    G.nbviz.menuComp.initMapFromMenu(worldMap, countryNames);
    G.nbviz.filterByCountries([]);
    G.nbviz.menuComp.onDataChange();
  }
}
