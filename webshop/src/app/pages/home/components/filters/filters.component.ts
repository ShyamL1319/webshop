import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit, OnDestroy{
  @Output() showCategory = new EventEmitter<string>();
  categories: string[] | undefined;
  categoriesSubscription: Subscription | undefined;
  constructor( private storeService:StoreService) { }

  ngOnInit(): void {
    this.categoriesSubscription = this.storeService.getAllCategories().subscribe(_categories => { 
      this.categories = _categories;
    })
  }

  onShowCategory(category:string):void { 
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubscription) { 
      this.categoriesSubscription.unsubscribe();
    }
  }

}
