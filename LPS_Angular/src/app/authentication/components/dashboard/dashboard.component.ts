import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { KpiComponentComponent } from './kpi-component/kpi-component.component';
// import { ToDoComponent } from './to-do/to-do.component';
import { TodoModel, TodoDetailModel } from 'src/app/models/Dashboard/TodoModel';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ErrorService } from 'src/app/services/error.service';
import { SummaryPortComponent } from './summary-port/summary-port.component';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { UserAccountService } from 'src/app/services/user-account.service';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { RoleOrgModel, GetRoleOrgModel } from 'src/app/models/User/UserRoleModel';
import { Router, NavigationEnd } from '@angular/router';
import { AppUrl } from 'src/app/app.url';
import { AuthUrl } from '../../authentication.url';
// import { ReportService } from '../../../constant/report-service';
import { environment } from '../../../../environments/environment';
import { RmFilterModel } from 'src/app/models/User/RmModel';

declare const App;
declare const $;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  navigationSubscription;
  AppUrl = AppUrl;
  AuthUrl = AuthUrl;
  reportService = environment.reportServer;
  currentSession: CurrentSessionModel;
  department: RoleOrgModel[] = [];
  subDepartment: RoleOrgModel[] = [];
  unitLeader: RoleOrgModel[] = [];
  unit: RoleOrgModel[] = [];
  displayDepartment: RoleOrgModel[] = [];
  displaySubDepartment: RoleOrgModel[] = [];
  displayUnit: RoleOrgModel[] = [];
  displayUnitLeader: RoleOrgModel[] = [];
  viewRoleCode: string;
  rmFilter: RmFilterModel;

  chartToggle = true;
  kpiExpand: boolean;
  todoExpand: boolean;
  summaryExpand: boolean;
  odExpand: boolean;
  filtered: boolean;

  // todo
  todo: TodoModel[];
  todoDetail: TodoDetailModel[];
  yellow = 0;
  red = 0;
  modalHeader: string;

  @ViewChild(KpiComponentComponent, { static: false }) kpiComp: KpiComponentComponent;
  @ViewChild(SummaryPortComponent, { static: false }) summaryComp: SummaryPortComponent;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorService,
    private authService: AuthorizationService,
    private userService: UserAccountService,
    private router: Router) {
    this.navigationSubscription = this.router.events.subscribe(e => this.navigationSub(e));
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   if (e instanceof NavigationEnd) {
    //     console.log('navigation subscribe');
    //     // $('body').css({ 'padding-right': '0px' });
    //     this.currentSession = this.authService.getUserProfile;
    //     this.viewRoleCode = this.currentSession.currentRole.ROLE_CODE;
    //     if (this.kpiComp) {
    //       console.log('kpi available');
    //       this.kpiComp.getKpi(this.currentSession.currentRole.ROLE_CODE);
    //     }
    //     if (this.summaryComp) {
    //       console.log('summary available');
    //       this.summaryComp.getSummary();
    //     }
    //     this.clearFilter();
    //     this.getTodo();
    //   }
    // });
  }

  ngOnInit() {
    this.currentSession = this.authService.getUserProfile;
    this.initAllScript();
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  async navigationSub(e) {
    if (e instanceof NavigationEnd) {
      console.log('navigation subscribe');

      this.currentSession = this.authService.getUserProfile;
      this.viewRoleCode = this.currentSession.currentRole.ROLE_CODE;
      const getRoleOrgResult = await this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).toPromise();
      this.clearFilter();
      const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
      const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;
      this.department = getRoleOrgResult.department;
      this.subDepartment = getRoleOrgResult.subDepartment;
      this.unitLeader = getRoleOrgResult.unitLeader;
      this.unit = getRoleOrgResult.unit;
      // this.getTodo(this.setFilter(currentRoleLevel, isGroupLevel), isGroupLevel);
      this.setFilter(currentRoleLevel, isGroupLevel);
      this.getTodo2(this.rmFilter);

      if (this.kpiComp) {
        console.log('kpi available');
        this.kpiComp.getKpi(this.currentSession.currentRole.ROLE_CODE);
      }
      if (this.summaryComp) {
        console.log('summary available');
        this.summaryComp.getSummary2(this.rmFilter);
        // this.summaryComp.getSummary();
      }
      // this.clearFilter();
      // const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
      // const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;
      // this.department = getRoleOrgResult.department;
      // this.subDepartment = getRoleOrgResult.subDepartment;
      // this.unitLeader = getRoleOrgResult.unitLeader;
      // this.unit = getRoleOrgResult.unit;
      // this.getTodo(this.setFilter(currentRoleLevel, isGroupLevel), isGroupLevel);
      // this.getTodo();
    }
  }

  initAllScript() {
    // App.initLoadPage();
    $('#kpi-expand').click((event) => {
      event.preventDefault();
      $('#tile-kpi').toggleClass('expand');
      $('#col-kpi').toggleClass('position-absolute');
      $('#col-todo').toggleClass('d-none');
      $('#col-summary').toggleClass('d-none');
      // $('#col-od').toggleClass('d-none');

      $('#headingKpi').removeClass('collapsed');
      $('#collapseKpi').collapse('show');
      this.kpiExpand = $('#tile-kpi').hasClass('expand');
      this.kpiComp.expand = this.kpiExpand;
    });

    $('#todo-expand').click((event) => {
      event.preventDefault();
      $('#tile-todo').toggleClass('expand');
      $('#col-todo').toggleClass('position-absolute');
      $('#col-kpi').toggleClass('d-none');
      $('#col-summary').toggleClass('d-none');
      // $('#col-od').toggleClass('d-none');

      $('#headingTodo').removeClass('collapsed');
      $('#collapseTodo').collapse('show');
      this.todoExpand = $('#tile-todo').hasClass('expand');
      // this.todoComp.expand = this.todoExpand;
    });

    $('#summary-expand').click((event) => {
      event.preventDefault();
      $('#tile-summary').toggleClass('expand');
      $('#col-summary').toggleClass('position-absolute');
      $('#col-kpi').toggleClass('d-none');
      $('#col-todo').toggleClass('d-none');
      // $('#col-od').toggleClass('d-none');

      $('#headingSummary').removeClass('collapsed');
      $('#collapseSummary').collapse('show');
      this.summaryExpand = $('#tile-summary').hasClass('expand');
      this.summaryComp.expand = this.summaryExpand;
    });

    if ($('.app').hasClass('sidenav-toggled')) {
      $('.tile').toggleClass('sidebar-mini');
    }

    $('[data-toggle="sidebar"]').click((event) => {
      event.preventDefault();
      if ($('.app').hasClass('sidenav-toggled')) {
        $('.tile').addClass('sidebar-mini');
      } else {
        $('.tile').removeClass('sidebar-mini');
      }
    });
  }
  setFilter(currentRoleLevel: number, isGroupLevel: boolean) {
    console.log('set filter');
    // this.department = getRoleOrgResult.department;
    // this.subDepartment = getRoleOrgResult.subDepartment;
    // this.unitLeader = getRoleOrgResult.unitLeader;
    // this.unit = getRoleOrgResult.unit;

    if (currentRoleLevel === 1 || isGroupLevel) {
      // this.displayDepartment = this.department;
      Object.assign(this.displayDepartment, this.department);
      this.rmFilter.department = this.currentSession.currentRole.ROLE_CODE;
      this.rmFilter.subDepartment = '';
      this.rmFilter.unit = '';

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
    } else if (currentRoleLevel === 2) { // case user is level 4
      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.rmFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;
      this.rmFilter.unit = '';

      if (this.unitLeader.length > 0) {
        this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
        this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
      if (this.unit.length > 0) {
        this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    } else if (currentRoleLevel === 3) { // case user is level 3
      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.displayUnitLeader = this.unitLeader;
      this.rmFilter.unit = this.currentSession.currentRole.ROLE_CODE;

      if (this.unit.length > 0) {
        this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
        this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      }
    } else { // case user is level 4
      this.displayDepartment = this.department;
      this.displaySubDepartment = this.subDepartment;
      this.displayUnitLeader = this.unitLeader;

      if (this.unit.length > 0) {
        this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.unitLeader[0].ROLE_CODE);
        this.rmFilter.unit = this.displayUnit[0].ROLE_PARENT;
        this.rmFilter.staff_no = this.displayUnitLeader[0].ROLE_CODE;
      } else {
        this.rmFilter.unit = this.unitLeader[0].ROLE_CODE;
        this.rmFilter.staff_no = this.currentSession.user.username;
      }
    }

    return currentRoleLevel;
  }
  clearFilter() {
    console.log('clear filter');
    // this.department = [];
    // this.subDepartment = [];
    // this.unitLeader = [];
    // this.unit = [];
    this.displayDepartment = [];
    this.displaySubDepartment = [];
    this.displayUnit = [];
    this.displayUnitLeader = [];
    this.rmFilter = new RmFilterModel();
    this.rmFilter.department = '';
    this.rmFilter.subDepartment = '';
    this.rmFilter.unit = '';
    this.rmFilter.staff_no = '';
    this.red = 0;
    this.yellow = 0;
  }

  // getTodo(roleLevel: number, isGroupLevel: boolean) {
  //   console.log('get todo');
  //   if (roleLevel === 1 || isGroupLevel) {
  //     this.dashboardService.getTodo(this.currentSession.currentRole.ROLE_CODE, '', '', '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));
  //   } else if (roleLevel === 2) {
  //     this.dashboardService.getTodo('', this.currentSession.currentRole.ROLE_CODE, '', '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));
  //   } else if (roleLevel === 3) {
  //     this.dashboardService.getTodo('', '', this.currentSession.currentRole.ROLE_CODE, '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));
  //   } else {
  //     this.dashboardService.getTodo('', '', this.unitLeader[0].ROLE_CODE, this.currentSession.user.username).subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));
  //   }

  //   this.dashboardService
  //     .getTodoNoti(this.rmFilter.department, this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no)
  //     .subscribe(noti => {
  //       this.yellow = noti.yellow;
  //       this.red = noti.red;
  //     }, error => this.errorService.onRequestError('Get Todo Noti', error));
  // }
  async getTodo2(filter: RmFilterModel) {
    console.log('get todo');
    try {
      this.todo = await this.dashboardService.getTodo(this.rmFilter.department, this.rmFilter.subDepartment,
        this.rmFilter.unit, this.rmFilter.staff_no).toPromise();

      const notiRes = await this.dashboardService
        .getTodoNoti(this.rmFilter.department, this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no).toPromise();
      this.yellow = notiRes.yellow;
      this.red = notiRes.red;
    } catch (error) {
      this.errorService.onRequestError('Get Todo', error);
    }
  }
  // getTodo() {
  //   console.log('get todo');
  //   // this.userService.getRoleOrg(this.currentSession.currentRole.ROLE_CODE, this.currentSession.user.username).subscribe(data => {
  //   // this.department = data.department;
  //   // this.subDepartment = data.subDepartment;
  //   // this.unitLeader = data.unitLeader;
  //   // this.unit = data.unit;

  //   const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
  //   const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;

  //   // case user is level 1
  //   // if (this.department.length > 0 &&
  //   //   this.department.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //   if (currentRoleLevel === 1 || isGroupLevel) {
  //     this.dashboardService.getTodo(this.currentSession.currentRole.ROLE_CODE, '', '', '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));

  //     this.displayDepartment = this.department;
  //     console.log(this.displayDepartment);
  //     this.rmFilter.department = this.currentSession.currentRole.ROLE_CODE;
  //     this.rmFilter.subDepartment = '';
  //     this.rmFilter.unit = '';

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
  //     // else if (this.subDepartment.length > 0 && // case user is level 2
  //     //   this.subDepartment.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //     this.dashboardService.getTodo('', this.currentSession.currentRole.ROLE_CODE, '', '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));

  //     this.displayDepartment = this.department;
  //     this.displaySubDepartment = this.subDepartment;
  //     this.rmFilter.subDepartment = this.currentSession.currentRole.ROLE_CODE;
  //     this.rmFilter.unit = '';
  //     if (this.unitLeader.length > 0) {
  //       this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
  //       this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
  //     }
  //     if (this.unit.length > 0) {
  //       this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
  //     }
  //   } else if (currentRoleLevel === 3) {
  //     // else if (this.unitLeader.length > 0 && // case user is level 3
  //     //   this.unitLeader.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //     this.dashboardService.getTodo('', '', this.currentSession.currentRole.ROLE_CODE, '').subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));

  //     this.displayDepartment = this.department;
  //     this.displaySubDepartment = this.subDepartment;
  //     this.displayUnitLeader = this.unitLeader;
  //     this.rmFilter.unit = this.currentSession.currentRole.ROLE_CODE;
  //     if (this.unit.length > 0) {
  //       this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.currentSession.currentRole.ROLE_CODE);
  //       this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
  //     }
  //   } else { // case user is level 4
  //     this.dashboardService.getTodo('', '', this.unitLeader[0].ROLE_CODE, this.currentSession.user.username).subscribe(todo => {
  //       this.todo = todo;
  //     }, error => this.errorService.onRequestError('Get Todo', error));

  //     this.displayDepartment = this.department;
  //     this.displaySubDepartment = this.subDepartment;
  //     this.displayUnitLeader = this.unitLeader;
  //     if (this.unit.length > 0) {
  //       this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === this.unitLeader[0].ROLE_CODE);
  //       this.rmFilter.unit = this.displayUnit[0].ROLE_PARENT;
  //       this.rmFilter.staff_no = this.displayUnitLeader[0].ROLE_CODE;
  //     } else {
  //       this.rmFilter.unit = this.unitLeader[0].ROLE_CODE;
  //       this.rmFilter.staff_no = this.currentSession.user.username;
  //     }
  //   }

  //   this.dashboardService
  //     .getTodoNoti(this.rmFilter.department, this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no)
  //     .subscribe(noti => {
  //       this.yellow = noti.yellow;
  //       this.red = noti.red;
  //     }, error => this.errorService.onRequestError('Get Todo Noti', error));

  //   // }, error => this.errorService.onRequestError('Get Role Org', error));
  // }
  clear() {
    this.clearFilter();
    console.log(this.displayDepartment);
    // this.currentSession = this.authService.getUserProfile;
    this.viewRoleCode = this.currentSession.currentRole.ROLE_CODE;
    const currentRoleLevel = this.currentSession.currentRole.ROLE_LEVEL;
    const isGroupLevel = this.currentSession.currentRole.ROLE_CODE && !currentRoleLevel ? true : false;
    // this.getTodo(this.setFilter(currentRoleLevel, isGroupLevel), isGroupLevel);
    this.setFilter(currentRoleLevel, isGroupLevel);
    this.getTodo2(this.rmFilter);
    this.kpiComp.getKpi(this.currentSession.currentRole.ROLE_CODE);
    this.summaryComp.getSummary2(this.rmFilter);
    // this.summaryComp.getSummary();
    // this.clearFilter();
    // this.getTodo();
    this.filtered = false;
  }
  refresh() {
    this.kpiComp.getKpi(this.viewRoleCode);
    this.summaryComp.getSummary2(this.rmFilter);
    this.getTodo2(this.rmFilter);
    this.filtered = true;
    // this.dashboardService.getTodo(this.rmFilter.department, this.rmFilter.subDepartment,
    //   this.rmFilter.unit, this.rmFilter.staff_no).subscribe(todo => {
    //     this.todo = todo;
    //     this.dashboardService
    //       .getTodoNoti(this.rmFilter.department, this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no)
    //       .subscribe(noti => {
    //         this.yellow = noti.yellow;
    //         this.red = noti.red;
    //       }, error => this.errorService.onRequestError('Get Todo Noti', error));
    //   }, error => this.errorService.onRequestError('Get Todo', error));
    // this.kpiComp.getKpi(this.viewRoleCode);
    // this.summaryComp.getSummary2(this.rmFilter);
    // this.filtered = true;
  }
  departmentChanged(value) {
    const selected = this.displayDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.rmFilter.department = selected.ROLE_CODE;

    if (value.target.value === 'ALL') {
      this.viewRoleCode = this.currentSession.currentRole.ROLE_CODE;
      this.displaySubDepartment = [];
      this.displayUnitLeader = [];
      this.displayUnit = [];
      this.displaySubDepartment.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.viewRoleCode = selected.ROLE_CODE;
      // this.rmFilter.department = selected.ROLE_CODE;
      this.displaySubDepartment = this.subDepartment.filter(s => s.ROLE_PARENT === selected.ROLE_CODE);
      this.displaySubDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });

      this.displayUnitLeader = [];
      this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
    this.rmFilter.subDepartment = '';
    this.rmFilter.unit = '';
    this.rmFilter.staff_no = '';
  }
  subDepartmentChanged(value) {
    const selected = this.displaySubDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];
    console.log(selected);
    this.rmFilter.subDepartment = selected.ROLE_CODE;
    if (value.target.value === 'ALL') {
      this.viewRoleCode = this.currentSession.currentRole.ROLE_CODE;
      this.displayUnitLeader = [];
      this.displayUnit = [];
      this.displayUnitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.viewRoleCode = selected.ROLE_CODE;

      this.displayUnitLeader = this.unitLeader.filter(u => u.ROLE_PARENT === selected.ROLE_CODE);
      this.displayUnitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });

      this.displayUnit = [];
      this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
    this.rmFilter.unit = '';
    this.rmFilter.staff_no = '';
  }
  UnitLeaderChanged(value) {
    const selected = this.displayUnitLeader.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.rmFilter.unit = selected.ROLE_CODE;
    if (value.target.value === 'ALL') {
      this.viewRoleCode = this.rmFilter.subDepartment;
      this.rmFilter.unit = '';
      this.rmFilter.staff_no = '';
      this.displayUnit = [];
      this.displayUnit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.viewRoleCode = selected.ROLE_CODE;
      // this.rmFilter.unit = selected.ROLE_CODE;
      this.rmFilter.staff_no = '';
      this.displayUnit = this.unit.filter(u => u.ROLE_PARENT === selected.ROLE_CODE);
      this.displayUnit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    }
  }
  unitChanged(value) {
    const selected = this.displayUnit.filter(s => s.ROLE_DESC === value.target.value)[0];

    if (value.target.value === 'ALL') {
      this.viewRoleCode = this.rmFilter.unit;
      this.rmFilter.staff_no = '';
    } else {
      this.viewRoleCode = selected.ROLE_CODE;

      this.rmFilter.unit = selected.ROLE_PARENT;
      this.rmFilter.staff_no = selected.ROLE_CODE;
    }
  }

  async viewTodoDetail(topic) {
    this.modalHeader = topic;
    $('#todo-content').animate({ scrollTop: 0 });
    try {
      const todoDetailRes = await this.dashboardService.getTodoDetail(this.rmFilter.department,
        this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no, topic).toPromise();

      this.todoDetail = todoDetailRes;
      if (this.todoDetail.length > 0) {
        this.todoDetail.map(t => t.EXPIRED_DATE = this.convertDate(t.EXPIRED_DATE));
        $('#newCifModal').modal({ backdrop: true, show: true });
      }
    } catch (error) {
      this.errorService.onRequestError('Get Todo', error);
    }

    // this.dashboardService
    //   .getTodoDetail(this.rmFilter.department, this.rmFilter.subDepartment, this.rmFilter.unit, this.rmFilter.staff_no, topic)
    //   .subscribe(todo => {
    //     this.todoDetail = todo;
    //     if (this.todoDetail.length > 0) {
    //       this.todoDetail.forEach(t => {
    //         t.EXPIRED_DATE = this.convertDate(t.EXPIRED_DATE);
    //       });
    //     }
    //     $('#newCifModal').modal({ backdrop: true, show: true });
    //   }, error => this.errorService.onRequestError('Get Todo', error));
  }

  viewCustomer(cif) {
    this.router.navigate([`/${this.AppUrl.Authen}/${this.AuthUrl.Customer}`, cif]);
  }

  convertDate(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return new Date(year, month - 1, day);
  }

  findPeriodDays2(date: Date) {
    const currentDate = new Date();
    const sub = date.getDate() - currentDate.getDate();
    return sub;
    // const temp = date.getTime() - currentDate.getTime();
    // return Math.ceil(temp / (1000 * 3600 * 24));
  }

  findPeriodDays(date: Date) {
    const currentDate = new Date();
    const temp = date.getTime() - currentDate.getTime();
    return Math.ceil(temp / (1000 * 3600 * 24));
  }

  // reportViewer(type) {
  //   if (this.department.length > 0 &&
  //     this.department.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //     const role_code = this.currentSession.currentRole.ROLE_CODE;
  //     const department = this.currentSession.currentRole.ROLE_CODE;
  //     const subDepartment = '%';
  //     const unit = '%';
  //     const staff_no = '%';

  //     const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.summary}&
  //     rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
  //     ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
  //     // window.open(url, '_blank', 'width=1080, height=500');
  //     window.open(url, '_blank');
  //   } else if (this.subDepartment.length > 0 && // case user is level 2
  //     this.subDepartment.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //     const role_code = this.currentSession.currentRole.ROLE_CODE;
  //     const department = '%';
  //     const subDepartment = this.currentSession.currentRole.ROLE_CODE;
  //     const unit = '%';
  //     const staff_no = '%';

  //     const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.summary}&
  //     rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
  //     ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
  //     window.open(url, '_blank');

  //     // const url = `${this.reportService.Host}:${this.reportService.Port}/${this.reportService.Directory.Summary}&rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}`;
  //   } else if (this.unitLeader.length > 0 && // case user is level 3
  //     this.unitLeader.filter(d => d.ROLE_CODE === this.currentSession.currentRole.ROLE_CODE).length > 0) {
  //     const role_code = this.currentSession.currentRole.ROLE_CODE;
  //     const department = '%';
  //     const subDepartment = '%';
  //     const unit = this.currentSession.currentRole.ROLE_CODE;
  //     const staff_no = '%';

  //     const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.summary}&
  //     rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
  //     ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
  //     window.open(url, '_blank');
  //     // const url = `${this.reportService.Host}:${this.reportService.Port}/${this.reportService.Directory.Summary}&rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}`;
  //   } else { // case user is level 4
  //     const role_code = this.currentSession.currentRole.ROLE_CODE;
  //     const department = '%';
  //     const subDepartment = '%';
  //     const unit = this.currentSession.currentRole.ROLE_CODE;
  //     const staff_no = this.currentSession.user.username;

  //     const url = `${this.reportService.host}:${this.reportService.port}/${this.reportService.directory.summary}&
  //     rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}&
  //     ${this.reportService.configuration.toolBar.visible}&${this.reportService.configuration.pageZoom.pageWidth}`;
  //     window.open(url, '_blank');

  //     // const url = `${this.reportService.Host}:${this.reportService.Port}/${this.reportService.Directory.Summary}&rs:Command=Render&ROLE_CODE=${role_code}&DEPT=${department}&SUB_DEPT=${subDepartment}&UNIT=${unit}&STAFF_NO=${staff_no}`;
  //   }
  // }

}
