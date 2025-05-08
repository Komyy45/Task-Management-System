import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { AuthGuard } from './components/auth/guards/auth.guard';
import { AddTaskComponent } from './components/tasks/add-task/add-task.component';
import { UpdateTaskComponent } from './components/tasks/update-task/update-task.component';

const routes: Routes = [
  {
    path : 'auth',
    children: [
      {
        path : 'login',
        component: LoginComponent
      },
      {
        path : 'register',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'app',
    component: AppHomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent
      },
      {
        path: "tasks/add",
        component: AddTaskComponent
      },
      {
        path: "tasks/update/:id",
        component: UpdateTaskComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "app/dashboard",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
