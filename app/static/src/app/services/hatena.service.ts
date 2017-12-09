import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams} from "@angular/http";
import { Observable} from "rxjs/Observable";

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class HatenaService {

  url = 'http://gihyo.jp/'; //検索先のURL
  count = 0;    // ブックマーク件数
  comments:string[] = []; //ブックマークコメント

  constructor(
    private jsonp: Jsonp
  ) { }

  //はてなブックマークエントリー情報取得
  search_bookmarks(url:string): Observable<any> {
    let params = new URLSearchParams();
    params.set('url', url);
    params.set('callback', 'JSONP_CALLBACK');

    return this.jsonp.get('http://b.hatena.ne.jp/entry/jsonlite/', {search:params})
      .map(
        response => {
          return response.json() || {};
        }
      )
      .catch(
        error=> {
          return Observable.throw(error.statusText);
        }
      );
  }

  testCall(url:string){

    console.log('testCall with...', url);

    this.search_bookmarks(url).subscribe(
      data => {
        let result:string[] = [];
        data.bookmarks.forEach(function(value:any){
          if(value.comment !== ''){
            result.push(value.comment)
          }
        });
        this.comments = result;
        this.count = data.count;

        console.log(this.comments);
        console.log(this.count);
      },
       error => {
        this.count = 0;
        this.comments = [];
        console.log('はてなサービスのアクセスに失敗しました。');
       }
    );

  }
}
