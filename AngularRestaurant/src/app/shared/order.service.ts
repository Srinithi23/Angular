import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  formData:Order;
  orderItems:OrderItem[];

  constructor(private http:HttpClient) { }

  saveorUpdateOrder(){
    var body ={
      ...this.formData,
      ORDERDETAILS: this.orderItems

    };
   
    return this.http.post(environment.apiURL+'/Order',body);

  }
  getOrderList(){
    return this.http.get(environment.apiURL+'/Order').toPromise();
  }

  getOrderById(id:number):any{
    return this.http.get(environment.apiURL+'/Order/'+id).toPromise();
  }

  deleteOrder(id:number){
    return this.http.delete(environment.apiURL+'/Order/'+id).toPromise();
  }



}
