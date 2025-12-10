import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiqaatEditComponent } from './miqaat-edit.component';

describe('MiqaatEditComponent', () => {
  let component: MiqaatEditComponent;
  let fixture: ComponentFixture<MiqaatEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiqaatEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiqaatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

