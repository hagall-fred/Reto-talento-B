import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/model/common.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  authService = inject(AuthService);

  user!: User;

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (response) => {
        console.log(response)
        this.user = response.data;
      }
    })
    console.log(this.user)
  }

  

  logout(){
    this.authService.logout();
  }

}
