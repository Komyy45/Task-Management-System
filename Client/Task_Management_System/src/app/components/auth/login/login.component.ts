import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('void <=> *', animate('400ms ease-in-out')),
    ]),
    trigger('formState', [
      state('normal', style({
        transform: 'scale(1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      })),
      state('focused', style({
        transform: 'scale(1.02)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> focused', animate('200ms ease-in-out'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  loading = false;
  formState = 'normal';
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if redirected due to token expiration
    this.route.queryParams.subscribe(params => {
      const expired = params['expired'];
      if (expired === 'true') {
        this.errorMessage = 'Your session has expired. Please log in again.';
      }
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onFocus() {
    this.formState = 'focused';
  }

  onBlur() {
    this.formState = 'normal';
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.f['email'].value,
      password: this.f['password'].value
    }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.successMessage = response.message;
          // Navigate to dashboard or home page after successful login
          setTimeout(() => {
            this.router.navigate(['app/dashboard']);
          }, 1000);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Login error:', error);
      }
    });
  }
}
