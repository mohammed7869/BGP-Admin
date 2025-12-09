import { Component, OnInit } from '@angular/core';
import { DatePipe, formatDate, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appCommon } from 'src/app/common/_appCommon';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from 'src/app/providers/services/blog.service';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { environment } from 'src/environments/environment';
import { CmsMediaService } from 'src/app/providers/services/cms-media.service';

@Component({
  selector: 'app-blog-new',
  templateUrl: './blog-new.component.html',
  styleUrls: ['./blog-new.component.scss']
})
export class BlogNewComponent implements OnInit {

  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  public Editor = ClassicEditor;
  public editorConfig: any = {
    placeholder: 'Enter blog post content...'
  };

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: BlogService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,
    private datePipe: DatePipe,
    private cmsMediaService: CmsMediaService) { }

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data['recordData'])
      this.recordData = this.route.snapshot.data['recordData'];
    if (this.recordData) {
      this.setFormValues();
    }
  }

  onEditorReady(editor: any): void {
    // Configure custom upload adapter when editor is ready
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new CustomUploadAdapter(loader, this.cmsMediaService, environment);
    };
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      contentType: ['Blog', [Validators.required]],
      authorName: ['', [Validators.required]],
      authorImageId: [0],
      title: ['', [Validators.required]],
      slug: ['', [Validators.required]],
      content: ['', [Validators.required]],
      excerpt: ['', [Validators.required]],
      featuredImageId: [0],
      blogStatus: ['Draft', [Validators.required]],
      visibility: ['Public', [Validators.required]],
      publishedDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]],
      tags: [''],
      metaInfo: [[]]
    })
  }

  setFormValues(): void {
    this.form.patchValue({
      id: this.recordData.id,
      contentType: this.recordData.contentType,
      authorName: this.recordData.authorName,
      authorImageId: this.recordData.authorImageId,
      title: this.recordData.title,
      slug: this.recordData.slug,
      content: this.recordData.content,
      excerpt: this.recordData.excerpt,
      featuredImageId: this.recordData.featuredImageId,
      blogStatus: this.recordData.blogStatus,
      visibility: this.recordData.visibility,
      publishedDate: this.datePipe.transform(this.recordData.publishedDate, "yyyy-MM-dd HH:mm"),
      tags: Array.isArray(this.recordData.tags) ? this.recordData.tags.join(', ') : this.recordData.tags || '',
      metaInfo: this.recordData.metaInfo || []
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
      
      // Convert tags string to array
      if (fdata.tags && typeof fdata.tags === 'string') {
        fdata.tags = fdata.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      } else if (!fdata.tags) {
        fdata.tags = [];
      }

      if (fdata.id) {
        this.service.update(fdata)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess("Blog post updated successfully.", "Success");
              var listRec = {
                table: 'Blog Post',
                id: this.form.value.id,
                title: this.form.value.title,
                authorName: this.form.value.authorName,
                contentType: this.form.value.contentType,
                blogStatus: this.form.value.blogStatus,
                visibility: this.form.value.visibility,
                publishedDate: this.form.value.publishedDate,
              };
              this.recordCreationService.announceUpdate(listRec);
              this.router.navigate(['blog']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showInfo(error.error.message || 'Error updating blog post', "Info");
            }
          )
      }
      else {
        this.service.create(fdata)
          .subscribe(
            data => {
              this.submitLoading = false;
              this.toastrMessageService.showSuccess("New blog post created successfully", "Success");
              var listRec = {
                table: 'Blog Post',
                id: data,
                title: this.form.value.title,
                authorName: this.form.value.authorName,
                contentType: this.form.value.contentType,
                blogStatus: this.form.value.blogStatus,
                visibility: this.form.value.visibility,
                publishedDate: this.form.value.publishedDate,
              };
              this.recordCreationService.announceInsert(listRec);
              this.router.navigate(['blog']);
            },
            error => {
              this.submitLoading = false;
              this.toastrMessageService.showInfo(error.error.message || 'Error creating blog post', "Info");
            }
          )
      }
    }
  }

  onCancel(): void {
    this.location.back();
  }

  generateSlug(): void {
    const title = this.form.get('title').value;
    if (title) {
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      this.form.patchValue({ slug: slug });
    }
  }

  onAuthorImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ authorImageId: image.id });
    }
  }

  onAuthorImageCleared(): void {
    this.form.patchValue({ authorImageId: 0 });
  }

  onFeaturedImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ featuredImageId: image.id });
    }
  }

  onFeaturedImageCleared(): void {
    this.form.patchValue({ featuredImageId: 0 });
  }

  /** Build full URL for featured image if available */
  getFeaturedImageFullUrl(post: any): string | undefined {
    if (post?.featuredImageUrl) {
      return environment.apiUrl + '/' + post.featuredImageUrl;
    }
    return undefined;
  }

  /** Build full URL for author image if available (no fallback) */
  getAuthorImageFullUrl(post: any): string | undefined {
    if (post?.authorImageUrl) {
      return environment.apiUrl + '/' + post.authorImageUrl;
    }
    return undefined;
  }
}

