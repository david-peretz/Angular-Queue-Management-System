import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  age: number;
  created: Date;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-container">
      <div class="search-bar">
        <input
          type="text"
          [(ngModel)]="searchTerm"
          (ngModelChange)="filterUsers()"
          placeholder="חיפוש לפי שם..."
          class="form-control"
        >
      </div>

      <table class="users-table">
        <thead>
          <tr>
            <th>מזהה</th>
            <th>שם</th>
            <th (click)="sortBy('age')" class="sortable">
              גיל
              <i class="fas" [ngClass]="getSortIcon('age')"></i>
            </th>
            <th (click)="sortBy('created')" class="sortable">
              תאריך יצירה
              <i class="fas" [ngClass]="getSortIcon('created')"></i>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of filteredUsers">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.age }}</td>
            <td>{{ user.created | date:'dd/MM/yyyy' }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="filteredUsers.length === 0" class="no-results">
        לא נמצאו משתמשים
      </div>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 1.5rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .search-bar {
      margin-bottom: 1.5rem;
    }

    .users-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    .users-table th,
    .users-table td {
      padding: 0.75rem 1rem;
      text-align: right;
      border-bottom: 1px solid var(--neutral-200);
    }

    .users-table th {
      background-color: var(--neutral-100);
      font-weight: 600;
      color: var(--neutral-700);
    }

    .users-table tbody tr:hover {
      background-color: var(--neutral-50);
    }

    .sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
    }

    .sortable:hover {
      background-color: var(--neutral-200);
    }

    .sortable i {
      margin-right: 0.5rem;
      color: var(--neutral-400);
    }

    .no-results {
      text-align: center;
      padding: 2rem;
      color: var(--neutral-500);
      background-color: var(--neutral-50);
      border-radius: 4px;
      margin-top: 1rem;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [
    { id: 1, name: 'Alice', age: 30, created: new Date('2022-01-01') },
    { id: 2, name: 'Bob', age: 24, created: new Date('2023-03-15') },
    { id: 3, name: 'Charlie', age: 35, created: new Date('2021-07-10') }
  ];

  filteredUsers: User[] = [];
  searchTerm = '';
  sortField: 'age' | 'created' | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortField) {
      this.applySorting();
    }
  }

  sortBy(field: 'age' | 'created'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.applySorting();
  }

  private applySorting(): void {
    this.filteredUsers.sort((a, b) => {
      const multiplier = this.sortDirection === 'asc' ? 1 : -1;
      
      if (this.sortField === 'age') {
        return (a.age - b.age) * multiplier;
      } else if (this.sortField === 'created') {
        return (a.created.getTime() - b.created.getTime()) * multiplier;
      }
      
      return 0;
    });
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) {
      return 'fa-sort';
    }
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }
}