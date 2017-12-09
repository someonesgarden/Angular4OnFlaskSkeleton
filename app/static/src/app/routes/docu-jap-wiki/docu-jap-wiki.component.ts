import { Component, OnInit } from '@angular/core';
// Services
import {FirebaseService} from "../../services/firebase.service";
import * as G from '../../../globals';
declare var jQuery: any;

@Component({
  selector: 'app-docu-jap-wiki',
  templateUrl: './docu-jap-wiki.component.html',
  styleUrls: ['./docu-jap-wiki.component.css']
})
export class DocuJapWikiComponent implements OnInit {

  documentaries = [];
  data_isready = false;

    modal2 = {
    title:"",
    thumb:"",
    story:"",
    ja_title:"",
    extra:""
  };

    more_button_visible = true;
    listFrom:number = 0;
    listTo:number = 100;


  constructor(
    private firebaseservice: FirebaseService
  ) {
      this.loadData();
          this.listFrom = 1;
  }

  ngOnInit() {
  }

  loadData(): void {
     if(G.env.$DB_TYPE=='firebase') {
         this.firebaseservice.query_collection_itemref('docu_jap_wiki', this.listFrom, this.listTo).snapshotChanges()
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
    this.firebaseservice.object_from_key('docu_jap_wiki', _id).valueChanges().subscribe(data => {
          this.modal2.title = data.title;
          this.modal2.story = "";

          this.modal2.thumb = '/static/images/docu_jap_wiki/'+data.work_imgs_local;

          if(data.story){
                  this.modal2.story = data.story;
          }
          this.modal2.ja_title = data.ja_title;

          this.modal2.extra = "";
          if(data.ja_story){
            this.modal2.story += data.ja_story;
          }
          if(data.country){
            this.modal2.extra += data.country;
          }
          if(data.language){
            this.modal2.extra += "<br>";
            this.modal2.extra += data.language;
          }
          if(data.category){
            this.modal2.extra += "<br>";
            this.modal2.extra +=data.category;
          }
          if(data.year){
            this.modal2.extra += "<br>";
            this.modal2.extra +=data.year;
          }
          if(data.running_time){
            this.modal2.extra += "<br>";
            this.modal2.extra +=data.running_time;
          }
          if(data.distributions){
            this.modal2.extra += "<br>";
            this.modal2.extra += data.distributions;
          }
    });
    jQuery('#modal2').modal('show');
  }

}
