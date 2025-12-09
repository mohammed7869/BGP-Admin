import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTagSearchComponent } from './cms-tag-search.component';

describe('CmsTagSearchComponent', () => {
  let component: CmsTagSearchComponent;
  let fixture: ComponentFixture<CmsTagSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsTagSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsTagSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
