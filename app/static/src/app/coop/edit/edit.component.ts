import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {Book} from '../../models/book';

@Component({
  selector: 'edit-book',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  unko:string = "うんこ";
  @Input() item:Book;
  @Output() edited = new EventEmitter<Book>();

  onsubmit(){
    console.log("onsubmit");
    this.edited.emit(this.item);
  }


}
