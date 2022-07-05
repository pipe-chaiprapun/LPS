import { OnInit } from '@angular/core';
declare const App;

// @Component({
//   selector: 'app-user-setting',
//   templateUrl: './user-setting.component.html',
//   styleUrls: ['./user-setting.component.scss']
// })
export class UserSettingComponent implements OnInit {
  constructor() { }

  // readonly itemsPerPage = 20;
  // readonly maxPageSize = 5;

  // currentInputElement: HTMLInputElement;

  // Users Search
  // userCount = 0;
  // currentUser: UserAccountModel;
  // userFilter: UserFilterModel = new UserFilterModel();
  // displayUsers = [];
  // currentUserPage = 1;
  // txtSearchScope = '';

  // units: EmpUnitModel[];
  // mainUnitIcon = 'fa-plus-circle';

  ngOnInit() {
    App.initLoadPage();
    // this.getUnits();
    // $('.treeview-animated-items *').click((e) => {
    //   e.stopPropagation();
    // });
    // $('.closed *').click((e) => {
    //   e.stopPropagation();
    // });
  }

  // on user search button pressed
  // search(userName, userId, accStatus) {
  //   console.log(accStatus);
  //   this.userFilter.startPage = 1;
  //   this.userService.getUsers({
  //     startPage: 1, limitPage: this.itemsPerPage, employeeId: userId,
  //     employeeName: userName, accountStatus: accStatus
  //   }).subscribe(data => {
  //     this.userCount = data.totalItems;
  //     if (data.users) {
  //       data.users.forEach(u => {
  //         u.requestDate = formatDate(u.requestDate, 'dd/MM/yyyy', 'en-US');
  //         u.approvalDate = formatDate(u.approvalDate, 'dd/MM/yyyy', 'en-US');
  //       });
  //     }
  //     this.displayUsers = data.users;
  //     console.log(this.displayUsers);
  //   }, error => this.errorService.onRequestError('Get Users', error));
  //   this.currentUserPage = 1;
  // }
  // pageUserChanged(event: PageChangedEvent) {
  //   this.userFilter.startPage = event.page;
  //   this.userService.getUsers({
  //     startPage: event.page, limitPage: this.itemsPerPage,
  //     sortBy: this.userFilter.sortBy, ascending: this.userFilter.ascending,
  //     employeeId: this.userFilter.employeeId, employeeName: this.userFilter.employeeName,
  //     utniId: this.userFilter.unitId, roleId: this.userFilter.roleId,
  //     accountStatus: this.userFilter.accountStatus
  //   }).subscribe(data => {
  //     this.userCount = data.totalItems;
  //     this.displayUsers = data.users;
  //   }, error => this.errorService.onRequestError('Get Users', error));
  // }

  // get all units

  // getUnits() {
  //   this.userService.getUnits().subscribe(data => {
  //     this.units = data;
  //   });
  // }

  // choose main unit
  // chooseUnit(id, name) {
  //   console.log(id);
  //   console.log(name);
  //   this.collapse();
  //   this.currentInputElement.value = `${id} ${name}`;
  //   $('#mainUnitModal').modal('hide');
  // }

  // getUser(employeeId) {
  //   this.userService.getUser(employeeId).subscribe(data => {
  //     this.currentUser = data;
  //     this.currentUser.requestDate = formatDate(data.requestDate, 'dd/MM/yyyy', 'en-US');
  //     this.currentUser.approvalDate = formatDate(data.approvalDate, 'dd/MM/yyyy', 'en-US');
  //     console.log(this.currentUser);
  //   }, error => this.errorService.onRequestError('Get Users', error));
  //   $('#user-tab a[href="#userSettingPane"]').tab('show');
  // }

  // initUnitJquery(element: HTMLInputElement) {
  //   console.log('init jquery');
  //   this.currentInputElement = element;

  //   $('.treeview-animated').mdbTreeview();
  //   $('.treeview-animated-items .add-btn').click((e) => {
  //     e.stopPropagation();
  //   });
  // }

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
