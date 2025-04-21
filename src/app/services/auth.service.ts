import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { UserModel, UserRole } from '../models/user.model';

interface AuthState {
  user: UserModel | null;
  token: string | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'auth_state';
  private readonly FAKE_TOKEN_PREFIX = 'fake_jwt_token';
  
  // Sample users
  private readonly FAKE_ADMIN: UserModel = {
    id: 'admin-1',
    firstName: 'מנהל',
    lastName: 'ראשי',
    email: 'admin@example.com',
    phone: '050-1234567',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  private readonly FAKE_CUSTOMER: UserModel = {
    id: 'customer-1',
    firstName: 'ישראל',
    lastName: 'ישראלי',
    email: 'customer@example.com',
    phone: '050-7654321',
    role: UserRole.CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  private readonly FAKE_STAFF: UserModel = {
    id: 'staff-1',
    firstName: 'עובד',
    lastName: 'שירות',
    email: 'staff@example.com',
    phone: '050-9876543',
    role: UserRole.STAFF,
    branchIds: ['branch-1', 'branch-2'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  private authStateSubject: BehaviorSubject<AuthState>;
  
  constructor() {
    const savedState = this.loadState();
    this.authStateSubject = new BehaviorSubject<AuthState>(savedState || {
      user: null,
      token: null,
      isAuthenticated: false
    });
  }
  
  get currentUser(): UserModel | null {
    return this.authStateSubject.value.user;
  }
  
  get isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
  
  get authToken(): string | null {
    return this.authStateSubject.value.token;
  }
  
  get authState$(): Observable<AuthState> {
    return this.authStateSubject.asObservable();
  }
  
  login(email: string, password: string): Observable<UserModel> {
    // Mock authentication - in real app this would be an API call
    if (email === this.FAKE_ADMIN.email && password === 'admin123') {
      return this.authenticateUser(this.FAKE_ADMIN);
    } else if (email === this.FAKE_CUSTOMER.email && password === 'customer123') {
      return this.authenticateUser(this.FAKE_CUSTOMER);
    } else if (email === this.FAKE_STAFF.email && password === 'staff123') {
      return this.authenticateUser(this.FAKE_STAFF);
    }
    
    return throwError(() => new Error('Invalid username or password'));
  }
  
  logout(): Observable<boolean> {
    // Clear state from local storage
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Update the BehaviorSubject
    this.authStateSubject.next({
      user: null,
      token: null,
      isAuthenticated: false
    });
    
    return of(true).pipe(delay(300)); // Simulate network delay
  }
  
  checkAuthStatus(): Observable<boolean> {
    const currentState = this.authStateSubject.value;
    
    if (!currentState.isAuthenticated || !currentState.token) {
      return of(false);
    }
    
    // Check token validity (simplified example)
    if (!currentState.token.startsWith(this.FAKE_TOKEN_PREFIX)) {
      this.logout();
      return of(false);
    }
    
    return of(true);
  }
  
  private authenticateUser(user: UserModel): Observable<UserModel> {
    // Create a fake token with timestamp
    const fakeToken = `${this.FAKE_TOKEN_PREFIX}.${user.id}.${Date.now()}`;
    
    const authState: AuthState = {
      user,
      token: fakeToken,
      isAuthenticated: true
    };
    
    // Save state
    this.saveState(authState);
    
    // Update the BehaviorSubject
    this.authStateSubject.next(authState);
    
    return of(user).pipe(
      delay(800), // Simulate network delay
      tap(() => console.log('User authenticated:', user.email))
    );
  }
  
  private saveState(state: AuthState): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }
  
  private loadState(): AuthState | null {
    const savedState = localStorage.getItem(this.STORAGE_KEY);
    if (!savedState) {
      return null;
    }
    
    try {
      return JSON.parse(savedState);
    } catch (error) {
      console.error('Failed to parse auth state from storage', error);
      return null;
    }
  }
}