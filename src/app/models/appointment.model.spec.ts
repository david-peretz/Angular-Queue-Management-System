import { AppointmentStatus, AppointmentModel } from './appointment.model';

describe('AppointmentModel', () => {
  let appointment: AppointmentModel;
  
  beforeEach(() => {
    appointment = {
      id: 'test-id',
      userId: 'user-1',
      userName: 'John Doe',
      branchId: 'branch-1',
      branchName: 'Main Branch',
      serviceId: 'service-1',
      serviceType: 'Haircut',
      status: AppointmentStatus.PENDING,
      scheduledTime: new Date('2025-01-01T10:00:00'),
      estimatedDuration: 30,
      notes: 'Test appointment',
      createdAt: new Date('2025-01-01T09:00:00'),
      updatedAt: new Date('2025-01-01T09:00:00')
    };
  });

  it('should create a valid appointment', () => {
    expect(appointment).toBeTruthy();
    expect(appointment.id).toBe('test-id');
    expect(appointment.status).toBe(AppointmentStatus.PENDING);
  });

  it('should have correct date objects', () => {
    expect(appointment.scheduledTime instanceof Date).toBeTruthy();
    expect(appointment.createdAt instanceof Date).toBeTruthy();
    expect(appointment.updatedAt instanceof Date).toBeTruthy();
  });

  it('should have valid duration', () => {
    expect(appointment.estimatedDuration).toBeGreaterThan(0);
    expect(Number.isInteger(appointment.estimatedDuration)).toBeTruthy();
  });

  it('should have valid status', () => {
    const validStatuses = Object.values(AppointmentStatus);
    expect(validStatuses.includes(appointment.status)).toBeTruthy();
  });

  it('should allow optional fields to be undefined', () => {
    const minimalAppointment: AppointmentModel = {
      id: 'test-id',
      userId: 'user-1',
      branchId: 'branch-1',
      serviceId: 'service-1',
      serviceType: 'Haircut',
      status: AppointmentStatus.PENDING,
      scheduledTime: new Date(),
      estimatedDuration: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    expect(minimalAppointment).toBeTruthy();
    expect(minimalAppointment.notes).toBeUndefined();
    expect(minimalAppointment.userName).toBeUndefined();
    expect(minimalAppointment.branchName).toBeUndefined();
  });
});