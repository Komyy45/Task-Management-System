import { Injectable } from '@angular/core';
import { Observable, map, of, take, tap } from 'rxjs';
import { ITask } from '../../shared/models/ITask.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../../environment/development';
import { ITaskForm } from '../../shared/models/ITaskForm.model';

// Define the TaskSummary interface to match what's needed in ProfileComponent
export interface TaskSummary {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  categories: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  getTasks(pageIndex: number = 1, pageSize: number = 5, category?: string, searchTerm?: string, priority?: string): Observable<{ tasks: ITask[], total: number }> {
    let params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString());
    
    if(category) 
      params = params.set("category", category);
    if(searchTerm)
      params = params.set("search", searchTerm);
    if(priority)
      params = params.set("priority", priority);


    return this.httpClient.get<{ tasks: ITask[], total: number }>(`${BASE_URL}/task`, {
      params
    });
  }

  getTasksStats(): Observable<{ completed: number, inProgress: number, upcomingDue: number }> {
    return this.httpClient
      .get<Array<{ _id: string, status: string, progress: number, dueDate: Date }>>(`${BASE_URL}/task/stats`)
      .pipe(map((tasks) => {
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === "in-progress").length;
        const upcomingDue = tasks.filter(task => {
          const today = new Date();
          const dueDate = new Date(task.dueDate);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 3 && diffDays >= 0 && task.status !== 'completed';
        }).length;
        return { completed, inProgress, upcomingDue };
      }));
  }

  // New method to get task summary for ProfileComponent
  getTaskSummary(): Observable<TaskSummary> {
    return this.httpClient
      .get<{ tasks: Array<{ _id: string, status: string, progress: number, dueDate: Date }>, categories: { [key: string]: number } }>(`${BASE_URL}/task/summary`)
      .pipe(map(response => {
        const tasks = response.tasks;
        const categories = response.categories || {};
        
        // Calculate task summary data
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;
        const pending = tasks.filter(task => task.status === 'pending').length;
        
        return {
          total,
          completed,
          inProgress,
          pending,
          categories
        };
      }));
  }

  // Add a new task method
  addTask(task: ITaskForm): Observable<ITask> {
    return this.httpClient.post<ITask>(`${BASE_URL}/task`, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      status: task.status || 'pending'
    });
  }

  // Get a task by ID
  getTask(id: string): Observable<ITask> {
    return this.httpClient.get<ITask>(`${BASE_URL}/task/${id}`);
  }

  // Update a task
  updateTask(id: string, task: ITaskForm): Observable<ITask> {
    return this.httpClient.put<ITask>(`${BASE_URL}/task/${id}`, task);
  }

  // Delete a task
  deleteTask(id: string): Observable<{ message: string }> {
    return this.httpClient.delete<{ message: string }>(`${BASE_URL}/task/${id}`);
  }
  
  getCategories(): Observable<{ [key: string]: number }> {
    return this.httpClient.get<{ [key: string]: number }>(`${BASE_URL}/task/categories`);
  }

  completeTask(id: string, completed:boolean, status: string, progress: number): Observable<{ message: string }> {
    return this.httpClient.put<{ message: string }>(`${BASE_URL}/task/${id}/toggle-complete`, {
      completed,
      status,
      progress
    });
  }
}