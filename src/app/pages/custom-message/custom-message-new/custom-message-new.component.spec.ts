import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMessageNewComponent } from './custom-message-new.component';

describe('CustomMessageNewComponent', () => {
  let component: CustomMessageNewComponent;
  let fixture: ComponentFixture<CustomMessageNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMessageNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMessageNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
