import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, EventTriggerResult } from '../models/notification.models';
import { EventType } from '../models/notification.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  triggerEvent(type: EventType, data: Record<string, unknown>, eventId?: string): Observable<EventTriggerResult> {
    const payload: Record<string, unknown> = { type, data };
    if (eventId) payload['eventId'] = eventId;

    return this.http
      .post<ApiResponse<EventTriggerResult>>(this.apiUrl, payload)
      .pipe(map((res) => res.data!));
  }
}
