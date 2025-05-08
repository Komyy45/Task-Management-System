import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ITask } from '../../../shared/models/ITask.model';
import { IProfile } from '../../../shared/models/IProfile.model';
import { TaskService } from '../../tasks/tasks.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  user: IProfile | null = null;
  recentTasks: ITask[] = [];
  taskStats = { completed: 0, inProgress: 0, upcomingDue: 0 };
  categoryStats: { category: string, count: number }[] = [];
  loading = true;
  today = new Date();

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      console.log(user);
      this.user = user;
    });

    this.taskService.getTasks(1, 3).subscribe(result => {
      this.recentTasks = result.tasks;
      this.loading = false;
    });

    this.taskService.getTasksStats().subscribe(stats => {
      console.log(stats);
      this.taskStats.completed = stats.completed;
      this.taskStats.inProgress = stats.inProgress;
      this.taskStats.upcomingDue = stats.upcomingDue;
    });


    this.taskService.getCategories().subscribe(categories => {
      this.categoryStats = Object.entries(categories).map(([category, count]) => ({
        category,
        count
      }));
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Design': '#6c5ce7',
      'Development': '#00cec9',
      'Documentation': '#fdcb6e',
      'QA': '#e17055',
      'Content': '#74b9ff',
      'Security': '#e84393'
    };
    return colors[category] || '#a29bfe';
  }
}