/**
 * Appointment Status Enum
 * @description Defines all possible states of an appointment
 */
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no-show'
}

/**
 * Appointment Model Interface
 * @description Defines the structure of an appointment
 */
export interface AppointmentModel {
  /** Unique identifier for the appointment */
  id: string;
  
  /** ID of the user who created the appointment */
  userId: string;
  
  /** Name of the user (optional) */
  userName?: string;
  
  /** ID of the branch where the appointment is scheduled */
  branchId: string;
  
  /** Name of the branch (optional) */
  branchName?: string;
  
  /** ID of the service being provided */
  serviceId: string;
  
  /** Type of service */
  serviceType: string;
  
  /** Current status of the appointment */
  status: AppointmentStatus;
  
  /** Scheduled date and time */
  scheduledTime: Date;
  
  /** Estimated duration in minutes */
  estimatedDuration: number;
  
  /** Additional notes (optional) */
  notes?: string;
  
  /** Creation timestamp */
  createdAt: Date;
  
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Appointment Create Model Interface
 * @description Defines the structure for creating a new appointment
 */
export interface AppointmentCreateModel {
  /** ID of the branch where the appointment is scheduled */
  branchId: string;
  
  /** ID of the service being provided */
  serviceId: string;
  
  /** Scheduled date and time */
  scheduledTime: Date;
  
  /** Additional notes (optional) */
  notes?: string;
}