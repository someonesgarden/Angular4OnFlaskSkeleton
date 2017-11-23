import { Component, Input, SimpleChanges } from '@angular/core';
import {OnInit, DoCheck, OnChanges, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy} from'@angular/core';

@Component({
  selector: 'my-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})

export class ChildComponent implements OnInit, DoCheck, OnChanges, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  ngOnChanges(changes :SimpleChanges): void {
    console.log("     [child] ngOnChanges");
    for(let prop in changes){
      let change = changes[prop];
      console.log(`${prop}:${change.previousValue} => ${change.currentValue}`)
    }
  }

  constructor() {
      console.log("   [child] constructor");
    }

   ngOnInit() {
      console.log("   [child] ngOnInit");
  }

  ngDoCheck(): void {
    console.log("   [child] ngDoCheck");
  }

  ngAfterContentInit(): void {
      console.log("   [child] ngAfterContentInit");
  }

  ngAfterContentChecked(): void {
      console.log("   [child] ngAfterContentChecked");
  }

  ngAfterViewInit(): void {
      console.log("   [child] ngAfterViewInit");
  }

  ngAfterViewChecked(): void {
      console.log("   [child] ngAfterViewChecked");
  }

  ngOnDestroy(): void {
      console.log("   [child] ngOnDestroy");
  }


  @Input() time:Date;
   @Input() index:number;

   poem: string;


}
