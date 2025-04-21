export interface BranchModel {
  id: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  openingHours: OpeningHours[];
  services: ServiceOffering[];
  maxConcurrentAppointments: number;
  isActive: boolean;
}

export interface OpeningHours {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  openTime: string; // format: "HH:MM"
  closeTime: string; // format: "HH:MM"
}

export interface ServiceOffering {
  serviceId: string;
  serviceName?: string;
  durationMinutes: number;
  price?: number;
}