import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerModel } from 'src/app/models/Customer/CustomerModel';
import { CustomerInfoModel, CustomerGroup } from 'src/app/models/Customer/CustomerInfoModel';
// import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorService } from 'src/app/services/error.service';
// import { AuthorizationService } from 'src/app/services/authorization.service';
import { formatDate } from '@angular/common';
declare const $;

@Component({
  selector: 'app-customer-overview',
  templateUrl: './customer-overview.component.html',
  styleUrls: ['./customer-overview.component.scss']
})
export class CustomerOverviewComponent implements OnInit {
  viewCustomer: CustomerModel;
  customerInfo: CustomerInfoModel;
  customerGroupCount = 0;
  currentCustomerGroup = 0;
  customerGroup: CustomerGroup[];
  currentIndex = 0;
  acc1Ex = false;
  acc2Ex = false;
  // currentSession: CurrentSessionModel;

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private errorService: ErrorService) { }

  ngOnInit() {
    $('#customerGroupModal').on('hide.bs.modal', (e) => { this.currentIndex = 0; });
    // this.currentSession = this.authService.getUserProfile;
    this.route.params.subscribe((params) => {
      const cif = params.cif;
      this.getCustomerInfo(cif);
    });
  }

  convertDate(date) {

    if (date) {

      const year = date.substring(0, 4);
      const month = date.substring(4, 6);
      const day = date.substring(6, 8);

      return formatDate(new Date(year, month - 1, day), 'dd/MM/yyyy', 'en-US');
      // return new Date(year, month - 1, day);
    } else {
      return '';
    }
  }
  getCustomerInfo(cif) {
    this.viewCustomer = null;
    this.customerGroupCount = 0;
    this.currentCustomerGroup = 0;

    this.customerService.getCustomerInfo2(cif).subscribe(data => {
      // if (data.customerInfo.REGISTER_DATE) {
      //   data.customerInfo.REGISTER_DATE = this.convertDate(data.customerInfo.REGISTER_DATE);
      // }
      // data.creditRating.forEach(c => {
      //   if (c.RATING_DATE) {
      //     c.RATING_DATE = this.convertDate(c.RATING_DATE);
      //   }
      // });
      this.customerInfo = data;
      this.viewCustomer = this.customerInfo.customerInfo;

      // Mock
      if (cif === '54003105') {
        this.viewCustomer.WATCHLIST_FLAG = 'Y';
        this.viewCustomer.TDR_FLAG = 'Y';
      }

      if (this.viewCustomer.PARAM_VALUE) {
        this.viewCustomer.PARAM_VALUE = this.convertDate(this.viewCustomer.PARAM_VALUE);
      }
      this.customerGroupCount = this.customerInfo.customerGroup.length;

      this.customerService.setCurrentCif(this.viewCustomer.CIF_KEY);
      this.customerService.setCurrentCustomerName(this.viewCustomer.CUSTOMER_NAME);
    }, error => this.errorService.onRequestError('Get Customer Info', error));
  }

  onslideChanged(event: number) {
    this.currentCustomerGroup = event + 1;

    if (event <= 0) {
      $('.carousel-control-prev').hide();
    } else {
      $('.carousel-control-prev').show();
    }

    if (event >= this.customerInfo.customerGroup.length - 1) {
      $('.carousel-control-next').hide();
    } else {
      $('.carousel-control-next').show();
    }
  }
}
