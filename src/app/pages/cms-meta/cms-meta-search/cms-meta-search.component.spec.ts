import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMetaSearchComponent } from './cms-meta-search.component';

describe('CmsMetaSearchComponent', () => {
  let component: CmsMetaSearchComponent;
  let fixture: ComponentFixture<CmsMetaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsMetaSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMetaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
