import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAppointment from './appointment/appointment.reducer';

/**
 * App State Interface
 * @description Defines the shape of the entire application state
 */
export interface AppState {
  appointments: fromAppointment.AppointmentState;
}

/**
 * App Reducers
 * @description Combines all reducers into a single map
 */
export const reducers: ActionReducerMap<AppState> = {
  appointments: fromAppointment.appointmentReducer
};

/**
 * Meta Reducers
 * @description Global meta-reducers for the application
 */
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];