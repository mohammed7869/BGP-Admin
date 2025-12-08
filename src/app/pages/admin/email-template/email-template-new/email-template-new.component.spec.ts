import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateNewComponent } from './email-template-new.component';

describe('EmailTemplateNewComponent', () => {
  let component: EmailTemplateNewComponent;
  let fixture: ComponentFixture<EmailTemplateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
