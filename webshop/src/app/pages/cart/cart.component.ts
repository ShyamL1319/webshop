import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        product: 'https://via.placeholder.com/150',
        name: "snickers",
        price: 150,
        quantity: 1,
        id:1
      },
      {
        product: 'https://via.placeholder.com/150',
        name: "snickers",
        price: 150,
        quantity: 3,
        id:2
      },
      {
        product: 'https://via.placeholder.com/150',
        name: "snickers",
        price: 150,
        quantity: 2,
        id:3
      },
    ]
  }
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ];
  constructor(private cartService: CartService, private http:HttpClient) {
    
   }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart) => { 
      this.cart = _cart;
      this.dataSource = this.cart.items;
    })
  }

  getTotal(items: CartItem[]): number { 
    return this.cartService.getTotal(items);
  }

  onClearCart():void { 
    this.cartService.clearCart();
  }
  onRemoveItem(item: CartItem): void {
    this.cartService.removeItem(item);
  }
  
  onRemoveQuantity(cartItem:CartItem): void { 
    this.cartService.removeQuantity(cartItem);
  }

  onAddQuantity(cartItem: CartItem):void { 
    this.cartService.addToCart(cartItem);
  }

  onCheckout(): void { 
    this.http.post(`http://localhost:4242/checkout`, {
      items: this.cart.items
    }).subscribe(async (res: any) => { 
      let stripe = await loadStripe('pk_test_51Mk5uWSJ0f40RIC0oezh4D1qRIfFDqJXKaE69Oi8flL4zP7wjutye2ocMRbWkGi5dn1nzg0rmvWVizrhcdlD50kO00b2Uu8q2N');
      stripe?.redirectToCheckout({
        sessionId:res.id
      })
    })
  }
}
