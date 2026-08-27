import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Notification, DashboardStats } from '../models/notification.models';
import { NotificationStatus, NotificationChannelType } from '../models/notification.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getNotifications(
    page: number = 1,
    limit: number = 20,
    status?: NotificationStatus,
    channel?: NotificationChannelType
  ): Observable<{ notifications: Notification[]; total: number; page: number; limit: number; totalPages: number }> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));
    if (status) params = params.set('status', status);
    if (channel) params = params.set('channel', channel);

    return this.http
      .get<ApiResponse<Notification[]>>(this.apiUrl, { params })
      .pipe(
        map((res) => ({
          notifications: res.data || [],
          total: res.pagination?.total || 0,
          page: res.pagination?.page || 1,
          limit: res.pagination?.limit || 20,
          totalPages: res.pagination?.totalPages || 0,
        }))
      );
  }

  getNotification(id: string): Observable<Notification> {
    return this.http
      .get<ApiResponse<Notification>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }

  getStats(): Observable<DashboardStats> {
    return this.http
      .get<ApiResponse<DashboardStats>>(`${this.apiUrl}/stats`)
      .pipe(map((res) => res.data!));
  }
}
