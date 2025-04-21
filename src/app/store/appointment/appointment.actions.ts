import { createAction, props } from '@ngrx/store';
import { AppointmentModel, AppointmentCreateModel, AppointmentStatus } from '../../models/appointment.model';

/**
 * Load Appointments Actions
 * @description Actions for loading appointments
 */
export const loadAppointments = createAction(
  '[Appointment] Load Appointments'
);

export const loadAppointmentsSuccess = createAction(
  '[Appointment] Load Appointments Success',
  props<{ appointments: AppointmentModel[] }>()
);

export const loadAppointmentsFailure = createAction(
  '[Appointment] Load Appointments Failure',
  props<{ error: any }>()
);

/**
 * Create Appointment Actions
 * @description Actions for creating a new appointment
 */
export const createAppointment = createAction(
  '[Appointment] Create Appointment',
  props<{ appointment: AppointmentCreateModel }>()
);

export const createAppointmentSuccess = createAction(
  '[Appointment] Create Appointment Success',
  props<{ appointment: AppointmentModel }>()
);

export const createAppointmentFailure = createAction(
  '[Appointment] Create Appointment Failure',
  props<{ error: any }>()
);

/**
 * Update Appointment Status Actions
 * @description Actions for updating appointment status
 */
export const updateAppointmentStatus = createAction(
  '[Appointment] Update Status',
  props<{ id: string; status: AppointmentStatus }>()
);

export const updateAppointmentStatusSuccess = createAction(
  '[Appointment] Update Status Success',
  props<{ appointment: AppointmentModel }>()
);

export const updateAppointmentStatusFailure = createAction(
  '[Appointment] Update Status Failure',
  props<{ error: any }>()
);

/**
 * Cancel Appointment Actions
 * @description Actions for canceling an appointment
 */
export const cancelAppointment = createAction(
  '[Appointment] Cancel Appointment',
  props<{ id: string }>()
);

export const cancelAppointmentSuccess = createAction(
  '[Appointment] Cancel Appointment Success',
  props<{ appointment: AppointmentModel }>()
);

export const cancelAppointmentFailure = createAction(
  '[Appointment] Cancel Appointment Failure',
  props<{ error: any }>()
);