import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMessageSearchComponent } from './custom-message-search.component';

describe('CustomMessageSearchComponent', () => {
  let component: CustomMessageSearchComponent;
  let fixture: ComponentFixture<CustomMessageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMessageSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMessageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
