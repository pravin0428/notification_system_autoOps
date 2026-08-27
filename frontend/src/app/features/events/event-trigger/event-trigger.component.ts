import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../core/services/event.service';
import { EventType, EventTriggerResult } from '../../../core/models/notification.models';

@Component({
  selector: 'app-event-trigger',
  templateUrl: './event-trigger.component.html',
  styleUrls: ['./event-trigger.component.scss'],
})
export class EventTriggerComponent implements OnInit {
  eventForm!: FormGroup;
  events = Object.values(EventType);
  sending = false;
  result: EventTriggerResult | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      type: ['', Validators.required],
      eventId: [''],
      order: this.fb.group({
        id: ['', Validators.required],
        total: [null, [Validators.required, Validators.min(0)]],
        status: [''],
        customer: this.fb.group({
          name: [''],
          email: [''],
        }),
      }),
      payment: this.fb.group({
        reason: [''],
        amount: [null],
      }),
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach((key) => {
        this.eventForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.sending = true;
    this.result = null;

    const formValue = this.eventForm.value;
    const type = formValue.type as EventType;
    const eventId = formValue.eventId || undefined;

    let data: Record<string, unknown> = {};

    if (type === EventType.ORDER_CREATED || type === EventType.ORDER_UPDATED) {
      data = {
        order: {
          id: formValue.order.id,
          total: formValue.order.total,
          status: formValue.order.status,
          customer: {
            name: formValue.order.customer.name,
            email: formValue.order.customer.email,
          },
        },
      };
    } else if (type === EventType.PAYMENT_FAILED) {
      data = {
        order: {
          id: formValue.order.id,
          total: formValue.order.total,
        },
        payment: {
          reason: formValue.payment.reason,
          amount: formValue.payment.amount,
        },
      };
    }

    this.eventService.triggerEvent(type, data, eventId).subscribe({
      next: (result) => {
        this.result = result;
        this.sending = false;
      },
      error: () => {
        this.sending = false;
      },
    });
  }

  resetForm(): void {
    this.eventForm.reset({
      type: '',
      eventId: '',
      order: { id: '', total: null, status: '', customer: { name: '', email: '' } },
      payment: { reason: '', amount: null },
    });
    this.result = null;
  }
}
