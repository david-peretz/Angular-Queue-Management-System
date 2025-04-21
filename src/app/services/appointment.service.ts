import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AppointmentModel, AppointmentStatus, AppointmentCreateModel } from '../models/appointment.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private MOCK_APPOINTMENTS: AppointmentModel[] = [
    {
      id: 'appt-1',
      userId: 'customer-1',
      userName: 'ישראל ישראלי',
      branchId: 'branch-1',
      branchName: 'סניף מרכזי תל אביב',
      serviceId: 'service-2',
      serviceType: 'טיפול רגיל',
      status: AppointmentStatus.CONFIRMED,
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
      estimatedDuration: 45,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'appt-2',
      userId: 'customer-1',
      userName: 'ישראל ישראלי',
      branchId: 'branch-2',
      branchName: 'סניף חיפה',
      serviceId: 'service-1',
      serviceType: 'פגישת ייעוץ',
      status: AppointmentStatus.COMPLETED,
      scheduledTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      estimatedDuration: 30,
      notes: 'פגישת היכרות',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'appt-3',
      userId: 'staff-1',
      userName: 'עובד שירות',
      branchId: 'branch-1',
      branchName: 'סניף מרכזי תל אביב',
      serviceId: 'service-3',
      serviceType: 'טיפול מתקדם',
      status: AppointmentStatus.PENDING,
      scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      estimatedDuration: 60,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  constructor(private authService: AuthService) {}

  getAppointments(): Observable<AppointmentModel[]> {
    return of(this.MOCK_APPOINTMENTS).pipe(
      delay(600) // Simulate network delay
    );
  }

  getUserAppointments(): Observable<AppointmentModel[]> {
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Filter appointments for the current user
    const userAppointments = this.MOCK_APPOINTMENTS.filter(apt => apt.userId === currentUser.id);
    
    return of(userAppointments).pipe(
      delay(500) // Simulate network delay
    );
  }

  getAppointmentById(id: string): Observable<AppointmentModel | undefined> {
    const appointment = this.MOCK_APPOINTMENTS.find(apt => apt.id === id);
    
    if (!appointment) {
      return of(undefined).pipe(delay(300));
    }
    
    return of(appointment).pipe(
      delay(300) // Simulate network delay
    );
  }

  createAppointment(appointmentData: AppointmentCreateModel): Observable<AppointmentModel> {
    const currentUser = this.authService.currentUser;
    
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }
    
    // Generate a new appointment with a unique ID
    const newAppointment: AppointmentModel = {
      id: `appt-${Date.now()}`,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      branchId: appointmentData.branchId,
      branchName: this.getBranchName(appointmentData.branchId),
      serviceId: appointmentData.serviceId,
      serviceType: this.getServiceName(appointmentData.serviceId),
      status: AppointmentStatus.PENDING,
      scheduledTime: appointmentData.scheduledTime,
      estimatedDuration: this.getServiceDuration(appointmentData.serviceId),
      notes: appointmentData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data
    this.MOCK_APPOINTMENTS.push(newAppointment);
    
    return of(newAppointment).pipe(
      delay(800) // Simulate network delay
    );
  }

  updateAppointmentStatus(id: string, status: AppointmentStatus): Observable<AppointmentModel> {
    const appointmentIndex = this.MOCK_APPOINTMENTS.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return throwError(() => new Error('Appointment not found'));
    }
    
    // Update the appointment
    this.MOCK_APPOINTMENTS[appointmentIndex] = {
      ...this.MOCK_APPOINTMENTS[appointmentIndex],
      status,
      updatedAt: new Date()
    };
    
    return of(this.MOCK_APPOINTMENTS[appointmentIndex]).pipe(
      delay(500) // Simulate network delay
    );
  }

  cancelAppointment(id: string): Observable<AppointmentModel> {
    return this.updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
  }

  rescheduleAppointment(id: string, newTime: Date): Observable<AppointmentModel> {
    const appointmentIndex = this.MOCK_APPOINTMENTS.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return throwError(() => new Error('Appointment not found'));
    }
    
    // Update the appointment
    this.MOCK_APPOINTMENTS[appointmentIndex] = {
      ...this.MOCK_APPOINTMENTS[appointmentIndex],
      scheduledTime: newTime,
      updatedAt: new Date()
    };
    
    return of(this.MOCK_APPOINTMENTS[appointmentIndex]).pipe(
      delay(500) // Simulate network delay
    );
  }

  // Helper methods to get names based on IDs
  private getBranchName(branchId: string): string {
    switch(branchId) {
      case 'branch-1': return 'סניף מרכזי תל אביב';
      case 'branch-2': return 'סניף חיפה';
      case 'branch-3': return 'סניף ירושלים';
      default: return 'סניף לא ידוע';
    }
  }

  private getServiceName(serviceId: string): string {
    switch(serviceId) {
      case 'service-1': return 'פגישת ייעוץ';
      case 'service-2': return 'טיפול רגיל';
      case 'service-3': return 'טיפול מתקדם';
      case 'service-4': return 'טיפול פרימיום';
      case 'service-5': return 'בדיקה תקופתית';
      default: return 'שירות לא ידוע';
    }
  }

  private getServiceDuration(serviceId: string): number {
    switch(serviceId) {
      case 'service-1': return 30;
      case 'service-2': return 45;
      case 'service-3': return 60;
      case 'service-4': return 90;
      case 'service-5': return 20;
      default: return 30;
    }
  }

  getAvailableTimeSlots(branchId: string, serviceId: string, date: string): Observable<string[]> {
    // In a real app, this would make an API call to get available slots
    // Here we'll generate some fake time slots
    
    const slots: string[] = [];
    const startHour = 9; // 9:00 AM
    const endHour = 18; // 6:00 PM
    const interval = 30; // 30 minutes between appointments
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        // Skip some random times to simulate occupied slots
        if (Math.random() > 0.3) {
          const formattedHour = hour.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          slots.push(`${formattedHour}:${formattedMinute}`);
        }
      }
    }
    
    return of(slots).pipe(
      delay(400) // Simulate network delay
    );
  }
}