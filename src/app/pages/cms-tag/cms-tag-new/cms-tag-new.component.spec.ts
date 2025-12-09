import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTagNewComponent } from './cms-tag-new.component';

describe('CmsTagNewComponent', () => {
  let component: CmsTagNewComponent;
  let fixture: ComponentFixture<CmsTagNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsTagNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsTagNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
