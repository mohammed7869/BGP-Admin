import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSettingNewComponent } from './email-setting-new.component';

describe('EmailSettingNewComponent', () => {
  let component: EmailSettingNewComponent;
  let fixture: ComponentFixture<EmailSettingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSettingNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSettingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
