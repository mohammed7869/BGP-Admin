import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CmsPageNewComponent } from "./cms-page-new/cms-page-new.component";
import { CmsPageSearchComponent } from "./cms-page-search/cms-page-search.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbCollapseModule, NgbNavModule } from "@ng-bootstrap/ng-bootstrap";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { RouterModule } from "@angular/router";
import { CmsPageResolver } from "src/app/providers/resolver/cms-page.resolver";
import { AgGridModule } from "ag-grid-angular";
import { SharedModuleCommon } from "src/app/shared/shared.module";
import { CmsPageDetailsComponent } from './cms-page-details/cms-page-details.component';

@NgModule({
  declarations: [CmsPageNewComponent, CmsPageSearchComponent, CmsPageDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbCollapseModule,
    NgbNavModule,
    CKEditorModule,
    SharedModuleCommon,
    RouterModule.forChild([
      {
        path: "",
        component: CmsPageSearchComponent,
        children: [
          {
            path: "new",
            component: CmsPageNewComponent,
          },
          {
            path: "edit/:id",
            component: CmsPageDetailsComponent,
            resolve: {
              recordData: CmsPageResolver,
            },
          },
        ],
      },
    ]),
    AgGridModule,
  ],
})
export class CmsPageModule { }
