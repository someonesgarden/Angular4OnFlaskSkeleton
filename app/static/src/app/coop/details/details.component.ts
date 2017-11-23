import { Component, OnInit, Input} from '@angular/core';
import {Book} from '../../models/book'

@Component({
  selector: 'detail-book',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  private _item:Book;

  @Input()
  set item(_item:Book){
    this._item = _item;
  }

  get item(){
    return this._item;
  }

}
