import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ServiceModel } from '../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly MOCK_SERVICES: ServiceModel[] = [
    {
      id: 'service-1',
      name: 'פגישת ייעוץ',
      description: 'פגישת ייעוץ ראשונית להערכת צרכים',
      defaultDuration: 30,
      category: 'ייעוץ',
      isActive: true
    },
    {
      id: 'service-2',
      name: 'טיפול רגיל',
      description: 'טיפול סטנדרטי',
      defaultDuration: 45,
      category: 'טיפולים',
      isActive: true
    },
    {
      id: 'service-3',
      name: 'טיפול מתקדם',
      description: 'טיפול מורחב עם שירותים נוספים',
      defaultDuration: 60,
      category: 'טיפולים',
      isActive: true
    },
    {
      id: 'service-4',
      name: 'טיפול פרימיום',
      description: 'חבילת טיפול מלאה עם כל השירותים',
      defaultDuration: 90,
      category: 'פרימיום',
      isActive: true
    },
    {
      id: 'service-5',
      name: 'בדיקה תקופתית',
      description: 'בדיקה שגרתית מהירה',
      defaultDuration: 20,
      category: 'בדיקות',
      isActive: true
    }
  ];

  constructor() {}

  getServices(): Observable<ServiceModel[]> {
    return of(this.MOCK_SERVICES).pipe(
      delay(500) // Simulate network delay
    );
  }

  getServiceById(id: string): Observable<ServiceModel | undefined> {
    const service = this.MOCK_SERVICES.find(s => s.id === id);
    return of(service).pipe(
      delay(300) // Simulate network delay
    );
  }

  getActiveServices(): Observable<ServiceModel[]> {
    const activeServices = this.MOCK_SERVICES.filter(s => s.isActive);
    return of(activeServices).pipe(
      delay(500) // Simulate network delay
    );
  }

  getServicesByCategory(category: string): Observable<ServiceModel[]> {
    const filteredServices = this.MOCK_SERVICES.filter(
      s => s.isActive && s.category === category
    );
    return of(filteredServices).pipe(
      delay(500) // Simulate network delay
    );
  }
}