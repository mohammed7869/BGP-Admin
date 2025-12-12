import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiqaatListComponent } from './miqaat-list.component';

describe('MiqaatListComponent', () => {
  let component: MiqaatListComponent;
  let fixture: ComponentFixture<MiqaatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiqaatListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiqaatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




