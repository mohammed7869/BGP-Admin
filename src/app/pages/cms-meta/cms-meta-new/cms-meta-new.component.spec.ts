import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsMetaNewComponent } from './cms-meta-new.component';

describe('CmsMetaNewComponent', () => {
  let component: CmsMetaNewComponent;
  let fixture: ComponentFixture<CmsMetaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsMetaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsMetaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
