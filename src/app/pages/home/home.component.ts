import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BranchService } from '../../services/branch.service';
import { BranchModel } from '../../models/branch.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">מערכת ניהול תורים חכמה</h1>
          <p class="hero-subtitle">תזמנו תורים בקלות, נהלו את הזמן שלכם ביעילות</p>
          
          <div class="hero-actions">
            <a routerLink="/new-appointment" class="btn-primary btn-large">
              <i class="fas fa-calendar-plus"></i> קביעת תור חדש
            </a>
            <a *ngIf="!isLoggedIn" routerLink="/login" class="btn-secondary btn-large">
              <i class="fas fa-sign-in-alt"></i> התחברות למערכת
            </a>
            <a *ngIf="isLoggedIn" routerLink="/appointments" class="btn-secondary btn-large">
              <i class="fas fa-calendar-alt"></i> התורים שלי
            </a>
          </div>
        </div>
      </section>
      
      <!-- Features Section -->
      <section class="features-section">
        <h2 class="section-title">למה לבחור במערכת שלנו?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-calendar-check"></i>
            </div>
            <h3>קביעת תורים בקלות</h3>
            <p>תזמון תורים מהיר ופשוט דרך המערכת המקוונת שלנו, ללא צורך בשיחות טלפון.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-bell"></i>
            </div>
            <h3>תזכורות אוטומטיות</h3>
            <p>קבלו תזכורות אוטומטיות לפני התור שלכם כדי להבטיח שלא תפספסו אף פגישה.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-exchange-alt"></i>
            </div>
            <h3>שינוי וביטול בקלות</h3>
            <p>אפשרות לשנות או לבטל תורים בכל עת, בהתאם למדיניות הביטולים שלנו.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <i class="fas fa-history"></i>
            </div>
            <h3>היסטוריית תורים</h3>
            <p>צפייה בהיסטוריית התורים שלכם ומעקב אחר השירותים שקיבלתם לאורך זמן.</p>
          </div>
        </div>
      </section>
      
      <!-- Branches Section -->
      <section class="branches-section">
        <h2 class="section-title">הסניפים שלנו</h2>
        
        <div class="branches-grid">
          <div class="branch-card" *ngFor="let branch of branches">
            <h3>{{ branch.name }}</h3>
            <div class="branch-details">
              <p><i class="fas fa-map-marker-alt"></i> {{ branch.address }}</p>
              <p><i class="fas fa-phone"></i> {{ branch.phone }}</p>
              <p *ngIf="branch.email"><i class="fas fa-envelope"></i> {{ branch.email }}</p>
            </div>
            <div class="branch-hours">
              <h4>שעות פעילות:</h4>
              <div class="hours-grid">
                <div *ngFor="let hours of branch.openingHours; let i = index" class="hours-row">
                  <span class="day-name">{{ getDayName(hours.dayOfWeek) }}</span>
                  <span class="hours" *ngIf="hours.openTime">{{ hours.openTime }} - {{ hours.closeTime }}</span>
                  <span class="hours closed" *ngIf="!hours.openTime">סגור</span>
                </div>
              </div>
            </div>
            <a routerLink="/new-appointment" [queryParams]="{branch: branch.id}" class="btn-book">
              קביעת תור בסניף זה
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      margin-bottom: 3rem;
    }
    
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, var(--primary-700), var(--primary-500));
      color: white;
      padding: 4rem 1rem;
      text-align: center;
      border-radius: 0 0 10px 10px;
      margin-bottom: 3rem;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .btn-large {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .btn-large i {
      margin-left: 0.5rem;
    }
    
    .btn-primary {
      background-color: white;
      color: var(--primary-700);
    }
    
    .btn-primary:hover {
      background-color: var(--neutral-200);
      transform: translateY(-2px);
    }
    
    .btn-secondary {
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
    
    /* Sections */
    .section-title {
      text-align: center;
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 2rem;
      position: relative;
      padding-bottom: 0.75rem;
    }
    
    .section-title:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: var(--primary-500);
      border-radius: 3px;
    }
    
    /* Features Section */
    .features-section {
      padding: 2rem 1rem 3rem;
      max-width: 1200px;
      margin: 0 auto 3rem;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      text-align: center;
      padding: 1.5rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    
    .feature-icon {
      width: 60px;
      height: 60px;
      background-color: var(--primary-100);
      color: var(--primary-600);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin: 0 auto 1rem;
    }
    
    .feature-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: var(--neutral-800);
    }
    
    .feature-card p {
      color: var(--neutral-600);
      line-height: 1.5;
    }
    
    /* Branches Section */
    .branches-section {
      padding: 2rem 1rem 3rem;
      background-color: var(--neutral-100);
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .branches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .branch-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      padding: 1.5rem;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .branch-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .branch-card h3 {
      font-size: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--neutral-200);
      color: var(--primary-700);
    }
    
    .branch-details {
      margin-bottom: 1.25rem;
    }
    
    .branch-details p {
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
    }
    
    .branch-details i {
      width: 20px;
      margin-left: 0.75rem;
      color: var(--primary-500);
    }
    
    .branch-hours {
      margin-bottom: 1.5rem;
    }
    
    .branch-hours h4 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
      color: var(--neutral-700);
    }
    
    .hours-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.5rem;
    }
    
    .hours-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      padding: 0.25rem 0;
    }
    
    .day-name {
      font-weight: 500;
    }
    
    .hours.closed {
      color: var(--error);
    }
    
    .btn-book {
      display: block;
      text-align: center;
      padding: 0.75rem;
      background-color: var(--primary-600);
      color: white;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .btn-book:hover {
      background-color: var(--primary-700);
      text-decoration: none;
    }
    
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-subtitle {
        font-size: 1rem;
      }
      
      .features-grid, .branches-grid {
        grid-template-columns: 1fr;
      }
      
      .btn-large {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  branches: BranchModel[] = [];

  constructor(
    private authService: AuthService,
    private branchService: BranchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check auth state
    this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isAuthenticated;
    });
    
    // Load branches
    this.branchService.getActiveBranches().subscribe(branches => {
      this.branches = branches;
    });
  }
  
  getDayName(dayIndex: number): string {
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    return days[dayIndex];
  }
}