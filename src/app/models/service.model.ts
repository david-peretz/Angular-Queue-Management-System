export interface ServiceModel {
  id: string;
  name: string;
  description: string;
  defaultDuration: number; // in minutes
  category: string;
  isActive: boolean;
}