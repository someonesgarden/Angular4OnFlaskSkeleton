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
  selector: 'app-docu-fes-list',
  templateUrl: './docu-fes-list.component.html',
  styleUrls: ['./docu-fes-list.component.css']
})
export class DocuFesListComponent implements OnInit {

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
        this.listFrom = 1;
  }

  ngOnInit() {
  }

  loadData(): void {
     if(G.env.$DB_TYPE=='firebase') {
         this.firebaseservice.query_collection_itemref('docfes_list', this.listFrom, this.listTo).snapshotChanges()
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
    this.firebaseservice.object_from_key('docfes_list', _id).valueChanges().subscribe(data => {
          this.modal1.title = data.title;
          this.modal1.thumb = '/static/images/idfa/'+data.work_imgs_local;
          this.modal1.story = data.story;
          this.modal1.extra = "";
          if(data.etc){
            this.modal1.extra += data.etc;
          }
    });
    jQuery('#modal1').modal('show');
  }
}
