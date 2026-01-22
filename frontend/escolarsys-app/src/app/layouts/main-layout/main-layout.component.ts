import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  isSidebarCollapsed = false;
  isNotasMenuOpen = false;
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getCurrentUser();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isNotasMenuOpen = this.router.url.startsWith('/notas');
      });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;

    // 🔹 Si se colapsa el sidebar, cerrar submenús
    if (this.isSidebarCollapsed) {
      this.isNotasMenuOpen = false;
    }
  }

  toggleNotasMenu() {
    if (this.isSidebarCollapsed) return;
    this.isNotasMenuOpen = !this.isNotasMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}

