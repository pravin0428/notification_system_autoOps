import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification, NotificationStatus, NotificationChannelType } from '../../../core/models/notification.models';

@Component({
  selector: 'app-notification-history',
  templateUrl: './notification-history.component.html',
  styleUrls: ['./notification-history.component.scss'],
})
export class NotificationHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  notifications: Notification[] = [];
  loading = true;
  totalNotifications = 0;
  pageSize = 10;
  currentPage = 1;
  filterStatus: string = 'all';
  filterChannel: string = 'all';

  displayedColumns = ['ruleName', 'recipient', 'channel', 'status', 'createdAt'];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    const status = this.filterStatus !== 'all' ? this.filterStatus as NotificationStatus : undefined;
    const channel = this.filterChannel !== 'all' ? this.filterChannel as NotificationChannelType : undefined;

    this.notificationService.getNotifications(this.currentPage, this.pageSize, status, channel).subscribe({
      next: (result) => {
        this.notifications = result.notifications;
        this.totalNotifications = result.total;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadNotifications();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadNotifications();
  }

  getRuleName(notification: Notification): string {
    if (typeof notification.ruleId === 'object' && notification.ruleId !== null) {
      return (notification.ruleId as { name: string }).name;
    }
    return notification.ruleName;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'SENT': return 'primary';
      case 'FAILED': return 'warn';
      case 'PENDING': return '';
      default: return '';
    }
  }
}
