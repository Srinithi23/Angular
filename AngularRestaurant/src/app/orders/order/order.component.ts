import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { parse } from 'path';
import { from } from 'rxjs';
import { Customer } from 'src/app/shared/customer.model';
import { CustomerService } from 'src/app/shared/customer.service';
import { OrderService } from 'src/app/shared/order.service';
import { OrderItemsComponent } from '../order-items/order-items.component';
import{ UserLoginComponent} from 'src/app/user-login/user-login.component'
import { logging } from 'selenium-webdriver';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  Today =new Date();
  customerList : Customer[];
  isValid:boolean = true;

  constructor(public service:OrderService,
    private dialog:MatDialog,
    private customerService:CustomerService,
    private toastr:ToastrService,
    private router:Router,
    private currentRoute:ActivatedRoute) { }

  ngOnInit(): void {
    let ORDER_ID =this.currentRoute.snapshot.paramMap.get('id');
    if(ORDER_ID==null)
    this.resetForm(); 
    else{
      this.service.getOrderById(parseInt(ORDER_ID)).then(res=>{
        this.service.formData =res.order;
        this.service.formData =res.orderDetails;

      });
    }
    this.customerService.getCustomerList().then(res=>this.customerList = res as Customer[]);

  }

  resetForm(form?:NgForm){
    
     if (form = null)
     form.resetForm();
    this.service.formData={
      ORDERID:null,
      ORDERNO:Math.floor(1000000+Math.random()*900000).toString(),
      CUSTID:0,
      PAYMENT:'',
      TOTALCOST:0,
      DOB:null
      

    };
    this.service.orderItems=[];
  }
  AddorEditOrderItem(orderItemIndex,ORDERID){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.autoFocus = true;
    dialogconfig.disableClose = true;
    dialogconfig.width ="50%";
    dialogconfig.data = {orderItemIndex,ORDERID}

    this.dialog.open(OrderItemsComponent,dialogconfig).afterClosed().subscribe(res=>{
          this.updateGrandTotal();

    });
 
  }


  onDeleteOrderItem(ORDERITEM_ID:number,i:number){
    this.service.orderItems.splice(i,1);
    this.updateGrandTotal();

  }

  updateGrandTotal(){
    if(this.service.formData.DOB==this.Today){
   this.service.formData.TOTALCOST = this.service.orderItems.reduce((prev,curr)=>{
      return ((prev+curr.Total)-10%(this.service.formData.TOTALCOST));
    },0);
    this.service.formData.TOTALCOST =parseFloat((this.service.formData.TOTALCOST).toFixed(2));
  }
  else{
    this.service.formData.TOTALCOST = this.service.orderItems.reduce((prev,curr)=>{
      return prev+curr.Total;
    },0);
    this.service.formData.TOTALCOST =parseFloat((this.service.formData.TOTALCOST).toFixed(2));
  }

  }

  validateForm(){
    this.isValid = true;
    if(this.service.formData.CUSTID==0)
    this.isValid = false;
    else if(this.service.orderItems.length==0)
    this.isValid = false;
    return this.isValid;
  }

  onSubmit(form:NgForm){
      if(this.validateForm())
      {
      this.service.saveorUpdateOrder().subscribe(res=>{
        this.resetForm();
        this.toastr.success('Order Success','Restaurant App.');
        this.router.navigate(['/orders']);
      })
    
  }

  
}


}




// Login(loginForm:NgForm){
//   if(Username==Kanini && Password==Kanini@123){
//   console.log(loginForm.value);
// }
// else{
//   this.toastr.warning('Incorrect Username or Password','Restaurant App.');

// }