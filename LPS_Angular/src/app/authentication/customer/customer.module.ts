import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerRouting } from './customer.routing';
import { HttpClientModule } from '@angular/common/http';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
// import { ChartModule } from 'angular2-chartjs';
import { CustomerListComponent } from './components/customer/customer-list/customer-list.component';
import { CustomerInfoComponent } from './components/customer/customer-info/customer-info.component';
import { CustomerOverviewComponent } from './components/customer/customer-info/customer-overview/customer-overview.component';
import { CustomerPortfolioComponent } from './components/customer/customer-info/customer-portfolio/customer-portfolio.component';
import { CustomerAccountComponent } from './components/customer/customer-info/customer-account/customer-account.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerInfoComponent,
    CustomerOverviewComponent,
    CustomerPortfolioComponent,
    CustomerAccountComponent
  ],
  imports: [
    CommonModule,
    CustomerRouting,
    HttpClientModule,
    SharedsModule,
    RouterModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    FormsModule
    // ChartModule
  ]
})
export class CustomerModule { constructor() { console.log('Loaded customer module'); } }
