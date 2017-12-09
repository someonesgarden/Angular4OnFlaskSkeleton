import { Component} from '@angular/core';
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
//Components
import * as G from '../../../globals';
declare var jQuery: any;
// Services
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-documentaries',
  templateUrl: './documentaries.component.html',
  styleUrls: ['./documentaries.component.css']
})
export class DocumentariesComponent implements OnInit {

  documentaries = [];
  data_isready = false;
  more_button_visible = true;
  listFrom:number = 0;
  listTo:number = 100;

  modal1 = {
    title:"",
    thumb:"",
    story:"",
    ja_title:"",
    extra:""
  };

  constructor(
    private firebaseservice: FirebaseService
  ) {
    this.loadData();
  }

  ngOnInit() { }

  loadData(): void {
     if(G.env.$DB_TYPE=='firebase') {
         this.firebaseservice.query_collection_itemref('docu_from_wiki', this.listFrom, this.listTo).snapshotChanges()
         .subscribe(actions => {

           if(actions.length==0){
             this.more_button_visible = false;
           }else{
             this.more_button_visible  = true;
           }

           actions.forEach(action => {
             let val = action.payload.val();
             val._id = action.key;
             this.documentaries.push(val);
           });
           console.log(this.documentaries);
           // G.nbviz.data.winnersData = fire_winners_all;
           this.data_isready = true;
         });
     }
  }

    loadMoreLists(): void {
        this.listFrom += 100;
        this.listTo += 100;
        this.loadData();
  }

  editItem(_id:number):void{
    console.log(_id);
    this.firebaseservice.object_from_key('docu_from_wiki', _id).valueChanges().subscribe(data => {
          this.modal1.title = data.title;
          this.modal1.thumb = '/static/images/docu_from_wiki/'+data.work_imgs_local;
          this.modal1.story = data.story;
          this.modal1.ja_title = data.ja_title;

          this.modal1.extra = "";
          if(data.ja_story){
            this.modal1.story += data.ja_story;
          }
          if(data.country){
            this.modal1.extra += data.country;
          }
          if(data.language){
            this.modal1.extra += "<br>";
            this.modal1.extra += data.language;
          }
          if(data.category){
            this.modal1.extra += "<br>";
            this.modal1.extra +=data.category;
          }
          if(data.year){
            this.modal1.extra += "<br>";
            this.modal1.extra +=data.year;
          }
          if(data.running_time){
            this.modal1.extra += "<br>";
            this.modal1.extra +=data.running_time;
          }
          if(data.distributions){
            this.modal1.extra += "<br>";
            this.modal1.extra += data.distributions;
          }
    });
    jQuery('#modal1').modal('show');
  }
}
