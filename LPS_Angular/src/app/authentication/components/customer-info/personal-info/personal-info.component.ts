import { OnInit } from '@angular/core';
import { CustomerInfoModel, CustomerGroup } from 'src/app/models/Customer/CustomerInfoModel';
import { CustomerModel } from 'src/app/models/Customer/CustomerModel';
import { CustomerService } from 'src/app/services/customer.service';
import { formatDate } from '@angular/common';
import { ErrorService } from 'src/app/services/error.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
declare const $;

// @Component({
//   selector: 'app-personal-info',
//   templateUrl: './personal-info.component.html',
//   styleUrls: ['./personal-info.component.scss']
// })
export class PersonalInfoComponent implements OnInit {

  viewCustomer: CustomerModel;
  customerInfo: CustomerInfoModel;
  customerGroupCount = 0;
  currentCustomerGroup = 0;
  customerGroup: CustomerGroup[];
  currentIndex = 0;
  currentSession: CurrentSessionModel;

  constructor(private customerService: CustomerService, private errorService: ErrorService, private authService: AuthorizationService) { }

  ngOnInit() {
    $('#customerGroupModal').on('hide.bs.modal', (e) => { this.currentIndex = 0; });
    this.currentSession = this.authService.getUserProfile;
  }
  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }
  getCustomerInfo(customer: CustomerModel) {
    this.viewCustomer = null;
    this.customerGroupCount = 0;
    this.currentCustomerGroup = 0;
    // if (this.customerInfo) {
    //   this.customerInfo.customerGroup = [];
    // }

    this.customerService.getCustomerInfo(customer.CIF_KEY.toString(), customer.DEPT, customer.SUB_DEPT,
      customer.UNIT, this.currentSession.user.username).subscribe(data => {
        if (data.customerInfo.REGISTER_DATE) {
          data.customerInfo.REGISTER_DATE = formatDate(this.convertDate(data.customerInfo.REGISTER_DATE).toString(), 'dd/MM/yyyy', 'en-US');
        }
        data.creditRating.forEach(c => {
          if (c.RATING_DATE) {
            c.RATING_DATE = formatDate(this.convertDate(c.RATING_DATE), 'dd/MM/yyyy', 'en-US');
          }
        });
        this.customerInfo = data;
        this.viewCustomer = this.customerInfo.customerInfo;
        if (this.viewCustomer.PARAM_VALUE) {
          this.viewCustomer.PARAM_VALUE = formatDate(this.convertDate(this.viewCustomer.PARAM_VALUE), 'dd/MM/yyyy', 'en-US');
        }
        this.customerGroupCount = this.customerInfo.customerGroup.length;
      }, error => this.errorService.onRequestError('Get Customer Info', error));
  }
  clear() {
    // this.customerInfo.customerGroup = [];
    // $('#customerGroupModal').modal('hide');
    // $('#customerGroupModal').modal('dispose');
    // this.customerGroup = [];
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
  onCustomerGroupClick() {
    // this.customerGroup = this.customerInfo.customerGroup;
    // if (this.currentCustomerGroup === 1) {
    //   $('.carousel-control-prev').hide();
    // }

    // $('#customerGroupModal').modal('show');
  }
}
