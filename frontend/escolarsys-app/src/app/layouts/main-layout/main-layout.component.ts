import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MENU_ITEMS, MenuItem } from '../../core/menu.config';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  isSidebarCollapsed = false;
  user: any = null;

  menuItems: MenuItem[] = [];
  role!: Role;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.role = this.user?.role;

    // 👉 Filtrar menú según rol
    this.menuItems = MENU_ITEMS.filter(item =>
      item.roles.includes(this.role)
    );
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout() {
    this.authService.logout(); //  mejor centralizar aquí
    this.router.navigate(['/login']);
  }
}
