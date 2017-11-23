import {Component, QueryList, ViewChildren} from '@angular/core';
import {OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Book} from './models/book';
import {ChildComponent} from './components/child/child.component';

import {trigger, state, style, transition, animate, keyframes, group} from '@angular/animations';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
     trigger('btnState', [
      state('off', style({
        border: 'none',
        backgroundColor: '#000',
        color: '#fff',
        fontWeight: 'normal',
        transform: 'scale(0.8) rotate(0deg)'
      })),
      state('on',   style({
        border: 'solid 1px #fff',
        backgroundColor: '#f00',
        color: '#fff',
        fontWeight: 'bold',
        transform: 'scale(1) rotate(5deg)'
      })),
      transition('off => on', animate('1000ms linear')),
      transition('on => off', animate('200ms linear'))
    ]),
   trigger('labelState', [
      state('active', style({ transform: 'translateX(0)' })),
      transition('void => active', [
        style({transform: 'translateX(100%)'}),
        animate(300)
      ]),
      transition('* => void', [
        group([
          animate(800, style({ opacity: 0 })),
          animate('300ms 500ms', style({transform: 'translateX(100%)'}))
        ])
      ])
    ])


  ]
})
export class AppComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked, OnDestroy {

  show = true;
  current = new Date();

  poems = ['', '', ''];

  flag = 'off';
  caption = 'オフ';

  // テキストボックスの内容を区切り文字で分割

  selected: Book;

  books = [
    {
      isbn: '978-4-2341-1',
      title: '改訂版１２３',
      price: 2934,
      publisher: '技術評論社'
    },
    {
      isbn: '1234',
      title: '12344',
      price: 12345,
      publisher: 'あdふぁdf'
    },
    {
      isbn: '12345',
      title: 'sdadfasdf',
      price: 34534,
      publisher: 'SDFSDF'
    }
  ];


  // ChildComponentをsy
  @ViewChildren(ChildComponent) children: QueryList<ChildComponent>;

  constructor(private sanitizer: DomSanitizer) {
      console.log('constructor');
  }


  onchange(): void {
    this.show = !this.show;
    this.current = new Date();
    console.log('onchange');
  }

  ngOnChanges(): void {
    console.log('ngOnChanges');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngDoCheck(): void {
    console.log('ngDoCheck');
  }

  ngAfterContentInit(): void {
    console.log('ngAfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('ngAfterViewChecked');

    this.children.forEach((item, index) => {
      if (this.poems[index] !== item.poem) {
        setTimeout(() => {
          this.poems[index] = item.poem;
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
  }

  onclick(book: Book): void {
    console.log(book);
    this.selected = book;
  }

  onedited(book: Book): void {
    console.log(book);
    for (const item of this.books){
      if (item.isbn === book.isbn) {
        item.title = book.title;
        item.price = book.price;
        item.publisher = book.publisher;
      }
    }

    this.selected = null;
  }


  toggle() {
    this.flag = (this.flag === 'on' ? 'off' :  'on');
    this.caption = (this.caption === 'オン' ? 'オフ' :  'オン');
  }


}
