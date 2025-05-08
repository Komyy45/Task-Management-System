import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';
import { AuthService } from '../auth/auth.service';
import { IProfile } from '../../shared/models/IProfile.model';
import { TaskService } from '../tasks/tasks.service';


interface TaskSummary {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  categories: { [key: string]: number };
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('itemsAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {
  user: IProfile | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  tempUser: IProfile | null = null;
  taskSummary: TaskSummary = {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    categories: {}
  };
  
  chartOptions: any = {
    series: [
      {
        name: 'Task Status',
        data: [0, 0, 0]
      }
    ],
    chart: {
      type: 'donut',
      height: 280
    },
    labels: ['Completed', 'In Progress', 'Pending'],
    colors: ['#28a745', '#007bff', '#ffc107'],
    legend: {
      position: 'bottom'
    }
  };

  categoryColors: {[key: string]: string} = {
    'Development': '#007bff',
    'Design': '#6f42c1',
    'Meeting': '#fd7e14',
    'Research': '#20c997',
    'Documentation': '#6c757d',
    'Testing': '#dc3545',
    'Planning': '#17a2b8'
  };

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadTaskSummary();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const currentUserEmail = 'current.user@example.com'; 
    
    this.authService.getCurrentUser().subscribe({
      next: (userData: IProfile) => {
        this.user = userData;
        console.log(this.user)
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
        // In a real app, show a notification
      }
    });
  }

  loadTaskSummary(): void {
    // In a real app, you would get the current user's email from auth service
    const currentUserEmail = 'current.user@example.com';
    
    this.taskService.getTaskSummary().subscribe({
      next: (summary: TaskSummary) => {
        this.taskSummary = summary;
        
        // Update chart data
        this.updateChartData();
      },
      error: (error) => {
        console.error('Error loading task summary:', error);
      }
    });
  }

  updateChartData(): void {
    this.chartOptions.series[0].data = [
      this.taskSummary.completed,
      this.taskSummary.inProgress,
      this.taskSummary.pending
    ];
  }

  startEditing(): void {
    if (this.user) {
      this.tempUser = { ...this.user };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.tempUser = null;
  }



  getCompletionPercentage(): number {
    if (this.taskSummary.total === 0) return 0;
    return Math.round((this.taskSummary.completed / this.taskSummary.total) * 100);
  }

  getGenderLabel(): string {
    return this.user?.gender ? 'Female' : 'Male';
  }

  getCategoryArray(): { name: string, count: number, color: string }[] {
    console.log(this.taskSummary.categories)
    return Object.keys(this.taskSummary.categories).map(category => {
      return {
        name: category,
        count: this.taskSummary.categories[category],
        color: this.categoryColors[category] || '#6c757d' // Default color
      };
    }).sort((a, b) => b.count - a.count);
  }
}