import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ApiResponse, LoginPayload, RegisterPayload, User, UserinformationPayload } from '../model/common.model';
import { map } from 'rxjs';
import { ApiEndpoint, LocalStorage } from '../constants/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  router = inject(Router);

  constructor(private _http: HttpClient) {
    if(this.getUserToken()){
      this.isLoggedIn.update(() => true)
    }
  }

  register(payload: RegisterPayload){
    return this._http.post<ApiResponse<User>>(
      `${ApiEndpoint.Auth.Register}`,
      payload
    );
  }

  userinformation(payload: UserinformationPayload){
    const token = this.getUserToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(token)
    
    return this._http.post<ApiResponse<User>>(
      `${ApiEndpoint.Auth.UserInformation}`,
      payload,
      { headers }
    );
  }

  login(payload: LoginPayload){
    return this._http.post<ApiResponse<User>>(
      `${ApiEndpoint.Auth.Login}`,
      payload
    ).pipe(map((response) => {
      if(response.status && response.token){
        localStorage.setItem(LocalStorage.token , response.token);
        this.isLoggedIn.update(() => true);
      }
      return response;
    }));
  }

  me(){
    return this._http.get<ApiResponse<User>>(
      `${ApiEndpoint.Auth.Me}`,
    );
  }

  getUserToken(){
    return localStorage.getItem(LocalStorage.token);
  }

  logout(){
    localStorage.removeItem(LocalStorage.token)
    this.isLoggedIn.update(() => false);
    this.router.navigate(['login'])
  }
}
