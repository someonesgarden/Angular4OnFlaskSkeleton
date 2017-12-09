import {Component} from '@angular/core';
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
import {HatenaService} from "./services/hatena.service";
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: []
})
export class AppComponent implements
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy {

  constructor(
      private hatenaservice:HatenaService
  ) {}

  //---- Component LifeCycle --------------------------
  ngOnChanges(): void {
    // console.log('App:ngOnChanges');
  }

  ngOnInit(): void {
   // console.log('App:NgOnInit');
    this.hatenaservice.testCall('http://google.co.jp/');
  }

  ngDoCheck(): void {
    // console.log('App:ngDoCheck');
  }

  ngAfterContentInit(): void {
    // console.log('App:ngAfterContentInit');

      jQuery('#js-sidebar').click(function() {
        jQuery('.ui.sidebar').sidebar('toggle');
      });
  }

  ngAfterContentChecked(): void {
    // console.log('App:ngAfterContentChecked');
  }

  ngAfterViewInit(): void {
    // console.log('App::ngAfterViewInit');
  }

  ngAfterViewChecked(): void {
    // console.log('App:ngAfterViewChecked');
  }

  ngOnDestroy(): void {
   //  console.log('App:ngOnDestroy');
  }
}
