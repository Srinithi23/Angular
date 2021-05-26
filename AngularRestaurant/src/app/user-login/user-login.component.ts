import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { from } from 'rxjs';
import{UserLogin} from 'src/app/shared/user-login.model';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styles: []
})
export class UserLoginComponent implements OnInit {
  userlogin :UserLogin;


  constructor(
    private toastr:ToastrService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    
  }

  
  Login(loginForm:NgForm){
    
   
    this.toastr.success('Login Successfull','Restaurant App.');
    this.router.navigate(['/order']);
  


  }
}
