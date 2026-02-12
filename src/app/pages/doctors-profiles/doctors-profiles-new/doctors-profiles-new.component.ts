import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';

@Component({
  selector: 'app-doctors-profiles-new',
  templateUrl: './doctors-profiles-new.component.html',
  styleUrls: ['./doctors-profiles-new.component.scss']
})
export class DoctorsProfilesNewComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  isEditMode = false;
  doctorId: number;
  doctorData: any = {};

  // Static data for the doctor profile
  doctorProfile = {
    id: 1,
    name: 'Dr. Bhavneet Singh, DDS',
    npiNumber: '1417537291',
    imageDescription: 'Bhavneet Singh, DDS',
    about: `Dr. Bhavneet Singh is a highly skilled and compassionate dentist with over 10 years of experience in providing comprehensive dental care. He received his Doctor of Dental Surgery (DDS) degree from New York University College of Dentistry, where he graduated with honors.

Dr. Singh is committed to staying at the forefront of dental technology and techniques, regularly attending continuing education courses and professional development seminars. He specializes in cosmetic dentistry, restorative procedures, and preventive care, ensuring that each patient receives personalized treatment plans tailored to their unique needs.

When not in the office, Dr. Singh enjoys spending time with his family, playing golf, and volunteering at local community health events. He believes in building lasting relationships with his patients and creating a comfortable, welcoming environment for everyone who visits his practice.`,
    isPublished: true,
    locations: [
      {
        id: 1,
        code: 'DN',
        name: 'Downtown Newark',
        address: '240 Mulberry Street, 2nd floor, Newark, NJ, 07102',
        phone: '973-755-3500'
      },
      {
        id: 2,
        code: 'BA',
        name: 'Bloomfield Avenue Newark',
        address: '539 Bloomfield Avenue, Suite 3, Newark, NJ, 07107',
        phone: '973-604-1600'
      },
      {
        id: 3,
        code: 'PA',
        name: 'Park Avenue East Orange',
        address: '90 Washington Street, Suite 309, East Orange, NJ, 07017',
        phone: '973-604-1900'
      }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastrMessageService: ToastrMessageService,
    private recordCreationService: RecordCreationService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorData();
      }
    });
  }

  createForm(): void {
    this.form = this.fb.group({
      npiNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      imageDescription: ['', Validators.required],
      about: ['', Validators.required],
      isPublished: [true]
    });
  }

  loadDoctorData(): void {
    // In a real application, this would come from a service
    this.doctorData = this.doctorProfile;
    this.form.patchValue({
      npiNumber: this.doctorData.npiNumber,
      imageDescription: this.doctorData.imageDescription,
      about: this.doctorData.about,
      isPublished: this.doctorData.isPublished
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.valid) {
      const formData = this.form.value;
      
      if (this.isEditMode) {
        // Update existing doctor profile
        const updatedData = {
          ...this.doctorData,
          ...formData,
          table: 'Doctor Profile'
        };
        this.recordCreationService.announceUpdate(updatedData);
        this.toastrMessageService.showSuccess('Doctor profile updated successfully', 'Success');
      } else {
        // Create new doctor profile
        const newData = {
          id: Date.now(), // In real app, this would come from backend
          ...formData,
          table: 'Doctor Profile'
        };
        this.recordCreationService.announceInsert(newData);
        this.toastrMessageService.showSuccess('Doctor profile created successfully', 'Success');
      }
      
      this.router.navigate(['/doctors-profiles']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/doctors-profiles']);
  }

  onSaveProfile(): void {
    this.onSubmit();
  }

  onViewProfile(): void {
    // This would open the public profile view
    this.toastrMessageService.showInfo('View profile functionality will be implemented', 'Info');
  }

  get f() {
    return this.form.controls;
  }
}
