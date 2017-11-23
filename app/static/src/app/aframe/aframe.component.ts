import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aframe',
  templateUrl: './aframe.component.html',
  styleUrls: ['./aframe.component.css']
})
export class AframeComponent implements OnInit {

  constructor() { }
  ngOnInit() {
    AFRAME.registerComponent('test1', {
      init: function () {
        const thisentity = this.el;
        const color = thisentity.getAttribute('color');
        console.log('test1:color=', color);
        // thisentity.setAttribute('color', '#0000ff');
      }
    });
  }
}
