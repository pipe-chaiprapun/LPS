import { OnInit } from '@angular/core';
import { UserAccountModel } from 'src/app/models/UserAccountModel';
import { UserAccountService } from 'src/app/services/user-account.service';
import { ErrorService } from 'src/app/services/error.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { RoleOrgModel } from 'src/app/models/User/UserRoleModel';
import { RmFilterModel, RmModel } from 'src/app/models/User/RmModel';
import Swal from 'sweetalert2';
declare const $;

// @Component({
//   providers: [UserInfoComponent],
//   selector: 'app-user-search',
//   templateUrl: './user-search.component.html',
//   styleUrls: ['./user-search.component.scss']
// })
export class UserSearchComponent implements OnInit {
  constructor(private userService: UserAccountService, private errorService: ErrorService) { }

  // @Input() units: EmpUnitModel[];

  readonly itemsPerPage = 20;
  readonly maxPageSize = 5;

  currentInputElement: HTMLInputElement;

  // Users Search
  rmCount = 0;
  currentUser: UserAccountModel;
  currentRm: RmModel;
  rmFilter: RmFilterModel = new RmFilterModel();
  displayUsers = [];
  currentUserPage = 1;
  txtSearchScope = '';

  department: RoleOrgModel[] = [] = [];
  subDepartment: RoleOrgModel[] = [] = [];
  unitLeader: RoleOrgModel[] = [] = [];
  unit: RoleOrgModel[] = [] = [];

  mainUnitIcon = 'fa-plus-circle';

  ngOnInit() {
    // App.initLoadPage();
    // this.getUnits();
    this.rmFilter.startPage = 1;
    this.rmFilter.limitPage = this.itemsPerPage;
    this.userService.getRoleFilter(1, '').subscribe(data => {
      this.department = data;
      if (this.department.length > 0) {
        this.department.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.subDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    });
    // $('.treeview-animated-items *').click((e) => {
    //   e.stopPropagation();
    // });
    // $('.closed *').click((e) => {
    //   e.stopPropagation();
    // });
  }

  // initUnitJquery(element: HTMLInputElement) {
  //   console.log('init jquery');
  //   this.currentInputElement = element;

  //   $('.treeview-animated').mdbTreeview();
  //   $('.treeview-animated-items .add-btn').click((e) => {
  //     e.stopPropagation();
  //   });
  // }

  // choose main unit
  // chooseUnit(id, name) {
  //   console.log(id);
  //   console.log(name);
  //   this.collapse();
  //   this.currentInputElement.value = `${id} ${name}`;
  //   $('#search-user-main-unit-modal').modal('hide');
  // }

  // on user search button pressed
  search(staff_no: string, staff_name: string) {
    this.rmFilter.startPage = 1;
    this.rmFilter.staff_no = staff_no;
    this.rmFilter.staff_name = staff_name;

    Swal.fire({
      titleText: 'Fetching user',
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.userService.getRm(this.rmFilter).subscribe(data => {
          if (data.rms.length > 0) {
            this.rmCount = data.totalItems;
            this.displayUsers = data.rms;
            // this.displayUsers = data.rms.filter((thing, index, self) =>
            //   index === self.findIndex((t) => (
            //     t.STAFF_NO === thing.STAFF_NO
            //   ))
            // );
            Swal.close();
          } else {
            this.rmCount = 0;
            this.displayUsers = [];
            Swal.fire({
              title: 'Fetching user',
              text: 'Not found user!',
              icon: 'error',
              // showConfirmButton: true,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 3000
            });
          }
        }, error => this.errorService.onRequestError('Get Users', error));
      }
    });
  }

