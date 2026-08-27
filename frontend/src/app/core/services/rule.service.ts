import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, Rule } from '../models/notification.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private apiUrl = `${environment.apiUrl}/rules`;

  constructor(private http: HttpClient) {}

  getRules(event?: string, enabled?: boolean): Observable<Rule[]> {
    let params = new HttpParams();
    if (event) params = params.set('event', event);
    if (enabled !== undefined) params = params.set('enabled', String(enabled));

    return this.http
      .get<ApiResponse<Rule[]>>(this.apiUrl, { params })
      .pipe(map((res) => res.data || []));
  }

  getRule(id: string): Observable<Rule> {
    return this.http
      .get<ApiResponse<Rule>>(`${this.apiUrl}/${id}`)
      .pipe(map((res) => res.data!));
  }

  createRule(rule: Partial<Rule>): Observable<Rule> {
    return this.http
      .post<ApiResponse<Rule>>(this.apiUrl, rule)
      .pipe(map((res) => res.data!));
  }

  updateRule(id: string, rule: Partial<Rule>): Observable<Rule> {
    return this.http
      .put<ApiResponse<Rule>>(`${this.apiUrl}/${id}`, rule)
      .pipe(map((res) => res.data!));
  }

  updateRuleStatus(id: string, enabled: boolean): Observable<Rule> {
    return this.http
      .patch<ApiResponse<Rule>>(`${this.apiUrl}/${id}/status`, { enabled })
      .pipe(map((res) => res.data!));
  }

  deleteRule(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
