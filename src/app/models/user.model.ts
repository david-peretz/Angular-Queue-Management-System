export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  BRANCH_MANAGER = 'branch-manager',
  ADMIN = 'admin'
}

export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchIds?: string[]; // for staff associated with branches
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface RegisterModel {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}