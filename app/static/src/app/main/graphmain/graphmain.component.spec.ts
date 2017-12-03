import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphmainComponent } from './graphmain.component';

describe('GraphmainComponent', () => {
  let component: GraphmainComponent;
  let fixture: ComponentFixture<GraphmainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphmainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
