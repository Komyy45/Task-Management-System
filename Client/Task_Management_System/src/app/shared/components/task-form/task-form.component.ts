import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { ITask } from '../../models/ITask.model';
import { ITaskForm } from '../../models/ITaskForm.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ transform: 'translateY(30px)', opacity: 0 }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: ITask | null = null;
  @Input() isSubmitting: boolean = false;
  @Input() submitSuccess: boolean = false;
  @Input() submitError: string | null = null;
  @Input() submitButtonText: string = 'Create Task';
  @Input() formTitle: string = 'Create New Task';
  
  @Output() formSubmit = new EventEmitter<ITaskForm>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formReset = new EventEmitter<void>();
  
  taskForm!: FormGroup;
  
  // These would typically come from a database or service
  priorities: string[] = ['high', 'medium', 'low'];
  categories: string[] = ['Development', 'Design', 'Meeting', 'Research', 'Documentation', 'Testing', 'Planning'];
  statuses: string[] = ['pending', 'in-progress'];
  
  // Color mappings for categories and priorities
  categoryColors: {[key: string]: string} = {
    'Development': '#007bff',
    'Design': '#6f42c1',
    'Meeting': '#fd7e14',
    'Research': '#20c997',
    'Documentation': '#6c757d',
    'Testing': '#dc3545',
    'Planning': '#17a2b8'
  };
  
  priorityColors: {[key: string]: string} = {
    'high': '#dc3545',
    'medium': '#ffc107',
    'low': '#28a745'
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task && this.taskForm) {
      this.populateForm();
    }
  }

  initializeForm(): void {
    // Initialize with default values
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      dueDate: [this.formatDate(tomorrow), Validators.required],
      priority: ['medium', Validators.required],
      category: ['Development', Validators.required],
      status: ['pending', Validators.required]
    });
    
    // If we have a task, populate the form
    if (this.task) {
      this.populateForm();
    }
  }
  
  populateForm(): void {
    if (!this.task) return;
    
    this.taskForm.patchValue({
      title: this.task.title,
      description: this.task.description,
      dueDate: this.formatDate(new Date(this.task.dueDate)),
      priority: this.task.priority,
      category: this.task.category,
      status: this.task.status
    });
  }

  // Helper to format date for the date input
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // Getter for easy access to form fields
  get f() { return this.taskForm.controls; }

  // Submit the form
  onSubmit(): void {
    if (this.taskForm.invalid) {
      // Mark all fields as touched to trigger validation visuals
      Object.keys(this.taskForm.controls).forEach(key => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValue = this.taskForm.value as ITaskForm;
    
    // Ensure dueDate is properly formatted
    if (typeof formValue.dueDate === 'string') {
      formValue.dueDate = new Date(formValue.dueDate);
    }

    this.formSubmit.emit(formValue);
  }

  // Reset the form
  onReset(): void {
    this.taskForm.reset({
      priority: 'medium',
      category: 'Development',
      status: 'pending'
    });
    this.formReset.emit();
  }
  
  // Cancel form submission
  onCancel(): void {
    this.formCancel.emit();
  }
}
