import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RuleListComponent } from './features/rules/rule-list/rule-list.component';
import { RuleFormComponent } from './features/rules/rule-form/rule-form.component';
import { ConditionBuilderComponent } from './features/rules/condition-builder/condition-builder.component';
import { EventTriggerComponent } from './features/events/event-trigger/event-trigger.component';
import { NotificationHistoryComponent } from './features/notifications/notification-history/notification-history.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    RuleListComponent,
    RuleFormComponent,
    ConditionBuilderComponent,
    EventTriggerComponent,
    NotificationHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
