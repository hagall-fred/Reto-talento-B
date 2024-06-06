import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/model/common.model';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userinformation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './userinformation.component.html',
  styleUrl: './userinformation.component.css'
})
export class UserinformationComponent {
  form: FormGroup;
  authService = inject(AuthService);

  user!: User;
  router = inject(Router);
  selectedFile: any;
  previewUrl: string | ArrayBuffer | null = null;


  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      edad: new FormControl(''),
      genero: new FormControl(''),
      logo: new FormControl()

    })
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size <= 80096) { // 4 KB en bytes
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result as string;
          console.log(base64String)
          this.form.patchValue({
            logo: base64String
          });
        };
        
        reader.readAsDataURL(file);
      } else {
        alert('La imagen debe ser menor o igual a 4 KB.');
        // También podrías establecer un valor predeterminado para el campo de imagen o eliminar el archivo seleccionado
      }
    }
  }

  ngOnInit(): void {
    this.authService.me().subscribe({
      next: (response) => {
        console.log(response)
        this.user = response.data;
      }
    })
  }

  logout(){
    this.authService.logout();
  }

  onSubmit(){

    if (this.form.valid) {
      console.log(this.form.value)
      this.authService.userinformation(this.form.value).subscribe({
        next: (response) => {
          this.router.navigate(['']);
        }
      });
    }
  }

}
