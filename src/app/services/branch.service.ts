import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BranchModel } from '../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly MOCK_BRANCHES: BranchModel[] = [
    {
      id: 'branch-1',
      name: 'סניף מרכזי תל אביב',
      address: 'רוטשילד 123, תל אביב',
      phone: '03-1234567',
      email: 'telaviv@example.com',
      openingHours: [
        { dayOfWeek: 0, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 5, openTime: '09:00', closeTime: '14:00' },
        { dayOfWeek: 6, openTime: '', closeTime: '' }
      ],
      services: [
        { serviceId: 'service-1', serviceName: 'פגישת ייעוץ', durationMinutes: 30, price: 0 },
        { serviceId: 'service-2', serviceName: 'טיפול רגיל', durationMinutes: 45, price: 150 },
        { serviceId: 'service-3', serviceName: 'טיפול מתקדם', durationMinutes: 60, price: 200 }
      ],
      maxConcurrentAppointments: 4,
      isActive: true
    },
    {
      id: 'branch-2',
      name: 'סניף חיפה',
      address: 'הנמל 45, חיפה',
      phone: '04-7654321',
      email: 'haifa@example.com',
      openingHours: [
        { dayOfWeek: 0, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 4, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 5, openTime: '09:00', closeTime: '14:00' },
        { dayOfWeek: 6, openTime: '', closeTime: '' }
      ],
      services: [
        { serviceId: 'service-1', serviceName: 'פגישת ייעוץ', durationMinutes: 30, price: 0 },
        { serviceId: 'service-2', serviceName: 'טיפול רגיל', durationMinutes: 45, price: 150 },
        { serviceId: 'service-4', serviceName: 'טיפול פרימיום', durationMinutes: 90, price: 300 }
      ],
      maxConcurrentAppointments: 3,
      isActive: true
    },
    {
      id: 'branch-3',
      name: 'סניף ירושלים',
      address: 'יפו 78, ירושלים',
      phone: '02-5467890',
      email: 'jerusalem@example.com',
      openingHours: [
        { dayOfWeek: 0, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
        { dayOfWeek: 4, openTime: '09:00', closeTime: '17:00' },
        { dayOfWeek: 5, openTime: '09:00', closeTime: '13:00' },
        { dayOfWeek: 6, openTime: '', closeTime: '' }
      ],
      services: [
        { serviceId: 'service-1', serviceName: 'פגישת ייעוץ', durationMinutes: 30, price: 0 },
        { serviceId: 'service-2', serviceName: 'טיפול רגיל', durationMinutes: 45, price: 150 },
        { serviceId: 'service-3', serviceName: 'טיפול מתקדם', durationMinutes: 60, price: 200 }
      ],
      maxConcurrentAppointments: 2,
      isActive: true
    }
  ];

  constructor() {}

  getBranches(): Observable<BranchModel[]> {
    return of(this.MOCK_BRANCHES).pipe(
      delay(500) // Simulate network delay
    );
  }

  getBranchById(id: string): Observable<BranchModel | undefined> {
    const branch = this.MOCK_BRANCHES.find(b => b.id === id);
    return of(branch).pipe(
      delay(300) // Simulate network delay
    );
  }

  getActiveBranches(): Observable<BranchModel[]> {
    const activeBranches = this.MOCK_BRANCHES.filter(b => b.isActive);
    return of(activeBranches).pipe(
      delay(500) // Simulate network delay
    );
  }
}