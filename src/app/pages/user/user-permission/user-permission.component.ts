import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appCommon } from 'src/app/common/_appCommon';
import { RecordCreationService } from 'src/app/providers/services/record-creation.service';
import { ToastrMessageService } from 'src/app/providers/services/toastr-message.service';
import { UserService } from 'src/app/providers/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {

  permissionList: any = [];
  userPermissionList: any = [];
  roleList: any = [];
  actions: any = [];
  selectionList: any = [];
  roleName: any;
  submitLoading: boolean = false;
  public appCommon = appCommon;
  recordList: any = [];

  constructor(
    private service: UserService,
    private fb: FormBuilder,
    private toastrMessageService: ToastrMessageService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private recordCreationService: RecordCreationService,
  ) { }

  ngOnInit(): void {
    this.distinctSection();
    this.listPermissions();
  }

  getUserPermissionlist(id) {
    this.service
      .userPermissionList(id)
      .subscribe(
        data => {
          this.userPermissionList = data.list;

          this.validatePermission();
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  listPermissions() {
    this.service
      .permissionList()
      .subscribe(
        data => {
          this.permissionList = data.list;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
        });
  }

  validatePermission() {
    this.permissionList.forEach((v: any) => {
      v.isActive = this.userPermissionList.some(e => e.permissionId === v.id);
    });

    this.recordList = JSON.parse(JSON.stringify(appCommon.EnPermissionModuleList));

    this.recordList.forEach((v: any) => {
      v.accessPermissions = this.permissionList.filter(x => x.moduleId == v.id);
    });
  }

  distinctSection() {
    var lookup = {};
    var items = appCommon.EnPermissionModuleList;

    for (var item, i = 0; item = items[i++];) {
      var name = item.section;

      if (!(name in lookup)) {
        lookup[name] = 1;
        this.selectionList.push(name);
      }
    }
  }

  selectRole(id) {
    this.recordList = [];
    var role: any = appCommon.EnRoleType.filter(x => x.id == id)[0];
    if (role) {
      this.roleName = role.text;
      this.getUserPermissionlist(role.id);
    } else {
      this.permissionList = [];
      this.selectionList = [];
      this.recordList = [];
      this.userPermissionList = [];
    }
  }

  onActionCheckChange(action) {
    if (action.text === 'Edit') { action.text = 'Edit All'; }
    else if (action.text === 'Delete') { action.text = 'Delete All'; }
    action.ischecked = !action.ischecked
    this.recordList.forEach((v: any) => {
      v.accessPermissions.forEach((v1: any) => {
        if (v1.text == action.text) {
          v1.isActive = action.ischecked;
        }
      });
    });
  }

  saveUserPermissions() {

    if (!confirm('Do you want to update permission for - ' + this.roleName + ' ?')) return;

    this.submitLoading = true;

    var userRolePermission = [];

    for (var i = 0; i < this.recordList.length; i++) {
      for (var j = 0; j < this.recordList[i].accessPermissions.length; j++) {
        if (!this.recordList[i].accessPermissions[j].isDisable &&
          this.recordList[i].accessPermissions[j].isActive) {
          var rec = this.recordList[i].accessPermissions[j];
          rec.permissionId = rec.id;
          userRolePermission.push(rec);
        }
      }
    }

    var formdata = { permissions: userRolePermission, roleId: appCommon.EnRole.filter(x => x.text == this.roleName)[0].id };

    this.service
      .updatePermissions(formdata)
      .subscribe(
        data => {
          this.toastrMessageService.showSuccess("Permission(s) updated for " + this.roleName + " role.", "Info");

          this.submitLoading = false;
        },
        error => {
          this.toastrMessageService.showInfo(error.error.message, "Info");
          this.submitLoading = false;
        });
  }

  onCheckBoxClick(item) {
    item.isActive = !item.isActive
  }
}