import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AframeComponent } from './aframe.component';

describe('AframeComponent', () => {
  let component: AframeComponent;
  let fixture: ComponentFixture<AframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
