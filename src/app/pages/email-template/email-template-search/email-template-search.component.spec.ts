import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailTemplateSearchComponent } from './email-template-search.component';

describe('EmailTemplateSearchComponent', () => {
  let component: EmailTemplateSearchComponent;
  let fixture: ComponentFixture<EmailTemplateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailTemplateSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailTemplateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
