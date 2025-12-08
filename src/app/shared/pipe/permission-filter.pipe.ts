import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissionFilter'
})
export class PermissionFilterPipe implements PipeTransform {
  transform(arrayList: any[], section: any): any {
    if (!arrayList || !section) {
      return arrayList;
    }
    return arrayList.filter(item => item.section == section);
  }
}
