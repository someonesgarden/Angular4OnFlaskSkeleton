import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

@Component({
  selector: 'app-underscore',
  templateUrl: './underscore.component.html',
  styleUrls: ['./underscore.component.css']
})
export class UnderscoreComponent implements OnInit {
  journeys = [
    {period: 'morning', times: [44, 34, 56, 31]},
    {period: 'evening', times: [35, 33]},
    {period: 'morning', times: [33, 29, 35, 41]},
    {period: 'evening', times: [24, 45, 27]},
    {period: 'morning', times: [18, 24, 28]}
  ];
  nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() {
    const items = ['F', 'C', 'C', 'A', 'B', 'A', 'C', 'E', 'F'];
    const tes = _.countBy(items);
    console.log('test!!!!');
    console.log(tes);
    const Counter = function(inc){
      let count = 0;
      const add = function(){
        count += inc;
        console.log('Current count: ' + count);
      };
      return add;
    };

    const inc2 = Counter(2);
    inc2();
    inc2();
  }
  ngOnInit() {
    const groups = _.groupBy(this.journeys, 'period');
    let mTimes = _.pluck(groups['morning'], 'times');
    console.log('mTimes', mTimes);
    mTimes = _.flatten(mTimes);
    console.log('mTimes', mTimes);
    const average = function(l){
      const sum = _.reduce(l, function(a: number, b: number){return a + b; }, 0);
      return sum / l.length;
    };
    console.log('Average is ' + average(mTimes));
    const sum = this.nums.filter(function(o){ return o % 2; })
      .map(function(o){ return o * o; })
      .reduce(function(a, b){return a + b; });
    console.log('sum of the odd square is ' + sum);
  }
}
