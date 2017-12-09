import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {Subject} from "rxjs/Subject";
import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';
import {AngularFireModule} from "angularfire2";

@Injectable()
export class FirebaseService {

  private authState: Observable<firebase.User>;
  private currentUser: firebase.User = null;

  items:Observable<any[]>;
  constructor(private afAuth: AngularFireAuth, private af: AngularFireDatabase) {

    this.authState = this.afAuth.authState;
    this.authState.subscribe(
      user => {
       if(user){
         this.currentUser = user;
       } else {
         this.currentUser = null;
       }
      });
  }

  getAuthState() {
    return this.authState;
  }

  // keyname = '/name'
  jason_to_firebase(data, keyname): void {
    let itemList = this.af.list(keyname);
    itemList.push(data);
  }

  read_collection(name): void {
    console.log('read_collection');
    let itemsRef = this.af.list(name, ref => ref.orderByChild('country').equalTo('France'));
    itemsRef.valueChanges()
      .subscribe(actions => {
        console.log('collection<'+name+'> is ready.');
        console.log(actions);
        // actions.forEach(action => {
        //   console.log(action);
        // });
      });
  }

  query_collection_itemref(name, from=0, to=100, key=null, value=null): any {
    console.log('read_collection');
    let itemsRef = null;

    if(key != null && value!=null){
      itemsRef = this.af.list(name, ref => ref.orderByChild(key).equalTo(value));
    }
    else{
      if(to==0){
        itemsRef = this.af.list(name);
      }else{
        itemsRef = this.af.list(name, ref => ref.orderByKey().startAt(String(from)).endAt(String(to)));
      }
    }
    return itemsRef;
  }

   query_collection(name, key, value): void {
    console.log('read_collection');
    let itemsRef = this.af.list(name, ref => ref.orderByChild(key).equalTo(value));
    itemsRef.valueChanges()
      .subscribe(actions => {
        console.log('collection<'+name+'> is ready.');
        console.log(actions);

      });
    }

    object_from_key(list, key):  any {

      this.object_update_key(list, key, {'title':'', 'category':'日本映画'});

      return this.af.object('/' + list + '/' + key);
    }

    // FirebaseのObjectを編集する
    object_update_key(list, key,data): any {

    // data = {'title':'newtitle', 'category':'日本映画'};

    let obj = this.af.object('/' + list + '/' + key);
      obj.update(data);
    }

    // object_from_key_tmp(key): void {
    //   this.af.object('/winners_all/' + key).valueChanges().subscribe(profile => {
    //     console.log('object_from_key=');
    //       //console.log(profile);
    //   })
    // }


}
