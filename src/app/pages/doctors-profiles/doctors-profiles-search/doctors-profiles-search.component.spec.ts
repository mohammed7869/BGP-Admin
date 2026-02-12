import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsProfilesSearchComponent } from './doctors-profiles-search.component';

describe('DoctorsProfilesSearchComponent', () => {
  let component: DoctorsProfilesSearchComponent;
  let fixture: ComponentFixture<DoctorsProfilesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsProfilesSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsProfilesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
