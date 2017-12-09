import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocuFesListComponent } from './docu-fes-list.component';

describe('DocuFesListComponent', () => {
  let component: DocuFesListComponent;
  let fixture: ComponentFixture<DocuFesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocuFesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocuFesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
