import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { appCommon } from "src/app/common/_appCommon";
import { ActivatedRoute, Router } from "@angular/router";
import { CmsPageService } from "src/app/providers/services/cms-page.service";
import { RecordCreationService } from "src/app/providers/services/record-creation.service";
import { ToastrMessageService } from "src/app/providers/services/toastr-message.service";
import { BlogService } from "src/app/providers/services/blog.service";
import { Blog } from "src/app/models/blog.interface";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";

@Component({
  selector: "app-cms-page-details",
  templateUrl: "./cms-page-details.component.html",
  styleUrls: ["./cms-page-details.component.scss"],
})
export class CmsPageDetailsComponent implements OnInit {
  form: FormGroup;
  public appCommon = appCommon;
  submitLoading: boolean = false;
  recordData: any = null;
  submitted: boolean = false;
  public Editor = ClassicEditor;
  pageTitle: String = "Edit CMS Page";

  // Blog related properties
  blogs: Blog[] = [];
  filteredBlogs: Blog[] = [];
  selectedBlogs: Blog[] = []; // For multi-select in the tab
  pageBlogs: any[] = []; // Blogs added to the CMS page with display order
  originalPageBlogs: any[] = []; // Track original state for change detection
  loadingBlogs: boolean = false;
  savingBlogs: boolean = false;
  searchTerm: string = '';
  selectedContentType: string = '';
  selectedStatus: string = '';

  constructor(
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private service: CmsPageService,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,
    private blogService: BlogService
  ) { }

  ngOnInit(): void {
    this.createForm();

    if (this.route.snapshot.data["recordData"])
      this.recordData = this.route.snapshot.data["recordData"];
    if (this.recordData) {
      this.setFormValues();
      // Load existing page blogs if any
      this.loadExistingPageBlogs();
    }
  }

  createForm(): void {
    this.form = this.fb.group({
      id: [0],
      name: ["", [Validators.required]],
      slug: ["", [Validators.required]],
      title: ["", [Validators.required]],
      heading: ["", [Validators.required]],
      shortDesc: [""],
      longDesc: [""],
      pageImageId: [0],
      backgroundImageId: [0],
      language: [1, [Validators.required]],
      isLandingPage: [false],
      isDraft: [true],
      isHomePage: [false],
      version: [1],
      isPublished: [false],
      publishDate: [this.formatDateForInput(new Date())],
      expiryDate: [""],
    });
  }

  setFormValues(): void {
    this.form.patchValue({
      id: this.recordData.id,
      name: this.recordData.name,
      slug: this.recordData.slug,
      title: this.recordData.title,
      heading: this.recordData.heading,
      shortDesc: this.recordData.shortDesc || "",
      longDesc: this.recordData.longDesc || "",
      pageImageId: this.recordData.pageImageId || 0,
      backgroundImageId: this.recordData.backgroundImageId || 0,
      language: this.recordData.language || 1,
      isLandingPage: this.recordData.isLandingPage || false,
      isDraft:
        this.recordData.isDraft !== undefined ? this.recordData.isDraft : true,
      isHomePage: this.recordData.isHomePage || false,
      version: this.recordData.version || 1,
      isPublished: this.recordData.isPublished || false,
      publishDate: this.recordData.publishDate
        ? this.formatDateForInput(new Date(this.recordData.publishDate))
        : this.formatDateForInput(new Date()),
      expiryDate: this.recordData.expiryDate
        ? this.formatDateForInput(new Date(this.recordData.expiryDate))
        : "",
    });
  }

  onPageImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ pageImageId: image.id });
    }
  }

  onPageImageCleared(): void {
    this.form.patchValue({ pageImageId: 0 });
  }

  onBackgroundImageSelected(image: any): void {
    if (image) {
      this.form.patchValue({ backgroundImageId: image.id });
    }
  }

  onBackgroundImageCleared(): void {
    this.form.patchValue({ backgroundImageId: 0 });
  }

  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      console.log(this.form.errors);
      return;
    } else {
      this.submitLoading = true;
      var fdata = this.form.value;

      // Convert datetime-local to ISO string for API
      if (fdata.publishDate) {
        fdata.publishDate = new Date(fdata.publishDate).toISOString();
      }
      if (fdata.expiryDate) {
        fdata.expiryDate = new Date(fdata.expiryDate).toISOString();
      }

      // Update existing record
      this.service.update(fdata).subscribe({
        next: (response: any) => {
          // After successfully updating the page, save blog mappings
          if (this.pageBlogs.length > 0) {
            this.saveBlogMappings();
          }
          
          this.submitLoading = false;
          this.toastrMessageService.showSuccess(
            "CMS page updated successfully",
            "Success"
          );
          this.recordCreationService.announceUpdate({
            table: "CMS Page",
            id: fdata.id,
            name: fdata.name,
            slug: fdata.slug,
            title: fdata.title,
            heading: fdata.heading,
            isPublished: fdata.isPublished,
            isDraft: fdata.isDraft,
            isHomePage: fdata.isHomePage,
            isLandingPage: fdata.isLandingPage,
            publishDate: fdata.publishDate,
            modifiedDate: new Date().toISOString(),
          });
          this.router.navigate(["cms-media/page"]);
        },
        error: (error: any) => {
          this.submitLoading = false;
          console.error("Error updating CMS page:", error);
          this.toastrMessageService.showError(
            "Error updating CMS page. Please try again.",
            "Error"
          );
        },
      });
    }
  }

  onBack(): void {
    this.location.back();
  }

  onCancel(): void {
    this.router.navigate(["cms-media/page"]);
  }

  // Blog related methods
  loadBlogs(): void {
    this.loadingBlogs = true;
    this.blogService.getAll().subscribe({
      next: (response: any) => {
        this.loadingBlogs = false;
        this.blogs = response || [];
        this.filteredBlogs = [...this.blogs];
        this.toastrMessageService.showSuccess(
          `Loaded ${this.blogs.length} blogs successfully`,
          "Success"
        );
      },
      error: (error: any) => {
        this.loadingBlogs = false;
        console.error("Error loading blogs:", error);
        this.toastrMessageService.showError(
          "Error loading blogs. Please try again.",
          "Error"
        );
      },
    });
  }

  // Search and filter functionality
  onSearchChange(): void {
    this.applyFilters();
  }

  onContentTypeChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBlogs = this.blogs.filter(blog => {
      const matchesSearch = !this.searchTerm ||
        blog.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesContentType = !this.selectedContentType ||
        blog.contentType === this.selectedContentType;

      const matchesStatus = !this.selectedStatus ||
        blog.blogStatus === this.selectedStatus;

      return matchesSearch && matchesContentType && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedContentType = '';
    this.selectedStatus = '';
    this.filteredBlogs = [...this.blogs];
  }

  // Multi-select functionality
  isBlogSelected(blog: Blog): boolean {
    return this.selectedBlogs.some(
      (selectedBlog) => selectedBlog.id === blog.id
    );
  }

  // Check if blog is already added to page
  isBlogAddedToPage(blog: Blog): boolean {
    return this.pageBlogs.some((pageBlog) => pageBlog.postId === blog.id);
  }

  isAllBlogsSelected(): boolean {
    // Only count blogs that are not already added to the page
    const availableBlogs = this.filteredBlogs.filter(blog => !this.isBlogAddedToPage(blog));
    return (
      availableBlogs.length > 0 && 
      this.selectedBlogs.length === availableBlogs.length
    );
  }

  toggleBlogSelection(blog: Blog, event: any): void {
    // Don't allow selection of blogs already added to page
    if (this.isBlogAddedToPage(blog)) {
      event.target.checked = true; // Keep it checked
      return;
    }

    if (event.target.checked) {
      if (!this.isBlogSelected(blog)) {
        this.selectedBlogs.push(blog);
      }
    } else {
      this.selectedBlogs = this.selectedBlogs.filter(
        (selectedBlog) => selectedBlog.id !== blog.id
      );
    }
  }

  toggleAllBlogs(event: any): void {
    if (event.target.checked) {
      // Only select blogs that are not already added to the page
      this.selectedBlogs = this.filteredBlogs.filter(blog => !this.isBlogAddedToPage(blog));
    } else {
      this.selectedBlogs = [];
    }
  }

  clearAllSelectedBlogs(): void {
    this.selectedBlogs = [];
    this.toastrMessageService.showInfo(
      "All blog selections cleared",
      "Selection Cleared"
    );
  }

  // Normalize display orders to be sequential starting from 1
  normalizeDisplayOrders(): void {
    this.pageBlogs.forEach((pb, index) => {
      pb.displayOrder = index + 1;
    });
  }

  addSelectedBlogsToPage(): void {
    const addedCount = this.selectedBlogs.length;
    
    // Add selected blogs to page blogs (avoid duplicates)
    this.selectedBlogs.forEach((blog) => {
      if (!this.pageBlogs.some((pageBlog) => pageBlog.postId === blog.id)) {
        // Get the next display order
        const nextDisplayOrder = this.pageBlogs.length > 0 
          ? Math.max(...this.pageBlogs.map(pb => pb.displayOrder)) + 1 
          : 1;
        
        this.pageBlogs.push({
          postId: blog.id,
          displayOrder: nextDisplayOrder,
          blog: blog // Keep the full blog object for display
        });
      }
    });

    // Normalize display orders to ensure they start from 1
    this.normalizeDisplayOrders();

    this.toastrMessageService.showSuccess(
      `Added ${addedCount} blog(s) to CMS page`,
      "Blogs Added"
    );

    // Clear the selection after adding
    this.selectedBlogs = [];
  }

  removeBlogFromPage(pageBlog: any): void {
    this.pageBlogs = this.pageBlogs.filter(
      (pb) => pb.postId !== pageBlog.postId
    );
    
    // Normalize display orders after removal to ensure sequential ordering starting from 1
    this.normalizeDisplayOrders();
    
    this.toastrMessageService.showInfo(
      `Removed "${pageBlog.blog.title}" from CMS page`,
      "Blog Removed"
    );
  }

  loadExistingPageBlogs(): void {
    // If editing an existing page and it has associated blogs, load them
    if (
      this.recordData &&
      this.recordData.blogs &&
      this.recordData.blogs.length > 0
    ) {
      // Map the API blog data to the format expected by pageBlogs
      this.pageBlogs = this.recordData.blogs.map((apiBlog: any) => ({
        postId: apiBlog.postId,
        displayOrder: apiBlog.displayOrder,
        blog: {
          id: apiBlog.postId,
          title: apiBlog.postTitle || 'Untitled',
          authorName: apiBlog.postAuthorName || 'Unknown',
          contentType: apiBlog.postContentType || 'Article',
          slug: `blog-${apiBlog.postId}`,
          blogStatus: 'Published',
          visibility: 'Public',
          publishedDate: apiBlog.postPublishedDate || new Date().toISOString(),
        }
      }));

      // Sort by display order
      this.pageBlogs.sort((a, b) => a.displayOrder - b.displayOrder);
      
      // Normalize display orders to ensure they start from 1
      this.normalizeDisplayOrders();
      
      // Store original state for change detection
      this.originalPageBlogs = JSON.parse(JSON.stringify(this.pageBlogs));
    }
  }

  // Check if blogs have been modified
  hasPageBlogsChanged(): boolean {
    if (this.pageBlogs.length !== this.originalPageBlogs.length) {
      return true;
    }
    
    // Check if any blog or display order has changed
    for (let i = 0; i < this.pageBlogs.length; i++) {
      const current = this.pageBlogs[i];
      const original = this.originalPageBlogs.find(ob => ob.postId === current.postId);
      
      if (!original || current.displayOrder !== original.displayOrder) {
        return true;
      }
    }
    
    return false;
  }

  // Update display order for a blog
  updateDisplayOrder(pageBlog: any, newOrder: number): void {
    if (newOrder < 1 || newOrder > this.pageBlogs.length) return;
    
    const currentIndex = this.pageBlogs.findIndex(pb => pb.postId === pageBlog.postId);
    if (currentIndex === -1) return;
    
    const newIndex = newOrder - 1; // Convert to 0-based index
    
    // Remove from current position
    const [movedBlog] = this.pageBlogs.splice(currentIndex, 1);
    
    // Insert at new position
    this.pageBlogs.splice(newIndex, 0, movedBlog);
    
    // Normalize display orders to ensure they're sequential starting from 1
    this.normalizeDisplayOrders();
  }

  // Move blog up in display order
  moveBlogUp(pageBlog: any): void {
    const currentIndex = this.pageBlogs.findIndex(pb => pb.postId === pageBlog.postId);
    if (currentIndex > 0) {
      const temp = this.pageBlogs[currentIndex];
      this.pageBlogs[currentIndex] = this.pageBlogs[currentIndex - 1];
      this.pageBlogs[currentIndex - 1] = temp;
      
      // Update display orders
      this.pageBlogs.forEach((pb, index) => {
        pb.displayOrder = index + 1;
      });
    }
  }

  // Move blog down in display order
  moveBlogDown(pageBlog: any): void {
    const currentIndex = this.pageBlogs.findIndex(pb => pb.postId === pageBlog.postId);
    if (currentIndex < this.pageBlogs.length - 1) {
      const temp = this.pageBlogs[currentIndex];
      this.pageBlogs[currentIndex] = this.pageBlogs[currentIndex + 1];
      this.pageBlogs[currentIndex + 1] = temp;
      
      // Update display orders
      this.pageBlogs.forEach((pb, index) => {
        pb.displayOrder = index + 1;
      });
    }
  }

  // Save blog mappings to the server
  saveBlogMappings(): void {
    if (this.pageBlogs.length === 0) {
      this.toastrMessageService.showInfo("No blogs to save", "Info");
      return;
    }

    // Check if there are any changes
    if (!this.hasPageBlogsChanged()) {
      this.toastrMessageService.showInfo("No changes detected", "Info");
      return;
    }

    const pageId = this.form.get('id').value;
    if (!pageId) {
      this.toastrMessageService.showError("Page ID is required", "Error");
      return;
    }

    this.savingBlogs = true;
    const blogMappings = this.pageBlogs.map(pb => ({
      postId: pb.postId,
      displayOrder: pb.displayOrder
    }));

    this.service.saveBlogMappings(pageId, blogMappings).subscribe({
      next: (response: any) => {
        // Update all blog statuses to 'Published' after successful save
        this.pageBlogs.forEach(pageBlog => {
          if (pageBlog.blog) {
            pageBlog.blog.blogStatus = 'Published';
          }
        });
        
        // Update original state to match current state
        this.originalPageBlogs = JSON.parse(JSON.stringify(this.pageBlogs));
        
        this.savingBlogs = false;
        this.toastrMessageService.showSuccess(
          "Blog mappings saved successfully",
          "Success"
        );
      },
      error: (error: any) => {
        this.savingBlogs = false;
        console.error("Error saving blog mappings:", error);
        this.toastrMessageService.showError(
          "Error saving blog mappings. Please try again.",
          "Error"
        );
      }
    });
  }
}
