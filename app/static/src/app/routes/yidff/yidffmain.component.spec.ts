import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YidffmainComponent } from './yidffmain.component';

describe('YidffmainComponent', () => {
  let component: YidffmainComponent;
  let fixture: ComponentFixture<YidffmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YidffmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YidffmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
