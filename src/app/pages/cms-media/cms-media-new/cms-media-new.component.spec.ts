import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMediaNewComponent } from './cms-media-new.component';

describe('CmsMediaNewComponent', () => {
  let component: CmsMediaNewComponent;
  let fixture: ComponentFixture<CmsMediaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsMediaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMediaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
