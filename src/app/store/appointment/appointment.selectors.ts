import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppointmentState, selectAll } from './appointment.reducer';
import { AppointmentStatus } from '../../models/appointment.model';

/**
 * Feature Selector
 * @description Selects the appointment state from the store
 */
export const selectAppointmentState = createFeatureSelector<AppointmentState>('appointments');

/**
 * Basic Selectors
 * @description Basic selectors for appointment state
 */
export const selectAllAppointments = createSelector(
  selectAppointmentState,
  selectAll
);

export const selectAppointmentsLoading = createSelector(
  selectAppointmentState,
  state => state.loading
);

export const selectAppointmentsError = createSelector(
  selectAppointmentState,
  state => state.error
);

/**
 * Filtered Selectors
 * @description Selectors for filtered appointment lists
 */
export const selectUpcomingAppointments = createSelector(
  selectAllAppointments,
  appointments => {
    const now = new Date();
    return appointments.filter(apt => 
      new Date(apt.scheduledTime) > now && 
      [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED].includes(apt.status)
    ).sort((a, b) => 
      new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
    );
  }
);

export const selectPastAppointments = createSelector(
  selectAllAppointments,
  appointments => {
    const now = new Date();
    return appointments.filter(apt => 
      new Date(apt.scheduledTime) < now || 
      [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW].includes(apt.status)
    ).sort((a, b) => 
      new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    );
  }
);

/**
 * Status-based Selectors
 * @description Selectors for appointments by status
 */
export const selectPendingAppointments = createSelector(
  selectAllAppointments,
  appointments => appointments.filter(apt => apt.status === AppointmentStatus.PENDING)
);

export const selectConfirmedAppointments = createSelector(
  selectAllAppointments,
  appointments => appointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED)
);

export const selectCompletedAppointments = createSelector(
  selectAllAppointments,
  appointments => appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED)
);

/**
 * Statistics Selectors
 * @description Selectors for appointment statistics
 */
export const selectAppointmentStats = createSelector(
  selectAllAppointments,
  appointments => ({
    total: appointments.length,
    pending: appointments.filter(apt => apt.status === AppointmentStatus.PENDING).length,
    confirmed: appointments.filter(apt => apt.status === AppointmentStatus.CONFIRMED).length,
    completed: appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length,
    cancelled: appointments.filter(apt => apt.status === AppointmentStatus.CANCELLED).length,
    noShow: appointments.filter(apt => apt.status === AppointmentStatus.NO_SHOW).length
  })
);