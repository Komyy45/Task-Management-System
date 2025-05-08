import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ITask } from '../../models/ITask.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  category: string;
  assignee?: string;
}

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: false,
  animations: [
    trigger('cardState', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
      })),
      state('hovered', style({
        transform: 'scale(1.03)',
        boxShadow: '0 8px 15px rgba(0,0,0,0.15)'
      })),
      transition('normal <=> hovered', animate('200ms cubic-bezier(0.35, 0, 0.25, 1)')),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms 100ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class TaskCardComponent implements OnInit {
  @Input() task!: ITask;
  cardState: 'normal' | 'hovered' = 'normal';
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  toggleHover() {
    this.cardState = this.cardState === 'normal' ? 'hovered' : 'normal';
  }
  
  getStatusIcon(): string {
    switch(this.task.status) {
      case 'completed': return 'bi bi-check-circle-fill';
      case 'in-progress': return 'bi bi-clock-history';
      case 'pending': return 'bi bi-hourglass';
      default: return 'bi bi-question-circle';
    }
  }
  
  getStatusClass(): string {
    return `status-${this.task.status}`;
  }
  
  getPriorityClass(): string {
    return `priority-${this.task.priority}`;
  }
  
  // Format relative due date (e.g., "Today", "Tomorrow", "3 days")
  getRelativeDueDate(): string {
    const now = new Date();
    const dueDate = new Date(this.task.dueDate);
    
    // Set times to midnight for day comparison
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    // Calculate difference in days
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  }
}