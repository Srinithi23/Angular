import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './orders/order/order.component';
import { OrdersComponent } from './orders/orders.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  {path:'',redirectTo:'user-login',pathMatch:'full'},
  {path:'orders',component:OrdersComponent},
  {path:'',component:UserLoginComponent},

  {path:'order',children:[
    {path:'',component:OrderComponent},
    {path:'edit/:id',component:OrderComponent}

  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
