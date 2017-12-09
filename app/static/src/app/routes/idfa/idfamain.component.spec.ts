import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdfamainComponent } from './idfamain.component';

describe('IdfamainComponent', () => {
  let component: IdfamainComponent;
  let fixture: ComponentFixture<IdfamainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdfamainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdfamainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
