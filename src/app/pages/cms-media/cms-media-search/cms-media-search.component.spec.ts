import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMediaSearchComponent } from './cms-media-search.component';

describe('CmsMediaSearchComponent', () => {
  let component: CmsMediaSearchComponent;
  let fixture: ComponentFixture<CmsMediaSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsMediaSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMediaSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
