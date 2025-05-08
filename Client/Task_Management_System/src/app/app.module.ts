import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { AnimatedCounterComponent } from './shared/components/animated-counter/animated-counter.component';
import { TaskCardComponent } from './shared/components/task-card/task-card.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './components/auth/interceptors/auth.interceptor';
import { AddTaskComponent } from './components/tasks/add-task/add-task.component';
import { UpdateTaskComponent } from './components/tasks/update-task/update-task.component';
import { TaskFormComponent } from './shared/components/task-form/task-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    TasksComponent,
    SidebarComponent,
    AppHomeComponent,
    AnimatedCounterComponent,
    TaskCardComponent,
    AddTaskComponent,
    UpdateTaskComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    NgbPaginationModule,
    HttpClientModule
  ],
  providers: [provideAnimationsAsync(),{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
