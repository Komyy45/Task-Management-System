import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('collapsed', style({
        width: '80px'
      })),
      state('expanded', style({
        width: '250px'
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 150ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  menuItems = [
    { icon: 'bi-house-fill', label: 'Home', route: '/app/dashboard' },
    { icon: 'bi-list-check', label: 'Tasks', route: '/app/tasks' },
    { icon: 'bi-person-fill', label: 'Profile', route: '/app/profile' }
  ];

  constructor(private router: Router) {}

  get sidebarState(): string {
    return this.collapsed ? 'collapsed' : 'expanded';
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  toggle(): void {
    this.toggleSidebar.emit();
  }

  isActive(route: string): boolean {
    return this.router.url === route || (route !== '/' && this.router.url.startsWith(route));
  }
}