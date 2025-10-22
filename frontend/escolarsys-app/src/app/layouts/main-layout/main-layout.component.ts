import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getCurrentUser();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

