import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss']
})
export class CustomerInfoComponent implements OnInit {

  public cifNo = '';
  public customerName = '';

  constructor(private location: Location, private customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.currentCif.subscribe(cif => this.cifNo = cif);
    this.customerService.currentCustomerName.subscribe(name => this.customerName = name);
  }

  back() {
    this.location.back();
  }
}
