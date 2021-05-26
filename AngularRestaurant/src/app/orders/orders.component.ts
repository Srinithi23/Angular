import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../shared/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(private service:OrderService,
    private router:Router,
    private toastr:ToastrService) { }

  ngOnInit(): void {
this.RefreshList();  
}

  RefreshList(){
    this.service.getOrderList().then(res=>this.orderList=res);


  }

  openForEdit(ORDERID:number){
    this.router.navigate(['/order/edit/'+ORDERID]);

  }
  onOrderDelete(id:number){
    if(confirm('Are you sure to delete this order?')){
    this.service.deleteOrder(id).then(res =>{
      this.RefreshList(); 
      this.toastr.success("Deleted Successfully","Order deleted.");
    });
  }
  }

}
