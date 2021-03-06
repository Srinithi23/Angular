import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderItem } from 'src/app/shared/order-item.model';
import { Inject } from '@angular/core';  
import { ItemService } from 'src/app/shared/item.service';
import { Item } from 'src/app/shared/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from 'src/app/shared/order.service';


@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  formData:OrderItem;
  itemList:Item[];
  isValid:boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef:MatDialogRef<OrderItemsComponent>,
    private itemService:ItemService,
    private orderService:OrderService) { }

  ngOnInit(): void {
    this.itemService.getItemList().then(res =>this.itemList = res as Item[]);
    if(this.data.orderItemIndex==null){
    this.formData ={
      ORDERITEM_ID:0,
      ORDER_ID:this.data.ORDERID,
      ITEMID:0,
      ItemName:'',
      Price:0,
      QUANTITY:0,
      Total:0
    }
  }
    else{
    this.formData =Object.assign({},this.orderService.orderItems[this.data.orderItemIndex]);
  }
}
  updatePrice(ctrl){
    if(ctrl.selectedIndex == 0){
      this.formData.Price=0;
      this.formData.ItemName='';

    }
    else{
      this.formData.Price = this.itemList[ctrl.selectedIndex-1].PRICE;
      this.formData.ItemName = this.itemList[ctrl.selectedIndex-1].ITEM_NAME;

    }
    this.updateTotal();
  }

  updateTotal(){
    this.formData.Total =parseFloat((this.formData.QUANTITY * this.formData.Price).toFixed(2));
  }
  onSubmit(form:NgForm){
     if(this.validateForm(form.value))
     {
       if(this.data.orderItemIndex==null)
    this.orderService.orderItems.push(form.value);
    else
    this.orderService.orderItems[this.data.orderItemIndex] =form.value;
    this.dialogRef.close();
    }
  }

  validateForm(formData:OrderItem){
    this.isValid =true;
    if(formData.ITEMID==0)
    this.isValid =false;
    else if(formData.QUANTITY==0)
    this.isValid=false;
    return this.isValid;

  }

}
