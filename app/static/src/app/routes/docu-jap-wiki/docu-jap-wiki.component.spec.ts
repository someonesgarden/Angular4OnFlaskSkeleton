import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocuJapWikiComponent } from './docu-jap-wiki.component';

describe('DocuJapWikiComponent', () => {
  let component: DocuJapWikiComponent;
  let fixture: ComponentFixture<DocuJapWikiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocuJapWikiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocuJapWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
