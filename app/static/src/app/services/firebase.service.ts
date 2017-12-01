import { AngularFirestore } from 'angularfire2/firestore';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
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

  jason_to_firebase(data): void {
    let itemList = this.af.list('/todos');
    itemList.push(data);
  }

}
