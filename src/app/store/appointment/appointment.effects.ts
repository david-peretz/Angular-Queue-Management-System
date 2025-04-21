import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppointmentService } from '../../services/appointment.service';
import * as AppointmentActions from './appointment.actions';
import { AppointmentStatus } from '../../models/appointment.model';

/**
 * Appointment Effects
 * @description Handles side effects for appointment actions
 */
@Injectable()
export class AppointmentEffects {
  /**
   * Load Appointments Effect
   * @description Handles loading appointments from the service
   */
  loadAppointments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.loadAppointments),
      mergeMap(() =>
        this.appointmentService.getUserAppointments().pipe(
          map(appointments => AppointmentActions.loadAppointmentsSuccess({ appointments })),
          catchError(error => of(AppointmentActions.loadAppointmentsFailure({ error })))
        )
      )
    )
  );

  /**
   * Create Appointment Effect
   * @description Handles creating a new appointment
   */
  createAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.createAppointment),
      mergeMap(action =>
        this.appointmentService.createAppointment(action.appointment).pipe(
          map(appointment => AppointmentActions.createAppointmentSuccess({ appointment })),
          catchError(error => of(AppointmentActions.createAppointmentFailure({ error })))
        )
      )
    )
  );

  /**
   * Update Appointment Status Effect
   * @description Handles updating appointment status
   */
  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.updateAppointmentStatus),
      mergeMap(action =>
        this.appointmentService.updateAppointmentStatus(action.id, action.status).pipe(
          map(appointment => AppointmentActions.updateAppointmentStatusSuccess({ appointment })),
          catchError(error => of(AppointmentActions.updateAppointmentStatusFailure({ error })))
        )
      )
    )
  );

  /**
   * Cancel Appointment Effect
   * @description Handles canceling an appointment
   */
  cancelAppointment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppointmentActions.cancelAppointment),
      mergeMap(action =>
        this.appointmentService.cancelAppointment(action.id).pipe(
          map(appointment => AppointmentActions.cancelAppointmentSuccess({ appointment })),
          catchError(error => of(AppointmentActions.cancelAppointmentFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private appointmentService: AppointmentService
  ) {}
}