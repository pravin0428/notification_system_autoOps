import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Notification System';
  sidenavOpened = true;

  navItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'rule', label: 'Rules', route: '/rules' },
    { icon: 'send', label: 'Trigger Event', route: '/events/trigger' },
    { icon: 'notifications', label: 'Notification History', route: '/notifications' },
  ];

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
