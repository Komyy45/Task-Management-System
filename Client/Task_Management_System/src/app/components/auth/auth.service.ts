import { Observable, map, tap } from "rxjs";
import { IRegisteration } from "../../shared/models/IRegisteration.model";
import { ILogin } from "../../shared/models/ILogin.model";
import { Injectable } from "@angular/core";
import { IProfile } from "../../shared/models/IProfile.model";
import { HttpClient } from "@angular/common/http";
import { BASE_URL } from "../../environment/development";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(loginData: ILogin): Observable<{success: boolean, message: string}> {
    console.log(loginData);
    return this.http.post<{email: string, token: string}>(`${BASE_URL}/auth/login`, loginData)
    .pipe(tap((loginResponse) => {
      localStorage.setItem("token", loginResponse.token);
    }), map((loginRepsonse) => {
      return { message: `${loginRepsonse.email} logged in Successfully!`, success: true };
    }));
  }

  register(registerData: IRegisteration): Observable<{success: boolean, message: string}> {
    return this.http.post<{message: string}>(`${BASE_URL}/auth/register`, registerData)
    .pipe(map((registerRepsonse) => {
      return { message: registerRepsonse.message, success: true };
    }));
  }

  getCurrentUser() {
    return this.http.get<IProfile>(`${BASE_URL}/auth/user`);
  }

  logout(expired: boolean = false) {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Navigate to login page
    if (expired) {
      this.router.navigate(['/auth/login'], { queryParams: { expired: 'true' } });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}