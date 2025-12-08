import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByParentDept'
})
export class GroupByParentDeptPipe implements PipeTransform {
  transform(items: any[]): any {
    const groups = items.reduce((grouped, item) => {
      const parentDept = item.department.parentDept;

      if (parentDept === item.department.id) {
        if (!grouped[parentDept]) {
          grouped[parentDept] = [];
        }

        grouped[parentDept].push(item);
      }

      return grouped;
    }, {});

    return Object.keys(groups).map(parentDept => ({
      parentDept,
      items: groups[parentDept]
    }));
  }
}
