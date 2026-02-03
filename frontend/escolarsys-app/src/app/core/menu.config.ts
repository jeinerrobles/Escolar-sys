import { Role } from './models/role';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: Role[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Inicio',
    icon: 'bi bi-house',
    route: '/panel/home',
    roles: [Role.ADMIN, Role.DOCENTE, Role.ESTUDIANTE]
  },
  {
    label: 'Usuarios',
    icon: 'bi bi-people',
    route: '/panel/usuarios',
    roles: [Role.ADMIN]
  },
  {
    label: 'Cursos',
    icon: 'bi bi-journal-bookmark',
    route: '/panel/cursos',
    roles: [Role.ADMIN, Role.DOCENTE]
  },
  {
    label: 'Materias',
    icon: 'bi bi-pencil-square',
    route: '/panel/materias',
    roles: [Role.ADMIN, Role.DOCENTE]
  },
  {
    label: 'Grados',
    icon: 'bi bi-diagram-3',
    route: '/panel/grados',
    roles: [Role.ADMIN]
  },
  {
    label: 'Notas',
    icon: 'bi bi-clipboard-check',
    route: '/panel/notas',
    roles: [Role.ADMIN, Role.DOCENTE, Role.ESTUDIANTE]
  }
];
