import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsPageDetailsComponent } from './cms-page-details.component';

describe('CmsPageDetailsComponent', () => {
  let component: CmsPageDetailsComponent;
  let fixture: ComponentFixture<CmsPageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsPageDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsPageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
