using LPS_Service.Entity;
using LPS_Service.Models.Account;
using LPS_Service.Models.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface ICustomerService
    {
        GetCustomersModel GetCustomers(CustomerFilterModel value);
        List<SpCustomerModel> DownloadCustomers(CustomerFilterModel value);
        //CustomerFilterOptionModel GetCustomerFilterOptions(string username);
        //CustomerInfoModel GetCustomerInfo(string cif, string dept, string sub_dept, string unit, string staff_no);
        CustomerInfoModel GetCustomerInfo(string cif);
        //CustomerWatchListModel[] GetCustomerWatchList(string cif);
        List<CustomerGroup> GetCustomerGroupDetail(string cif);
        GetCustomerProfileModel GetCustomerProfile(string cif);
        GetCollateralModel[] GetCustomerCollateral(string cif);
        GetCollateralModel[] GetCustomerCollateral2(CollateralFilterModel value);
        CollateralDetailModel[] GetCustomerCollateralDetail(string id);
        SpCustomerGroupsModel[] ListCustomerGroups(CustomerGroupFilterModel value);
    }
}
