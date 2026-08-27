import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RuleService } from '../../../core/services/rule.service';
import { EventType, NotificationChannelType, Rule } from '../../../core/models/notification.models';

@Component({
  selector: 'app-rule-form',
  templateUrl: './rule-form.component.html',
  styleUrls: ['./rule-form.component.scss'],
})
export class RuleFormComponent implements OnInit {
  ruleForm!: FormGroup;
  isEditMode = false;
  ruleId: string | null = null;
  loading = false;
  saving = false;
  events = Object.values(EventType);
  channels = Object.values(NotificationChannelType);
  templatePlaceholder = 'e.g. Order {{order.id}} has value {{order.total}}';

  constructor(
    private fb: FormBuilder,
    private ruleService: RuleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.ruleId = this.route.snapshot.paramMap.get('id');
    if (this.ruleId) {
      this.isEditMode = true;
      this.loadRule(this.ruleId);
    }
  }

  initForm(): void {
    this.ruleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      event: ['', Validators.required],
      conditions: [[]],
      recipients: [[], [Validators.required]],
      channel: ['', Validators.required],
      template: ['', [Validators.required, Validators.minLength(5)]],
      enabled: [true],
    });
  }

  loadRule(id: string): void {
    this.loading = true;
    this.ruleService.getRule(id).subscribe({
      next: (rule) => {
        this.ruleForm.patchValue({
          name: rule.name,
          event: rule.event,
          conditions: rule.conditions,
          recipients: rule.recipients,
          channel: rule.channel,
          template: rule.template,
          enabled: rule.enabled,
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/rules']);
      },
    });
  }

  onSubmit(): void {
    if (this.ruleForm.invalid) {
      Object.keys(this.ruleForm.controls).forEach((key) => {
        this.ruleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving = true;
    const formValue = this.ruleForm.value;

    if (this.isEditMode && this.ruleId) {
      this.ruleService.updateRule(this.ruleId, formValue).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/rules']);
        },
        error: () => {
          this.saving = false;
        },
      });
    } else {
      this.ruleService.createRule(formValue).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/rules']);
        },
        error: () => {
          this.saving = false;
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/rules']);
  }

  getErrorMessage(field: string): string {
    const control = this.ruleForm.get(field);
    if (control?.hasError('required')) return `${field} is required`;
    if (control?.hasError('minlength')) return `${field} is too short`;
    return '';
  }

  onRecipientsInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    if (value) {
      const currentRecipients = this.ruleForm.get('recipients')?.value || [];
      if (!currentRecipients.includes(value)) {
        this.ruleForm.patchValue({ recipients: [...currentRecipients, value] });
        target.value = '';
      }
    }
  }

  removeRecipient(recipient: string): void {
    const current = this.ruleForm.get('recipients')?.value || [];
    this.ruleForm.patchValue({ recipients: current.filter((r: string) => r !== recipient) });
  }
}
