import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsProfilesNewComponent } from './doctors-profiles-new.component';

describe('DoctorsProfilesNewComponent', () => {
  let component: DoctorsProfilesNewComponent;
  let fixture: ComponentFixture<DoctorsProfilesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsProfilesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsProfilesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
