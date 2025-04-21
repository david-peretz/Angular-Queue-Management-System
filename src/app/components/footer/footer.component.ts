import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>מערכת ניהול תורים</h3>
          <p>המערכת המתקדמת ביותר לניהול תורים וזימון פגישות</p>
        </div>
        
        <div class="footer-section">
          <h4>ניווט מהיר</h4>
          <ul>
            <li><a routerLink="/">דף הבית</a></li>
            <li><a routerLink="/appointments">התורים שלי</a></li>
            <li><a routerLink="/new-appointment">קביעת תור</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>שעות פעילות</h4>
          <p>ימים א'-ה': 09:00-18:00</p>
          <p>יום ו': 09:00-14:00</p>
          <p>שבת: סגור</p>
        </div>
        
        <div class="footer-section">
          <h4>צור קשר</h4>
          <p><i class="fas fa-phone"></i> 03-1234567</p>
          <p><i class="fas fa-envelope"></i> info&#64;appointments.com</p>
          <p><i class="fas fa-map-marker-alt"></i> רח' הרצל 123, תל אביב</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2025 מערכת ניהול תורים. כל הזכויות שמורות.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background-color: var(--neutral-800);
      color: var(--neutral-200);
      padding: 2rem 0 0;
      margin-top: 3rem;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem 2rem;
    }
    
    .footer-section h3 {
      color: white;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      position: relative;
    }
    
    .footer-section h3:after {
      content: '';
      position: absolute;
      bottom: -0.5rem;
      right: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-500);
    }
    
    .footer-section h4 {
      color: white;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
    
    .footer-section p {
      margin-bottom: 0.5rem;
    }
    
    .footer-section i {
      width: 20px;
      text-align: center;
      margin-left: 0.5rem;
      color: var(--primary-400);
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    
    .footer-section li {
      margin-bottom: 0.5rem;
    }
    
    .footer-section a {
      color: var(--neutral-300);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-section a:hover {
      color: var(--primary-400);
    }
    
    .footer-bottom {
      background-color: var(--neutral-900);
      text-align: center;
      padding: 1rem;
      font-size: 0.875rem;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        text-align: center;
      }
      
      .footer-section h3:after {
        right: 50%;
        transform: translateX(50%);
      }
    }
  `]
})
export class FooterComponent {}