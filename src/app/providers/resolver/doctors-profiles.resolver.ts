import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorsProfilesResolver implements Resolve<any> {

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    // For now, return static data. In the future, this will come from a service
    const doctorId = parseInt(route.params.id);
    
    // Static data based on the screenshots
    const doctorData = {
      id: doctorId,
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
    
    return of(doctorData);
  }
}
