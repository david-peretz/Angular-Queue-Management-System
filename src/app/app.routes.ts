import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { NewAppointmentComponent } from './pages/new-appointment/new-appointment.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'new-appointment', component: NewAppointmentComponent },
  { path: 'users', component: UsersComponent },
  { path: '**', redirectTo: '' }
];