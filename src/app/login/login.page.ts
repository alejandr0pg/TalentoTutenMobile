import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../providers/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['testapis@tuten.cl', [Validators.required, Validators.email]],
      password: ['1234', [Validators.required, Validators.minLength(4)]],
    });
  }

  // getter para obtener mas facil los inputs del form
  get f() { return this.loginForm.controls; }

  login() {
    this.submitted = true;

    if (this.loginForm.invalid) {
        return;
    }

    const credentials = this.loginForm.value;
    this.auth.login(credentials.email, credentials.password).subscribe(data => {
      console.log('data auth', data);
      if(data) {
        this.router.navigate(['/home']);
      }
    });
  }

}
