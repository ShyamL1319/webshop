import { Component, OnInit } from '@angular/core';
import { Cart } from './models/cart.model';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private cartService:CartService) { }
  ngOnInit(): void {
    this.cartService.cart.subscribe(_cart => { 
      this.cart = _cart;
    })
  }
  title = 'webshop';

  cart: Cart = { items: [] };

  
}
