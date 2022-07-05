import { OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CustomerModel } from 'src/app/models/Customer/CustomerModel';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { CustomerService } from 'src/app/services/customer.service';
import { ErrorService } from 'src/app/services/error.service';
import { CustomerFilterModel } from 'src/app/models/Customer/CustomerFilterModel';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AccountServiceComponent } from './account-service/account-service.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import Swal from 'sweetalert2';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { UserAccountService } from 'src/app/services/user-account.service';
import { RoleOrgModel } from 'src/app/models/User/UserRoleModel';
// import * as XLSX from 'xlsx';
import { formatDate } from '@angular/common';
// import { ReportService } from '../../../constant/report-service';
import { environment } from '../../../../environments/environment';


declare const App;
declare const $;

// @Component({
//   selector: 'app-customer-info',
//   templateUrl: './customer-info.component.html',
//   styleUrls: ['./customer-info.component.scss']
// })
export class CustomerInfoComponent implements OnInit, OnDestroy {
    @ViewChild(AccountServiceComponent, { static: false }) accServiceComp: AccountServiceComponent;
    @ViewChild(PersonalInfoComponent, { static: false }) personalComp: PersonalInfoComponent;
    @ViewChild(PortfolioComponent, { static: false }) portfolioComp: PortfolioComponent;
    reportService = environment.reportServer;
    currentSession: CurrentSessionModel;

    navigationSubscription;
    // initCif;

    readonly itemsPerPage = 20;
    readonly maxPageSize = 5;

    customer: CustomerModel;

    // Customer search
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
    customerFilter: CustomerFilterModel = new CustomerFilterModel();
    currentCustomerPage = 1;

    // sorting
    cif: boolean;
    name: boolean;
    creditLimit: boolean;
    outstanding: boolean;