  clearForm() {
    this.rmFilter = new RmFilterModel();
    this.rmFilter.startPage = 1;
    this.rmFilter.limitPage = this.itemsPerPage;
    this.clearUserSearch();


    // this.currentSession = this.authService.getUserProfile;
    // this.clearCustomerSearch();
  }
  clearUserSearch() {
    this.displayUsers = [];
    this.rmCount = 0;

    $('#txtEmployee').val('');
    $('#txtRmName').val('');
    $('#select-role').val('A');
    $('#select-status').val('%');
    this.department = [];
    this.subDepartment = [];
    this.unitLeader = [];
    this.currentUserPage = 1;

    this.userService.getRoleFilter(1, '').subscribe(data => {
      this.department = data;
      if (this.department.length > 0) {
        this.department.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.subDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    });
  }

  departmentChanged(value) {
    const selected = this.department.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.rmFilter.department = selected.ROLE_CODE;
    this.rmFilter.subDepartment = '';
    this.rmFilter.unit = '';

    if (value.target.value === 'ALL') {
      this.subDepartment = [];
      this.subDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      this.unitLeader = [];
      this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.subDepartment = [];
      this.subDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      this.unitLeader = [];
      this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      this.userService.getRoleFilter(2, selected.ROLE_CODE).subscribe(data => {
        this.subDepartment = data;
        if (this.subDepartment.length > 0) {
          this.subDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        } else {
          this.unitLeader = [];
        }
      });
    }
  }
  subDepartmentChanged(value) {
    const selected = this.subDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.rmFilter.subDepartment = selected.ROLE_CODE;
    this.rmFilter.unit = '';

    if (value.target.value === 'ALL') {
      this.unitLeader = [];
      this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.userService.getRoleFilter(3, selected.ROLE_CODE).subscribe(data => {
        this.unitLeader = data;
        if (this.unitLeader.length > 0) {
          this.unitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        }
      });
    }
  }
  unitLeaderChanged(value) {
    const selected = this.unitLeader.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.rmFilter.unit = selected.ROLE_CODE;
  }

  pageRmChanged(event: PageChangedEvent) {
    this.rmFilter.startPage = event.page;

    this.userService.getRm(this.rmFilter).subscribe(data => {
      this.rmCount = data.totalItems;
      this.displayUsers = data.rms;
      this.currentUserPage = event.page;
    }, error => this.errorService.onRequestError('Get Users', error));
  }

  sort(column: string) {
    this.rmFilter.sortBy = column;
    this[column] = !this[column];
    this.rmFilter.ascending = this[column];

    this.userService.getRm(this.rmFilter).subscribe(data => {
      this.rmCount = data.totalItems;
      this.displayUsers = data.rms;
    }, error => this.errorService.onRequestError('Get Users', error));
  }

  roleCheck(event) {
    this.rmFilter.flag_role = event.target.value;
  }
  activeCheck(event) {
    this.rmFilter.flag_status = event.target.value;
  }

  viewRm(employeeId) {
    this.rmFilter.staff_no = employeeId.STAFF_NO;
    this.userService.clearCurrentRm();
    this.userService.saveCurrentRm(employeeId);
    $('#user-tab a[href="#userSettingPane"]').tab('show');
  }

  // expand() {
  //   if (!$('.nested').hasClass('active')) {
  //     $('.nested').addClass('active').slideDown();
  //   }
  //   if (!$('.closed').hasClass('open')) {
  //     $('.closed').addClass('open');
  //   }
  //   if (!$('.fa-angle-right').hasClass('down')) {
  //     $('.fa-angle-right').addClass('down');
  //   }
  // }
  // collapse() {
  //   if ($('.nested').hasClass('active')) {
  //     $('.nested').removeClass('active').slideUp();
  //   }
  //   if ($('.closed').hasClass('open')) {
  //     $('.closed').removeClass('open');
  //   }
  //   if ($('.fa-angle-right').hasClass('down')) {
  //     $('.fa-angle-right').removeClass('down');
  //   }
  //   if ($('.treeview-animated-element').hasClass('opened')) {
  //     $('.treeview-animated-element').removeClass('opened');
  //   }
  // }
}
