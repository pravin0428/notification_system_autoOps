import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';
import { RuleService } from '../../core/services/rule.service';
import { DashboardStats, Notification, Rule } from '../../core/models/notification.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = { total: 0, sent: 0, failed: 0, pending: 0, activeRules: 0 };
  recentNotifications: Notification[] = [];
  totalRules = 0;
  loading = true;

  constructor(
    private notificationService: NotificationService,
    private ruleService: RuleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.notificationService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.notificationService.getNotifications(1, 5).subscribe({
      next: (result) => {
        this.recentNotifications = result.notifications;
      },
    });

    this.ruleService.getRules().subscribe({
      next: (rules) => {
        this.totalRules = rules.length;
      },
    });
  }

  getRuleName(notification: Notification): string {
    if (typeof notification.ruleId === 'object' && notification.ruleId !== null) {
      return (notification.ruleId as { name: string }).name;
    }
    return notification.ruleName;
  }
}
