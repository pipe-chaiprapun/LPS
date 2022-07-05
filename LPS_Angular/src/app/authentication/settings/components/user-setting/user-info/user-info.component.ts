import { Component, OnInit } from '@angular/core';
import { CurrentSessionModel } from 'src/app/models/User/CurrentSessionModel';
import { UserAccountModel } from 'src/app/models/UserAccountModel';
import { RmModel, RmFilterModel } from 'src/app/models/User/RmModel';
import { UserRoleModel, RoleOrgModel } from 'src/app/models/User/UserRoleModel';
import { colors } from 'src/app/constant/color';
import { UserAccountService } from 'src/app/services/user-account.service';
import { ErrorService } from 'src/app/services/error.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { EmpUnitModel } from 'src/app/models/EmpUnitModel';
import Swal from 'sweetalert2';
declare const $;

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  currentSession: CurrentSessionModel;

  currentUser: UserAccountModel;
  currentRm: RmModel;
  currentRoles: UserRoleModel[];
  currentRoleCodes = [];

  department: RoleOrgModel[] = [] = [];
  subDepartment: RoleOrgModel[] = [] = [];
  unitLeader: RoleOrgModel[] = [] = [];
  unit: RoleOrgModel[] = [] = [];
  setRole: RoleOrgModel;
  warningColor = colors.warning;

  constructor(private userService: UserAccountService, private errorService: ErrorService, private authService: AuthorizationService) {

    this.currentSession = authService.getUserProfile;
    this.userService.viewCurrentRm().subscribe(data => {
      this.currentRm = data;
      console.log('current rm');
      console.log(this.currentRm);
      if (this.currentRm) {
        $('#txt-id').val(this.currentRm.STAFF_NO);
        this.getRoles(this.currentRm.STAFF_NO);
      }
    });
  }

  // currentInputElement: HTMLInputElement;
  // Units
  units: EmpUnitModel[];
  mainUnitIcon = 'fa-plus-circle';

  ngOnInit() {

    this.userService.getRoleFilter(1, '').subscribe(data => {
      this.department = data;

      if (this.department.length > 0) {
        this.setRole = this.department[0];
        this.userService.getRoleFilter(2, this.department[0].ROLE_CODE).subscribe(subDept => {
          this.subDepartment = subDept;
          this.subDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
          this.unitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        });
      }
    });

    this.getUnits();

  }
  search(employeeId) {
    const rmFilter = new RmFilterModel();
    rmFilter.startPage = 1;
    rmFilter.limitPage = 1;
    rmFilter.staff_no = employeeId;

    if (employeeId) {
      Swal.fire({
        titleText: 'Fetching user',
        icon: 'info',
        timerProgressBar: true,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
          this.userService.getRm(rmFilter).subscribe(data => {
            if (data.rms.length > 0) {
              Swal.close();
              this.currentRm = data.rms[0];
              this.userService.saveCurrentRm(this.currentRm);
              // this.getRoles(employeeId);
            } else {
              this.currentRm = null;
              this.currentRoles = [];
              this.currentRoleCodes = [];
              this.userService.clearCurrentRm();
              Swal.fire({
                title: 'Fetching user',
                text: 'Not found user!',
                icon: 'error',
                // showConfirmButton: true,
                showCloseButton: true,
                showConfirmButton: false,
                timer: 1500
              });
            }
          }, error => this.errorService.onRequestError('Get Users', error));
        }
      });
    }
  }

  getRoles(employeeId) {
    this.userService.getRoles(employeeId).subscribe(roles => {
      this.currentRoles = roles;
      if (roles) {
        this.currentRoleCodes = [];
        roles.forEach(r => this.currentRoleCodes.push(r.ROLE_CODE));
      }
    }, error => this.errorService.onRequestError('Get roles', error));
  }

  departmentChanged(value) {
    const selected = this.department.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.setRole = selected;

    this.subDepartment = [];

    this.unitLeader = [];

    this.unit = [];

    this.userService.getRoleFilter(2, selected.ROLE_CODE).subscribe(data => {
      this.subDepartment = data;
      if (this.subDepartment.length > 0) {
        this.subDepartment.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        this.unit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      } else {
        this.unitLeader = [];
        this.unit = [];
      }
    });
  }

  subDepartmentChanged(value) {
    const selected = this.subDepartment.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.setRole = selected;

    if (value.target.value === 'ALL') {
      this.unitLeader = [];
      this.unitLeader.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.userService.getRoleFilter(3, selected.ROLE_CODE).subscribe(data => {
        this.unitLeader = data;
        if (this.unitLeader.length > 0) {
          this.unitLeader.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
        } else {
          this.unitLeader = [];
        }
      });
    }
  }

  unitLeaderChanged(value) {
    const selected = this.unitLeader.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.setRole = selected;

    if (value.target.value === 'ALL') {
      this.unit = [];
      this.unit.push({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
    } else {
      this.userService.getRoleFilter(4, selected.ROLE_CODE).subscribe(data => {
        this.unit = data;
        this.unit.unshift({ ROLE_CODE: '', ROLE_DESC: 'ALL', ROLE_LEVEL: 0, ROLE_PARENT: '', ROLE_PARENT_DESC: '' });
      });
    }
  }

  unitChanged(value) {
    const selected = this.unitLeader.filter(s => s.ROLE_DESC === value.target.value)[0];
    this.setRole = selected;
  }

  deleteRole(role_code, role_desc) {
    if (role_code) {
      Swal.fire({
        titleText: 'Role Deleting',
        text: 'Do you want to delete a current role?',
        icon: 'warning',
        allowOutsideClick: false,
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            titleText: 'Processing',
            icon: 'info',
            timerProgressBar: true,
            allowOutsideClick: false,
            onOpen: () => {
              Swal.showLoading();
              this.userService.deleteRmRole(this.currentRm.STAFF_NO, role_code, this.currentSession.user.username).subscribe(data => {
                if (data > 0) {
                  this.userService.getRoles(this.currentRm.STAFF_NO).subscribe(roles => {
                    this.currentRoles = roles;
                    if (roles) {
                      this.currentRoleCodes = [];
                      roles.forEach(r => this.currentRoleCodes.push(r.ROLE_CODE));
                    }
                  }, error => this.errorService.onRequestError('Get roles', error));
                  Swal.fire({
                    title: `Deleting role`,
                    text: `Role ${role_desc} has been deleted!`,
                    icon: 'success',
                    showConfirmButton: false,
                    showCloseButton: true,
                    timer: 1500
                  });
                } else {
                  this.errorService.onRequestError('Set user status', { error: { Message: 'Cannot Delete a current role on Database!' } });
                }
                // Swal.close();
              }, error => this.errorService.onRequestError('Set user status', error));
            }
          });
        }
      });
    }
  }
  save() {
    if (this.currentRm) {
      Swal.fire({
        titleText: 'Role Mapping',
        text: 'Do you want to assign a new role?',
        icon: 'info',
        allowOutsideClick: false,
        showCancelButton: true
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            titleText: 'Processing',
            icon: 'info',
            timerProgressBar: true,
            allowOutsideClick: false,
            onOpen: () => {
              Swal.showLoading();
              this.userService.setRmRole(this.currentRm.STAFF_NO, this.setRole.ROLE_CODE,
                this.currentSession.user.username).subscribe(data => {
                  if (data > 0) {
                    this.userService.getRoles(this.currentRm.STAFF_NO).subscribe(roles => {
                      this.currentRoles = roles;
                    }, error => this.errorService.onRequestError('Get roles', error));
                    Swal.fire({
                      title: 'Success!',
                      icon: 'success',
                      showConfirmButton: false,
                      showCloseButton: true,
                      timer: 1500
                    });
                  } else {
                    this.errorService.onRequestError('Get customers', { error: { Message: 'Cannot save new role to Database!' } });
                  }
                  // Swal.close();
                }, error => this.errorService.onRequestError('Get customers', error));
            }
          });
        }
      });
    }
  }
  addRole(id, name) {
    console.log(id, name);
    if (this.currentRm) {
      Swal.fire({
        titleText: 'Processing',
        icon: 'info',
        timerProgressBar: true,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
          this.userService.setRmRole(this.currentRm.STAFF_NO, id,
            this.currentSession.user.username).subscribe(data => {
              if (data > 0) {
                this.userService.getRoles(this.currentRm.STAFF_NO).subscribe(roles => {
                  this.currentRoles = roles;
                  if (roles) {
                    this.currentRoleCodes = [];
                    roles.forEach(r => this.currentRoleCodes.push(r.ROLE_CODE));
                  }
                }, error => this.errorService.onRequestError('Get roles', error));
                Swal.fire({
                  title: 'Adding new role!',
                  text: `Role ${name} has been added for ${this.currentRm.STAFF_NAME}`,
                  icon: 'success',
                  showConfirmButton: false,
                  showCloseButton: true,
                  timer: 1500
                });
              } else {
                this.errorService.onRequestError('Get customers', { error: { Message: 'Cannot save new role to Database!' } });
              }
              // Swal.close();
            }, error => this.errorService.onRequestError('Get customers', error));
        }
      });
    }
  }

  setAccStatus() {

    $('.toggle-button-container').toggleClass('active');
    // const status = value.currentTarget.checked;
    if (this.currentRm) {
      const param = this.currentRm.ACTIVE_FLAG === 'Active' ? 'N' : 'Y';
      // const param = status ? 'Y' : 'N';
      this.userService.setRmStatus(this.currentRm.STAFF_NO, param, this.currentSession.user.username).subscribe(data => {
        if (data > 0) {
          this.userService.getRmStatus(this.currentRm.STAFF_NO).subscribe(accStatus => {
            this.currentRm.ACTIVE_FLAG = accStatus === 'Y' ? 'Active' : 'Disabled';
          }, error => this.errorService.onRequestError('Get status', error));
        } else {
          this.errorService.onRequestError('Set user status',
            { error: { Message: 'Cannot set account status on database!' } });
        }
      }, error => this.errorService.onRequestError('Set user status', error));
    }
  }

  // get all units
  getUnits() {
    this.userService.getUnits().subscribe(data => {
      this.units = data;
      $(document).ready(function () {
        $('.treeview-animated').mdbTreeview();
        $('.treeview-animated-items .add-btn').click((e) => {
          e.stopPropagation();
        });
      });
    });
  }

  // choose main unit
  chooseUnit(id, name) {
    console.log(id);
    console.log(name);
  }

  expand() {
    if (!$('.nested').hasClass('active')) {
      $('.nested').addClass('active').slideDown();
    }
    if (!$('.closed').hasClass('open')) {
      $('.closed').addClass('open');
    }
    if (!$('.fa-angle-right').hasClass('down')) {
      $('.fa-angle-right').addClass('down');
    }
  }
  collapse() {
    if ($('.nested').hasClass('active')) {
      $('.nested').removeClass('active').slideUp();
    }
    if ($('.closed').hasClass('open')) {
      $('.closed').removeClass('open');
    }
    if ($('.fa-angle-right').hasClass('down')) {
      $('.fa-angle-right').removeClass('down');
    }
    if ($('.treeview-animated-element').hasClass('opened')) {
      $('.treeview-animated-element').removeClass('opened');
    }
  }

}
