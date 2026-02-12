import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsMetaService } from 'src/app/providers/services/cms-meta.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';

@Component({
  selector: 'app-cms-meta-new',
  templateUrl: './cms-meta-new.component.html',
  styleUrls: ['./cms-meta-new.component.scss']
})
export class CmsMetaNewComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: CmsMetaService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService) { }

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data['recordData'])
      this.recordData = this.route.snapshot.data['recordData'];
    if (this.recordData) {
      this.setFormValues();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      metaKey: ['', [Validators.required]],
      metaValue: ['', [Validators.required]]
    });
  }

  setFormValues(): void {
    this.form.patchValue({
      id: this.recordData.id,
      metaKey: this.recordData.metaKey,
      metaValue: this.recordData.metaValue
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.submitLoading = true;
      var fdata = this.form.value;

      if (fdata.id) {
        this.service.update(fdata)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess('Record updated successfully', 'Success');
              this.recordCreationService.announceUpdate({
                table: 'CMS Meta',
                id: fdata.id,
                metaKey: fdata.metaKey,
                metaValue: fdata.metaValue
              });
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showError('Error updating record', 'Error');
            }
          );
      } else {
        this.service.create(fdata)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess('Record created successfully', 'Success');
              this.recordCreationService.announceInsert({
                table: 'CMS Meta',
                id: data,
                metaKey: fdata.metaKey,
                metaValue: fdata.metaValue
              });
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showError('Error creating record', 'Error');
            }
          );
      }
    }
  }

  onBack(): void {
    this.location.back();
  }
}
