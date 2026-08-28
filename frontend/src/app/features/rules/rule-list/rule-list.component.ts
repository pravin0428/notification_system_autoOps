import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RuleService } from '../../../core/services/rule.service';
import { Rule } from '../../../core/models/notification.models';

@Component({
  standalone: false,
  selector: 'app-rule-list',
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.scss'],
})
export class RuleListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  rules: Rule[] = [];
  filteredRules: Rule[] = [];
  displayedRules: Rule[] = [];
  loading = true;
  searchTerm = '';
  filterEnabled: string = 'all';
  totalRules = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private ruleService: RuleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.loading = true;
    this.ruleService.getRules().subscribe({
      next: (rules) => {
        this.rules = rules;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredRules = this.rules.filter((rule) => {
      const matchesSearch =
        !this.searchTerm ||
        rule.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        rule.event.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesEnabled =
        this.filterEnabled === 'all' ||
        (this.filterEnabled === 'enabled' && rule.enabled) ||
        (this.filterEnabled === 'disabled' && !rule.enabled);

      return matchesSearch && matchesEnabled;
    });

    this.totalRules = this.filteredRules.length;
    this.updateDisplayedRules();
  }

  updateDisplayedRules(): void {
    const start = this.currentPage * this.pageSize;
    this.displayedRules = this.filteredRules.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRules();
  }

  toggleEnabled(rule: Rule): void {
    this.ruleService.updateRuleStatus(rule._id, !rule.enabled).subscribe({
      next: () => {
        rule.enabled = !rule.enabled;
        this.applyFilters();
      },
    });
  }

  deleteRule(rule: Rule): void {
    if (confirm(`Delete rule "${rule.name}"? This cannot be undone.`)) {
      this.ruleService.deleteRule(rule._id).subscribe({
        next: () => {
          this.rules = this.rules.filter((r) => r._id !== rule._id);
          this.applyFilters();
        },
      });
    }
  }

  editRule(rule: Rule): void {
    this.router.navigate(['/rules/edit', rule._id]);
  }

  createRule(): void {
    this.router.navigate(['/rules/create']);
  }

  getChannelIcon(channel: string): string {
    return channel === 'EMAIL' ? 'email' : 'notifications';
  }
}
