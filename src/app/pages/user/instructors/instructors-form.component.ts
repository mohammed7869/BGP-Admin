import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-instructors-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label>Name</label>
        <input formControlName="name" />
      </div>
      <div>
        <label>Email</label>
        <input formControlName="email" />
      </div>
      <div>
        <label>Status</label>
        <select formControlName="status">
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Update' : 'Add' }} Instructor</button>
    </form>
  `
})
export class InstructorsFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: ['active', Validators.required]
    });
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.afs.collection('instructors').doc(this.id).valueChanges().subscribe((data: any) => {
        if (data) this.form.patchValue(data);
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (this.isEdit && this.id) {
      this.afs.collection('instructors').doc(this.id).update(this.form.value).then(() => {
        this.router.navigate(['/admin/user/instructors']);
      });
    } else {
      this.afs.collection('instructors').add(this.form.value).then(() => {
        this.router.navigate(['/admin/user/instructors']);
      });
    }
  }
} 