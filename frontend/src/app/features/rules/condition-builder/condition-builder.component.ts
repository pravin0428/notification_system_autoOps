import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ConditionOperator } from '../../../core/models/notification.models';

@Component({
  standalone: false,
  selector: 'app-condition-builder',
  templateUrl: './condition-builder.component.html',
  styleUrls: ['./condition-builder.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConditionBuilderComponent),
      multi: true,
    },
  ],
})
export class ConditionBuilderComponent implements ControlValueAccessor {
  @Input() disabled = false;

  conditionsForm: FormGroup;
  operators = Object.values(ConditionOperator);

  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    this.conditionsForm = this.fb.group({
      conditions: this.fb.array([]),
    });

    this.conditionsForm.valueChanges.subscribe((value) => {
      this.onChange(value.conditions);
    });
  }

  get conditions(): FormArray {
    return this.conditionsForm.get('conditions') as FormArray;
  }

  getConditionGroups(): FormGroup[] {
    return this.conditions.controls as FormGroup[];
  }

  writeValue(conditions: Array<{ field: string; operator: ConditionOperator; value: unknown }>): void {
    this.conditions.clear();
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach((c) => this.addCondition(c.field, c.operator, c.value));
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.conditionsForm.disable();
    } else {
      this.conditionsForm.enable();
    }
  }

  addCondition(field = '', operator: ConditionOperator = ConditionOperator.EQUALS, value: unknown = ''): void {
    const conditionGroup = this.fb.group({
      field: [field],
      operator: [operator],
      value: [value],
    });
    this.conditions.push(conditionGroup);
  }

  removeCondition(index: number): void {
    this.conditions.removeAt(index);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
