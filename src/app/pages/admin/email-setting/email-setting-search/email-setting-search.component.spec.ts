import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSettingSearchComponent } from './email-setting-search.component';

describe('EmailSettingSearchComponent', () => {
  let component: EmailSettingSearchComponent;
  let fixture: ComponentFixture<EmailSettingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailSettingSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSettingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
