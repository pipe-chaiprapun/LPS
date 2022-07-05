import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { CustomerModel } from 'src/app/models/Customer/CustomerModel';
import { RoleOrgModel } from 'src/app/models/User/UserRoleModel';
import { CustomerFilterModel } from 'src/app/models/Customer/CustomerFilterModel';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorService } from 'src/app/services/error.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserAccountService } from 'src/app/services/user-account.service';
import Swal from 'sweetalert2';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CustomerGroupsModel } from 'src/app/models/Customer/CustomerGroupsModel';
import { CustomerGroupsFilterModel } from 'src/app/models/Customer/CustomerGroupsFilterModel';
import { CustomerGroup } from 'src/app/models/Customer/CustomerInfoModel';

declare const App;
declare const $;

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit, OnDestroy {

  currentSession: CurrentSessionModel;

  navigationSubscription;
  // initCif;

  readonly itemsPerPage = 20;
  readonly maxPageSize = 5;

  customer: CustomerModel;

  // Customer search
  customerGroups: CustomerGroupsModel[];
  customerGroupDetails: CustomerGroup[];
  customerGroupCount = 0;
  currentCustomerGroup = 0;
  currentCustomerGroupCif;
  customers;
  customerCount = 0;
  displayCustomers = [];
  department: RoleOrgModel[] = [];
  subDepartment: RoleOrgModel[] = [];
  unit: RoleOrgModel[] = [];
  unitLeader: RoleOrgModel[] = [];
  displayDepartment: RoleOrgModel[] = [];
  displaySubDepartment: RoleOrgModel[] = [];
  displayUnit: RoleOrgModel[] = [];
  displayUnitLeader: RoleOrgModel[] = [];
  // customerFilter: CustomerFilterModel = new CustomerFilterModel();
  customerFilter: CustomerFilterModel;
  customerGroupsFilter: CustomerGroupsFilterModel;
  currentCustomerPage = 1;

  // sorting
  cif: boolean;
  name: boolean;
  creditLimit: boolean;
  outstanding: boolean;

  inputModel = { cif: '', name: '' };

  constructor(
    private customerService: CustomerService,
    private errorService: ErrorService,
    private router: Router,
    private authService: AuthorizationService,
    private userService: UserAccountService,
    private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        console.log('subscribe');
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    console.log('naviated');
    this.displayCustomers = [];
    this.customerCount = 0;
    // $('#optGroups').val('%').change();
    // this.currentSession = this.authService.getUserProfile;
    this.route.queryParams.subscribe(async (params) => {
      this.currentSession = this.authService.getUserProfile;
      if (params.action && params.action === 'search') {
        await this.clearCustomerSearch();
        await this.searchQuery(params);
      } else {
        console.log(this.currentSession.currentRole);
        this.clearCustomerSearch();
      }
    });
    // this.back();
  }

  ngOnInit() {
    // App.initLoadPage();
    this.currentSession = this.authService.getUserProfile;
    $('#customerInfo').hide();
    $('#optGroups').select2({ width: '100%' });
    $('#optGroups').on('select2:select', (e) => {
      const selectedGroup = e.currentTarget.value;
      this.customerFilter.group_no = selectedGroup;
    });
    // this.customerFilter.cif = '54003105';
    // $('.user-info').fadeIn(1000);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  onSubmit(cif: string, name: string) {
    console.log('search');
    this.router.navigate(['/authentication/customer/list'], {
      queryParams: {
        action: 'search',
        department: this.customerFilter.department,
        sub_department: this.customerFilter.subDepartment,
        unit: this.customerFilter.unit,
        rm: this.customerFilter.staff_no,
        name,
        cif,
        group_no: this.customerFilter.group_no
      }
    });
  }

  searchQuery(params) {
    if (params.cif || params.name || params.department || params.sub_department || params.unit || params.rm || params.group_no) {
      // const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
      if (params.department) {
        const authDept = this.displayDepartment.filter(d => d.ROLE_CODE === params.department);
        if (authDept.length > 0) {
          this.customerFilter.department = params.department;
          this.departmentChanged({ target: { value: authDept[0].ROLE_DESC } });
        }
      }
      if (params.sub_department) {
        const authSubdept = this.displaySubDepartment.filter(s => s.ROLE_CODE === params.sub_department);
        if (authSubdept.length > 0) {
          this.customerFilter.subDepartment = params.sub_department;
          this.subDepartmentChanged({ target: { value: authSubdept[0].ROLE_DESC } });
        }
      }
      if (params.unit) {
        const authUnit = this.displayUnitLeader.filter(s => s.ROLE_CODE === params.unit);
        if (authUnit.length > 0) {
          this.customerFilter.unit = params.unit;
          this.UnitLeaderChanged({ target: { value: authUnit[0].ROLE_DESC } });
        }
      }
      if (params.rm) {
        const authRm = this.displayUnit.filter(rm => rm.ROLE_CODE === params.rm);
        if (authRm.length > 0) {
          this.customerFilter.staff_no = params.rm;
          this.customerFilter.unit = params.unit ? params.unit : this.displayUnit[0].ROLE_PARENT;
        }
      }
      if (params.group_no) {
        const authGroup = this.customerGroups.filter(g => g.CUSTOMER_GROUP_NO === params.group_no);
        if (authGroup.length > 0) {
          this.customerFilter.group_no = params.group_no;
        }
      }

      this.search(params.cif, params.name);
    } else {
      this.search('', '');
    }
  }

  search(cif: string, name: string) {
    this.customerFilter.startPage = 1;
    this.customerFilter.cif = cif;
    this.customerFilter.name = name;
    this.getCustomer();
    // Swal.fire({
    //   titleText: 'Fetching customers',
    //   icon: 'info',
    //   timerProgressBar: true,
    //   allowOutsideClick: false,
    //   onOpen: () => {
    //     Swal.showLoading();
    //     this.customerService.getCustomer({
    //       startPage: 1, limitPage: this.itemsPerPage, cif, name, department: this.customerFilter.department,
    //       subDepartment: this.customerFilter.subDepartment, unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no
    //     }).subscribe(data => {
    //       this.customerCount = data.totalItems;
    //       this.displayCustomers = data.customers;
    //       if (data.customers.length > 0) {
    //         Swal.close();
    //         if (init) {
    //           // this.viewCustomerInfo(data.customers[0]);
    //         }
    //       } else {
    //         Swal.fire({
    //           title: 'Fetching customers',
    //           text: 'Not found customer!',
    //           icon: 'error',
    //           // showConfirmButton: true,
    //           showCloseButton: true,
    //           showConfirmButton: false,
    //           timer: 3000
    //         });
    //       }
    //     }, error => this.errorService.onRequestError('Get customers', error));
    //   },
    //   onAfterClose: () => {
    //   }
    // });
  }

  getCustomer() {
    Swal.fire({
      titleText: 'Fetching customers',
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.customerService.getCustomer({
          startPage: 1, limitPage: this.itemsPerPage, cif: this.customerFilter.cif, name: this.customerFilter.name, department: this.customerFilter.department,
          subDepartment: this.customerFilter.subDepartment, unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no, group_no: this.customerFilter.group_no
        }).subscribe(data => {
          this.customerCount = data.totalItems;
          this.displayCustomers = data.customers;
          Swal.close();
          if (data.customers.length === 0) {
            Swal.fire({
              title: 'Fetching customers',
              text: 'Not found customer!',
              icon: 'error',
              // showConfirmButton: true,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 3000
            });
          }
        }, error => this.errorService.onRequestError('Get customers', error));
      },
      onAfterClose: () => {
      }
    });
    // this.customerService.getCustomer({
    //   startPage: 1, limitPage: this.itemsPerPage, cif: this.customerFilter.cif, name: this.customerFilter.name, department: this.customerFilter.department,
    //   subDepartment: this.customerFilter.subDepartment, unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no, group_no: this.customerFilter.group_no
    // }).subscribe(data => {
    //   this.customerCount = data.totalItems;
    //   this.displayCustomers = data.customers;
    //   if (data.customers.length === 0) {
    //     Swal.fire({
    //       title: 'Fetching customers',
    //       text: 'Not found customer!',
    //       icon: 'error',
    //       // showConfirmButton: true,
    //       showCloseButton: true,
    //       showConfirmButton: false,
    //       timer: 3000
    //     });
    //   }
    // }, error => this.errorService.onRequestError('Get customers', error));

  }

  async clearCustomerSearch() {
    $('#txtCif').val('');
    $('#txtCustomerName').val('');
    this.displayDepartment = [];
    this.displaySubDepartment = [];
    this.displayUnit = [];
    this.displayUnitLeader = [];
    this.currentCustomerPage = 1;
    this.customerFilter = new CustomerFilterModel();
    this.customerGroupsFilter = new CustomerGroupsFilterModel();

    this.cif = false;
    this.name = false;
    this.creditLimit = false;
    this.outstanding = false;

    await this.initFilter();
    await this.listCustomerGroups(this.customerGroupsFilter);
    // this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
    //   this.department = data.department;
    //   this.subDepartment = data.subDepartment;
    //   this.unit = data.unit;
    //   this.unitLeader = data.unitLeader;

    //   const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
    //   const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;

    //   if (currentRoleLevel === 1 || isGroupLevel) {
    //     this.displayDepartment = this.department;
    //     this.customerFilter.department = this.currentSession.currentRole.ROLE_CODE;
    //     this.customerFilter.subDepartment = '';
    //     this.customerFilter.unit = '';

    //     if (this.department.length > 1) {
    //       this.displayDepartment.unshift({ ROLE_CODE: this.currentSession.currentRole.ROLE_CODE, ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //     if (this.subDepartment.length > 0) {
    //       this.displaySubDepartment = this.subDepartment.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
    //       this.displaySubDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //     if (this.unitLeader.length > 0) {
    //       this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //     if (this.unit.length > 0) {
    //       this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //   } else if (currentRoleLevel === 2) {

    //     this.displayDepartment = this.department;
    //     this.displaySubDepartment = this.subDepartment;
    //     this.customerFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;
    //     this.customerFilter.unit = '';

    //     if (this.unitLeader.length > 0) {
    //       this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
    //       this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //     if (this.unit.length > 0) {
    //       this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //   } else if (currentRoleLevel === 3) {

    //     this.displayDepartment = this.department;
    //     this.displaySubDepartment = this.subDepartment;
    //     this.displayUnitLeader = this.unitLeader;

    //     this.customerFilter.unit = this.currentSession.currentRole.ROLE_CODE;

    //     if (this.unit.length > 0) {
    //       this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
    //       this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    //     }
    //   } else {
    //     this.displayDepartment = this.department;
    //     this.displaySubDepartment = this.subDepartment;
    //     this.displayUnitLeader = this.unitLeader;
    //     if (this.unit.length > 0) {
    //       this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.unitLeader[0].ROLE_CODE);
    //       this.customerFilter.unit = this.displayUnit[0].ROLE_PARENT;
    //       this.customerFilter.staff_no = this.displayUnitLeader[0].ROLE_CODE;
    //     } else {
    //       this.customerFilter.unit = this.unitLeader[0].ROLE_CODE;
    //       this.customerFilter.staff_no = this.currentSession.user.username;
    //     }
    //   }
    // }, error => this.errorService.onRequestError('Get Filter Options', error));
  }

  async initFilter() {
    const rolesOrg = await this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).toPromise();

    this.department = rolesOrg.department;
    this.subDepartment = rolesOrg.subDepartment;
    this.unit = rolesOrg.unit;
    this.unitLeader = rolesOrg.unitLeader;

    const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
    const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;

    if (currentRoleLevel === 1 || isGroupLevel) {
      this.displayDepartment = this.department;
      this.customerFilter.department = this.currentSession.currentRole.ROLE_CODE;
      this.customerFilter.subDepartment = '';
      this.customerFilter.unit = '';
      this.customerGroupsFilter.department = this.currentSession.currentRole.ROLE_CODE;

      if (this.department.length > 1) {
        this.displayDepartment.unshift({ ROLE_CODE: this.currentSession.currentRole.ROLE_CODE, ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
      if (this.subDepartment.length > 0) {
        this.displaySubDepartment = this.subDepartment.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
        this.displaySubDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
      if (this.unitLeader.length > 0) {
        this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
      if (this.unit.length > 0) {
        this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    } else if (currentRoleLevel === 2) {
      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.customerFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;
      this.customerFilter.unit = '';
      this.customerGroupsFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;

      if (this.unitLeader.length > 0) {
        this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
        this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
      if (this.unit.length > 0) {
        this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    } else if (currentRoleLevel === 3) {

      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.displayUnitLeader = this.unitLeader;

      this.customerFilter.unit = this.currentSession.currentRole.ROLE_CODE;
      this.customerGroupsFilter.unit = this.currentSession.currentRole.ROLE_CODE;

      if (this.unit.length > 0) {
        this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
        this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    } else {
      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.displayUnitLeader = this.unitLeader;
      if (this.unit.length > 0) {
        this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.unitLeader[0].ROLE_CODE);
        this.customerFilter.unit = this.displayUnit[0].ROLE_PARENT;
        this.customerFilter.staff_no = this.displayUnitLeader[0].ROLE_CODE;

        this.customerGroupsFilter.unit = this.displayUnit[0].ROLE_PARENT;
        this.customerGroupsFilter.staffNo = this.displayUnitLeader[0].ROLE_CODE;
      } else {
        this.customerFilter.unit = this.unitLeader[0].ROLE_CODE;
        this.customerFilter.staff_no = this.currentSession.user.username;

        this.customerGroupsFilter.unit = this.unitLeader[0].ROLE_CODE;
        this.customerGroupsFilter.staffNo = this.currentSession.user.username;
      }
    }
  }

  async listCustomerGroups(filter) {
    this.customerGroups = await this.customerService.getCustomerGroups(filter).toPromise();
  }

  viewCustomerGroup(cif) {
    this.currentCustomerGroupCif = cif;
    this.customerGroupCount = 0;
    this.currentCustomerGroup = 0;
    Swal.fire({
      titleText: `Fetching customer's groups`,
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.customerService.getCustomerGroupDetail(cif).subscribe(data => {
          Swal.close();
          if (data.length === 0) {
            Swal.fire({
              title: `Fetching customer's groups`,
              text: 'Not found group',
              icon: 'error',
              // showConfirmButton: true,
              showCloseButton: true,
              showConfirmButton: false,
              timer: 3000
            });
          } else {
            this.customerGroupCount = data.length;
            this.customerGroupDetails = data;
            console.log(this.customerGroupDetails[0]);
            $('#customerGroupModal').modal('show');
          }
        }, error => this.errorService.onRequestError('Get customers group', error));
      },
      onAfterClose: () => {
      }
    });
  }

  onslideChanged(event: number) {
    this.currentCustomerGroup = event + 1;

    if (event <= 0) {
      $('.carousel-control-prev').hide();
    } else {
      $('.carousel-control-prev').show();
    }

    if (event >= this.customerGroupDetails.length - 1) {
      $('.carousel-control-next').hide();
    } else {
      $('.carousel-control-next').show();
    }
  }

  departmentChanged(value) {
    const selected = this.displayDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.customerFilter.department = selected.ROLE_CODE;
    if (value.target.value === 'ALL') {
      this.displaySubDepartment = [];
      this.displayUnitLeader = [];
      this.displayUnit = [];
      this.displaySubDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.displaySubDepartment = this.subDepartment.filter(s => s.ROLE_PARENT === selected.ROLE_CODE);
      this.displaySubDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
    this.customerFilter.subDepartment = '';
    this.customerFilter.unit = '';
    this.customerFilter.staff_no = '';
  }
  subDepartmentChanged(value) {
    const selected = this.displaySubDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];

    this.customerFilter.subDepartment = selected.ROLE_CODE;

    if (value.target.value === 'ALL') {
      this.displayUnitLeader = [];
      this.displayUnit = [];
      this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === selected.ROLE_CODE);
      this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });

      this.displayUnit = [];
      this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
    this.customerFilter.unit = '';
    this.customerFilter.staff_no = '';
  }
  UnitLeaderChanged(value) {
    const selected = this.displayUnitLeader.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.customerFilter.unit = selected.ROLE_CODE;
    if (value.target.value === 'ALL') {
      this.customerFilter.unit = '';
      this.customerFilter.staff_no = '';
      this.displayUnit = [];
      this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {

      this.customerFilter.staff_no = '';
      this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === selected.ROLE_CODE);
      this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
  }
  unitChanged(value) {
    const selected = this.displayUnit.filter(s => s.ROLE_DESC === value.target.value)[0];
    // this.customerFilter.unit = selected.ROLE_CODE;
    console.log(selected);
    if (value.target.value === 'ALL') {
      // this.customerFilter.unit = selected.ROLE_PARENT;
      this.customerFilter.staff_no = '';
    } else {
      this.customerFilter.unit = selected.ROLE_PARENT;
      this.customerFilter.staff_no = selected.ROLE_CODE;
    }
  }

  pageCustomerChanged(event: PageChangedEvent): void {
    this.customerFilter.startPage = event.page;

    Swal.fire({
      titleText: 'Fetching customers',
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.customerService.getCustomer({
          startPage: event.page, limitPage: this.itemsPerPage,
          sortBy: this.customerFilter.sortBy, ascending: this.customerFilter.ascending,
          cif: this.customerFilter.cif, name: this.customerFilter.name,
          department: this.customerFilter.department, subDepartment: this.customerFilter.subDepartment,
          unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no
        }).subscribe(data => {
          this.customerCount = data.totalItems;
          this.displayCustomers = data.customers;
          this.currentCustomerPage = event.page;
          Swal.close();
        }, error => this.errorService.onRequestError('Get customers', error));
      },
      onAfterClose: () => {
      }
    });
  }

  // customer sorting
  sort(column: string) {
    this.customerFilter.sortBy = column;
    this[column] = !this[column];
    this.customerFilter.ascending = this[column];

    Swal.fire({
      titleText: `Sorting customer`,
      icon: 'info',
      timerProgressBar: true,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
        this.customerService.getCustomer({
          startPage: this.customerFilter.startPage, limitPage: this.itemsPerPage,
          sortBy: column, ascending: this[column], cif: this.customerFilter.cif, name: this.customerFilter.name,
          department: this.customerFilter.department, subDepartment: this.customerFilter.subDepartment,
          unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no
        }).
          subscribe(data => {
            this.customerCount = data.totalItems;
            this.displayCustomers = data.customers;
            Swal.close();
          }, error => this.errorService.onRequestError('Sort customers', error));
      },
      onAfterClose: () => {
      }
    });
  }
}
