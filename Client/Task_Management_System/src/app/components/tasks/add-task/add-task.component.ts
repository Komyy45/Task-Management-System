import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { TaskService } from '../tasks.service';
import { ITaskForm } from '../../../shared/models/ITaskForm.model';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
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
export class AddTaskComponent implements OnInit {
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string | null = null;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // No initialization needed as the form is handled by the shared component
  }

  onSubmit(formData: ITaskForm): void {
    this.isSubmitting = true;
    this.submitError = null;

    this.taskService.addTask(formData).subscribe({
      next: () => {
        this.submitSuccess = true;

        // Navigate to task list after a brief delay to show success message
        setTimeout(() => {
          this.router.navigate(['/app/tasks']);
        }, 1500);
      },
      error: (error) => {
        this.submitError = error.message || 'An error occurred while adding the task. Please try again.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  onReset(): void {
    this.submitError = null;
    this.submitSuccess = false;
  }

  onCancel(): void {
    this.router.navigate(['/app/tasks']);
  }
}