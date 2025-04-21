import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AppointmentModel } from '../../models/appointment.model';
import * as AppointmentActions from './appointment.actions';

/**
 * Appointment State Interface
 * @description Defines the shape of the appointment state
 */
export interface AppointmentState extends EntityState<AppointmentModel> {
  loading: boolean;
  error: any;
  selectedAppointmentId: string | null;
}

/**
 * Entity Adapter
 * @description Creates an adapter for managing appointment entities
 */
export const adapter: EntityAdapter<AppointmentModel> = createEntityAdapter<AppointmentModel>({
  selectId: (appointment: AppointmentModel) => appointment.id,
  sortComparer: (a: AppointmentModel, b: AppointmentModel) => 
    new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
});

/**
 * Initial State
 * @description Defines the initial state of the appointment feature
 */
export const initialState: AppointmentState = adapter.getInitialState({
  loading: false,
  error: null,
  selectedAppointmentId: null
});

/**
 * Appointment Reducer
 * @description Handles state transitions for appointments
 */
export const appointmentReducer = createReducer(
  initialState,
  
  // Load Appointments
  on(AppointmentActions.loadAppointments, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AppointmentActions.loadAppointmentsSuccess, (state, { appointments }) => 
    adapter.setAll(appointments, {
      ...state,
      loading: false,
      error: null
    })
  ),
  
  on(AppointmentActions.loadAppointmentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Appointment
  on(AppointmentActions.createAppointment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AppointmentActions.createAppointmentSuccess, (state, { appointment }) => 
    adapter.addOne(appointment, {
      ...state,
      loading: false,
      error: null
    })
  ),
  
  on(AppointmentActions.createAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Appointment Status
  on(AppointmentActions.updateAppointmentStatus, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AppointmentActions.updateAppointmentStatusSuccess, (state, { appointment }) => 
    adapter.updateOne(
      { id: appointment.id, changes: appointment },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),
  
  on(AppointmentActions.updateAppointmentStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Cancel Appointment
  on(AppointmentActions.cancelAppointment, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(AppointmentActions.cancelAppointmentSuccess, (state, { appointment }) => 
    adapter.updateOne(
      { id: appointment.id, changes: appointment },
      {
        ...state,
        loading: false,
        error: null
      }
    )
  ),
  
  on(AppointmentActions.cancelAppointmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

/**
 * Selectors
 * @description Entity adapter selectors
 */
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();