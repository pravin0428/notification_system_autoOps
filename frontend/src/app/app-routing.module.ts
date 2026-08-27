import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RuleListComponent } from './features/rules/rule-list/rule-list.component';
import { RuleFormComponent } from './features/rules/rule-form/rule-form.component';
import { EventTriggerComponent } from './features/events/event-trigger/event-trigger.component';
import { NotificationHistoryComponent } from './features/notifications/notification-history/notification-history.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'rules', component: RuleListComponent },
  { path: 'rules/create', component: RuleFormComponent },
  { path: 'rules/edit/:id', component: RuleFormComponent },
  { path: 'events/trigger', component: EventTriggerComponent },
  { path: 'notifications', component: NotificationHistoryComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
