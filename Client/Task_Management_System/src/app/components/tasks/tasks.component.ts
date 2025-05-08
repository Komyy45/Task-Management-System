import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ITask } from '../../shared/models/ITask.model';
import { TaskService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  standalone: false,
  animations: [
    trigger('itemsAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class TasksComponent implements OnInit {
  tasks: ITask[] = [];
  totalTasks = 0;
  currentPage = 1;
  pageSize = 5;
  loading = true;
  categories: string[] = [];
  priorities: string[] = ['low', 'medium', 'high'];

  selectedCategory: string = '';
  selectedPriority: string = '';
  searchTerm: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    // Initialize categories
    this.categories = [
      'Design',
      'Development',
      'Documentation',
      'QA',
      'Content',
      'Security'
    ];
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getTasks(
      this.currentPage,
      this.pageSize,
      this.selectedCategory,
      this.searchTerm,
      this.selectedPriority
    ).subscribe(result => {
      this.tasks = result.tasks;
      this.totalTasks = result.total;
      this.loading = false;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTasks();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedPriority = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadTasks();
  }

  applyFilters(): void {
    console.log(this.searchTerm, this.selectedCategory, this.selectedPriority);
    this.loadTasks();
  }

  onDeleteTask(id: string): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  toggleTaskCompletion(task: ITask): void {
    if (!task.completed) {
      this.taskService.completeTask(task._id, true, "completed", 100).subscribe(
        (response) => {
          task.completed = true;
          task.progress = 100;
          task.status = 'completed';
        },
        error => {
          console.error('Error completing task:', error);
        }
      );
    } else {
      this.taskService.completeTask(task._id, false, "in-progress", 0).subscribe(
        (response) => {
          task.completed = false;
          task.progress = 0;
          task.status = 'in-progress';
        },
        error => {
          console.error('Error completing task:', error);
        }
      );
    }
  }
}