    constructor(
        private customerService: CustomerService,
        private errorService: ErrorService,
        private router: Router,
        private authService: AuthorizationService,
        private userService: UserAccountService,
        private route: ActivatedRoute) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.initialiseInvites();
            }
        });
    }
    initialiseInvites() {
        this.displayCustomers = [];
        this.customerCount = 0;
        this.currentSession = this.authService.getUserProfile;
        this.clearCustomerSearch();
        this.back();
    }
    ngOnInit() {
        App.initLoadPage();
        this.currentSession = this.authService.getUserProfile;
        $('#customerInfo').hide();
        $('.user-info').fadeIn(1000);

        // this.route.params.subscribe((params) => {
        //   this.initCif = params['cif'];
        //   if (this.initCif !== '0') {
        //     this.search(this.initCif, '', true);
        //   }
        // });
    }
    ngOnDestroy() {
        if (this.navigationSubscription) {
            this.navigationSubscription.unsubscribe();
        }
    }

    // on page customer changed
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

    search(cif: string, name: string, init: boolean) {
        this.customerFilter.startPage = 1;
        this.customerFilter.cif = cif;
        this.customerFilter.name = name;

        Swal.fire({
            titleText: 'Fetching customers',
            icon: 'info',
            timerProgressBar: true,
            allowOutsideClick: false,
            onOpen: () => {
                Swal.showLoading();
                this.customerService.getCustomer({
                    startPage: 1, limitPage: this.itemsPerPage, cif, name, department: this.customerFilter.department,
                    subDepartment: this.customerFilter.subDepartment, unit: this.customerFilter.unit, staff_no: this.customerFilter.staff_no
                }).subscribe(data => {
                    this.customerCount = data.totalItems;
                    this.displayCustomers = data.customers;
                    if (data.customers.length > 0) {
                        Swal.close();
                        if (init) {
                            this.viewCustomerInfo(data.customers[0]);
                        }
                    } else {
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

    }

    // customer sorting
    sort(column: string) {
        this.customerFilter.sortBy = column;
        this[column] = !this[column];
        this.customerFilter.ascending = this[column];

        Swal.fire({
            titleText: 'Fetching customers',
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

    // on customer selected
    viewCustomerInfo(customer: CustomerModel) {
        this.customer = customer;
        this.personalComp.getCustomerInfo(customer);
        this.accServiceComp.getAccountService(customer.CIF_KEY);
        this.portfolioComp.getPortfolio(customer.CIF_KEY);

        $('#myTab li:first-child a').tab('show');
        // $('#customers').hide();
        $('#customer-table').hide();
        $('#customerInfo').show();
        $('#btn-back').show();
    }

    clearCustomerSearch() {
        $('#txtCif').val('');
        $('#txtCustomerName').val('');
        this.displayDepartment = [];
        this.displaySubDepartment = [];
        this.displayUnit = [];
        this.displayUnitLeader = [];
        this.currentCustomerPage = 1;
        this.customerFilter = new CustomerFilterModel();

        this.cif = false;
        this.name = false;
        this.creditLimit = false;
        this.outstanding = false;

        this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
            this.department = data.department;
            this.subDepartment = data.subDepartment;
            this.unit = data.unit;
            this.unitLeader = data.unitLeader;

            const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
            const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;

            // this.customerFilter.department = this.department[0].ROLE_CODE;
            // this.customerFilter.subDepartment = this.subDepartment[0].ROLE_CODE;

            // this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.subDepartment[0].ROLE_CODE);

            // case user is level 1
            // if (this.department.length > 0 &&
            //   this.department.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
            if (currentRoleLevel === 1 || isGroupLevel) {
                this.displayDepartment = this.department;
                this.customerFilter.department = this.currentSession.currentRole.ROLE_CODE;
                this.customerFilter.subDepartment = '';
                this.customerFilter.unit = '';

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
                // else if (this.subDepartment.length > 0 && // case user is level 2
                //   this.subDepartment.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {

                this.displayDepartment = this.department;
                this.displaySubDepartment = this.subDepartment;
                this.customerFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;
                this.customerFilter.unit = '';

                if (this.unitLeader.length > 0) {
                    this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
                    this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
                }
                if (this.unit.length > 0) {
                    this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
                }
            } else if (currentRoleLevel === 3) {
                // else if (this.unitLeader.length > 0 && // case user is level 3 (unit leader)
                //   this.unitLeader.filter(l => l.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {

                this.displayDepartment = this.department;
                this.displaySubDepartment = this.subDepartment;
                this.displayUnitLeader = this.unitLeader;

                this.customerFilter.unit = this.currentSession.currentRole.ROLE_CODE;

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
                } else {
                    this.customerFilter.unit = this.unitLeader[0].ROLE_CODE;
                    this.customerFilter.staff_no = this.currentSession.user.username;
                }
            }
        }, error => this.errorService.onRequestError('Get Filter Options', error));
    }
    clearForm() {
        this.displayCustomers = [];
        this.customerCount = 0;
        this.currentSession = this.authService.getUserProfile;
        this.clearCustomerSearch();
    }
    back() {
        // this.customerInfo = null;
        this.customer = null;
        $('#selLoanGroup').val('ALL');
        $('#selDepositGroup').val('ALL');
        // $('#customers').show();
        $('#customer-table').show();
        $('#customerInfo').hide();
        $('#collapseOne').collapse('hide');
        $('#collapseTwo').collapse('hide');
        $('#collapseThree').collapse('hide');
        $('#collapseFour').collapse('hide');
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

        if (value.target.value === 'ALL') {
            // this.customerFilter.unit = selected.ROLE_PARENT;
            this.customerFilter.staff_no = '';
        } else {
            this.customerFilter.unit = selected.ROLE_PARENT;
            this.customerFilter.staff_no = selected.ROLE_CODE;
        }
    }

    goToLink() {
        const cif = this.customerFilter.cif === '' ? '%' : this.customerFilter.cif === undefined ? '%' : this.customerFilter.cif;
        const name = this.customerFilter.name === '' ? '%' : this.customerFilter.name === undefined ? '%' : this.customerFilter.name;
        const department = this.customerFilter.department === '' ? '%' :
            this.customerFilter.department === undefined ? '%' : this.customerFilter.department;
        const subDepartment = this.customerFilter.subDepartment === '' ? '%' :
            this.customerFilter.subDepartment === undefined ? '%' : this.customerFilter.subDepartment;
        const unit = this.customerFilter.unit === '' ? '%' : this.customerFilter.unit === undefined ? '%' : this.customerFilter.unit;
        const staff_no = this.customerFilter.staff_no === '' ? '%' :
            this.customerFilter.staff_no === undefined ? '%' : this.customerFilter.staff_no;
        const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.listCustomer}&rs:Command=Render&CIF_KEY=${cif}&CUSTOMER_NAME=${name}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
    ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
        // window.open(url, '_blank', 'width=760, height=500');
        window.open(url, '_blank');
    }

    customerInfoReport() {
        const cif = this.customerFilter.cif === '' ? '%' : this.customerFilter.cif === undefined ? '%' : this.customerFilter.cif;
        const name = this.customerFilter.name === '' ? '%' : this.customerFilter.name === undefined ? '%' : this.customerFilter.name;
        const department = this.customerFilter.department === '' ? '%' :
            this.customerFilter.department === undefined ? '%' : this.customerFilter.department;
        const subDepartment = this.customerFilter.subDepartment === '' ? '%' :
            this.customerFilter.subDepartment === undefined ? '%' : this.customerFilter.subDepartment;
        const unit = this.customerFilter.unit === '' ? '%' : this.customerFilter.unit === undefined ? '%' : this.customerFilter.unit;
        const staff_no = this.customerFilter.staff_no === '' ? '%' :
            this.customerFilter.staff_no === undefined ? '%' : this.customerFilter.staff_no;
        const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.customerInfo}&rs:Command=Render&CIF_KEY=${cif}&CUSTOMER_NAME=${name}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
    ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
        // const url = `${this.reportService.Host}:${this.reportService.Port}/${this.reportService.Directory.CustomerInfo}&rs:Command=Render&CIF_KEY=${cif}&CUSTOMER_NAME=${name}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&rc:Zoom=page%20width`;
        window.open(url, '_blank');
    }
}
