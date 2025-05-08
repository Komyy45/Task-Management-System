import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../tasks.service';
import { ITask } from '../../../shared/models/ITask.model';
import { ITaskForm } from '../../../shared/models/ITaskForm.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class UpdateTaskComponent implements OnInit {
  taskId: string = '';
  task: ITask | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = params['id'];
      this.loadTask();
    });
  }
  
  loadTask(): void {
    this.isLoading = true;
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: (error) => {
        this.submitError = 'Error loading task. Please try again.';
        this.isLoading = false;
        console.error('Error loading task:', error);
      }
    });
  }
  
  onSubmit(formData: ITaskForm): void {
    this.isSubmitting = true;
    this.submitError = null;
    
    this.taskService.updateTask(this.taskId, formData).subscribe({
      next: () => {
        this.submitSuccess = true;
        // Navigate to task list after a brief delay to show success message
        setTimeout(() => {
          this.router.navigate(['/app/tasks']);
        }, 1500);
      },
      error: (error) => {
        this.submitError = error.message || 'An error occurred while updating the task. Please try again.';
        this.isSubmitting = false;
        console.error('Error updating task:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
  
  onCancel(): void {
    this.router.navigate(['/app/tasks']);
  }
  
  onReset(): void {
    this.submitError = null;
    this.submitSuccess = false;
    this.loadTask(); // Reload the original task data
  }
}