class CustomUploadAdapter {
  loader: any;
  cmsMediaService: CmsMediaService;
  environment: any;

  constructor(loader: any, cmsMediaService: CmsMediaService, environment: any) {
    this.loader = loader;
    this.cmsMediaService = cmsMediaService;
    this.environment = environment;
  }

  upload(): Promise<any> {
    return this.loader.file
      .then((file: File) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('mediaFile', file);
          formData.append('mediaType', 'Image');
          formData.append('isPublicMedia', 'true');
          formData.append('altText', file.name || 'CKEditor Image');
          formData.append('url', '');

          this.cmsMediaService.create(formData).subscribe(
            (response: any) => {
              let imageUrl = '';
              
              // Handle different response formats
              if (typeof response === 'string' || typeof response === 'number') {
                // If response is just ID, fetch the media details
                const mediaId = typeof response === 'number' ? response : parseInt(response);
                if (mediaId) {
                  this.cmsMediaService.getById(mediaId).subscribe(
                    (mediaData: any) => {
                      if (mediaData && mediaData.url) {
                        imageUrl = mediaData.url.startsWith('http') 
                          ? mediaData.url 
                          : `${this.environment.apiUrl}/${mediaData.url}`;
                        resolve({ default: imageUrl });
                      } else {
                        reject(new Error('Failed to get media URL'));
                      }
                    },
                    (error) => {
                      reject(error);
                    }
                  );
                  return;
                }
              }
              
              // If response is an object with URL
              if (response && typeof response === 'object') {
                if (response.url) {
                  imageUrl = response.url.startsWith('http') 
                    ? response.url 
                    : `${this.environment.apiUrl}/${response.url}`;
                } else if (response.data && response.data.url) {
                  imageUrl = response.data.url.startsWith('http') 
                    ? response.data.url 
                    : `${this.environment.apiUrl}/${response.data.url}`;
                } else if (response.id) {
                  // If response has ID but no URL, fetch it
                  this.cmsMediaService.getById(response.id).subscribe(
                    (mediaData: any) => {
                      if (mediaData && mediaData.url) {
                        imageUrl = mediaData.url.startsWith('http') 
                          ? mediaData.url 
                          : `${this.environment.apiUrl}/${mediaData.url}`;
                        resolve({ default: imageUrl });
                      } else {
                        reject(new Error('Failed to get media URL'));
                      }
                    },
                    (error) => {
                      reject(error);
                    }
                  );
                  return;
                }
              }
              
              if (imageUrl) {
                resolve({ default: imageUrl });
              } else {
                reject(new Error('Failed to get image URL from response'));
              }
            },
            (error) => {
              reject(error);
            }
          );
        });
      });
  }

  abort(): void {
    // Handle abort if needed
  }
}
