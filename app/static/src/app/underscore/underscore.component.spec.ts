import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderscoreComponent } from './underscore.component';

describe('UnderscoreComponent', () => {
  let component: UnderscoreComponent;
  let fixture: ComponentFixture<UnderscoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnderscoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
