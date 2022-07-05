using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models.Account;
using LPS_Service.Models.Customer;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace LPS_Service.Services
{
    public class CustomerService : ICustomerService
    {
        private LPSDBEntities _db = new LPSDBEntities();

        public SpCustomerGroupsModel[] ListCustomerGroups(CustomerGroupFilterModel value)
        {
            try
            {
                var groups = _db.Database.SqlQuery<SpCustomerGroupsModel>("EXEC SP_LPS_LST_CUSTOMER_GROUPS @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO", new SqlParameter[] {
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(value.department) ? value.department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(value.subDepartment) ? value.subDepartment : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(value.unit) ? value.unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(value.staffNo) ? value.staffNo : "%")
                }).ToArray();

                return groups;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public GetCustomersModel GetCustomers(CustomerFilterModel value)
        {
            try
            {
                List<SpCustomerModel> customers = new List<SpCustomerModel>();

                customers = _db.Database.SqlQuery<SpCustomerModel>("EXEC SP_LPS_LST_CUSTOMER_SEARCH @CIF_KEY, @CUSTOMER_NAME, @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO, @CUSTOMER_GROUP_NO", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", !string.IsNullOrEmpty(value.cif) ? value.cif : "%"),
                    new SqlParameter("@CUSTOMER_NAME", !string.IsNullOrEmpty(value.name) ? value.name : "%"),
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(value.department) ? value.department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(value.subDepartment) ? value.subDepartment : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(value.unit) ? value.unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(value.staff_no) ? value.staff_no : "%"),
                    new SqlParameter("@CUSTOMER_GROUP_NO", !string.IsNullOrEmpty(value.group_no) ? value.group_no : "%")
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    customers = value.ascending == true ? customers.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                        : customers.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                var filterCustomers = new GetCustomersModel
                {
                    customers = customers.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
                    totalItems = customers.Count()
                };

                return filterCustomers;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpCustomerModel> DownloadCustomers(CustomerFilterModel value)
        {
            try
            {
                List<SpCustomerModel> customers = new List<SpCustomerModel>();

                customers = _db.Database.SqlQuery<SpCustomerModel>("EXEC SP_LPS_LST_CUSTOMER @CIF_KEY, @CUSTOMER_NAME, @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", !string.IsNullOrEmpty(value.cif) ? value.cif : "%"),
                    new SqlParameter("@CUSTOMER_NAME", !string.IsNullOrEmpty(value.name) ? value.name : "%"),
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(value.department) ? value.department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(value.subDepartment) ? value.subDepartment : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(value.unit) ? value.unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(value.staff_no) ? value.staff_no : "%")
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    customers = value.ascending == true ? customers.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                        : customers.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                return customers;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public GetCustomerProfileModel GetCustomerProfile(string cif)
        {
            try
            {
                var products = _db.Database.SqlQuery<SpCustomerProfileModel>("EXEC SP_LPS_LST_CUSTOMER_PROFILE @CIF_KEY", new SqlParameter[] {
                    new SqlParameter("@CIF_KEY", cif)
                }).ToList();

                var loans = (from l in products where l.Product_Type == "LOAN" orderby l.Seq select l).ToArray();
                var deposits = (from d in products where d.Product_Type == "DEPOSIT" orderby d.Seq select d).ToArray();
                var collateral = (from c in products where c.Product == "COLLATERAL" select c).FirstOrDefault();
                var mortgage = (from m in products where m.Product == "COLLATERAL_MORTGAGE" select m).FirstOrDefault();
                var fees = (from f in products where f.Product_Type == "FEE" orderby f.Seq select f).ToArray();
                var nii_acc = (from a in products where a.Product_Type == "NII_ACC" select a).FirstOrDefault();
                var nii_ytd = (from y in products where y.Product_Type == "NII_YTD" select y).FirstOrDefault();

                return new GetCustomerProfileModel
                {
                    loans = loans,
                    deposits = deposits,
                    collateral = collateral,
                    mortgage = mortgage,
                    fees = fees,
                    nii_acc = nii_acc,
                    nii_ytd = nii_ytd
                };
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }


        public GetCollateralModel[] GetCustomerCollateral(string cif)
        {
            try
            {
                var collaterals = _db.Database.SqlQuery<GetCollateralModel>("[dbo].[SP_LPS_LST_COLLATERAL] @VIEW_TYPE, @CIF_KEY, @ACCT_NO",
                    new SqlParameter[] {
                    new SqlParameter("@VIEW_TYPE", "C"),
                    new SqlParameter("@CIF_KEY", cif),
                    new SqlParameter("@ACCT_NO", DBNull.Value)
                }).ToArray();

                if (collaterals.Length > 0)
                {
                    List<GetCollateralModel> res = new List<GetCollateralModel>();
                    foreach (var c in collaterals)
                    {
                        if (c.DETAIL_FLAG == "Y")
                        {
                            c.COLLATERAL_DETAILS = GetCustomerCollateralDetail(c.CCDCID);
                        }
                        res.Add(c);
                    }
                    return res.ToArray();
                }
                return collaterals;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public GetCollateralModel[] GetCustomerCollateral2(CollateralFilterModel value)
        {
            try
            {
                var collaterals = _db.Database.SqlQuery<GetCollateralModel>("[dbo].[SP_LPS_LST_COLLATERAL] @VIEW_TYPE, @CIF_KEY, @ACCT_NO",
                    new SqlParameter[] {
                    new SqlParameter("@VIEW_TYPE", "C"),
                    new SqlParameter("@CIF_KEY", value.cif),
                    new SqlParameter("@ACCT_NO", DBNull.Value)
                }).ToList();

                if (collaterals.Count > 0)
                {
                    List<GetCollateralModel> res = new List<GetCollateralModel>();
                    foreach (var c in collaterals)
                    {
                        if (c.DETAIL_FLAG == "Y")
                        {
                            c.COLLATERAL_DETAILS = GetCustomerCollateralDetail(c.CCDCID);
                        }
                        res.Add(c);
                    }
                    collaterals = res.ToList();
                }

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    collaterals = value.ascending == true ? collaterals.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                        : collaterals.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                return collaterals.ToArray();
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public CollateralDetailModel[] GetCustomerCollateralDetail(string id)
        {
            try
            {
                var collaterals = _db.Database.SqlQuery<CollateralDetailModel>("EXEC [dbo].[SP_LPS_LST_COLLATERAL_DETAIL] @CCDCID",
                    new SqlParameter[] { new SqlParameter("@CCDCID", id) }).ToArray();
                return collaterals;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public CustomerInfoModel GetCustomerInfo(string cif)
        {
            try
            {
                //var customer = _db.Database.SqlQuery<SpCustomerModel>("EXEC SP_LPS_CUSTOMER_INFO @CIF_KEY", new SqlParameter[]{
                //    new SqlParameter("@CIF_KEY", cif)
                //}).FirstOrDefault();
                var customer = _db.Database.SqlQuery<SpCustomerModel>("EXEC SP_LPS_LST_CUSTOMER @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", cif)
                }).FirstOrDefault();

                var rawGroups = _db.Database.SqlQuery<SpCustomerGroupModel>("EXEC SP_LPS_LST_CUSTOMER_GROUP @CIF_KEY", new SqlParameter[]
                {
                    new SqlParameter("@CIF_KEY", cif)
                }).ToList();
                List<CustomerGroup> groups = new List<CustomerGroup>();
                foreach (var g in rawGroups.GroupBy(x => x.CUSTOMER_GROUP_NO))
                {
                    List<SpCustomerGroupModel> list = new List<SpCustomerGroupModel>();
                    foreach (var d in g)
                    {
                        list.Add(new SpCustomerGroupModel
                        {
                            CUSTOMER_GROUP_NO = d.CUSTOMER_GROUP_NO,
                            CUSTOMER_GROUP_NAME = d.CUSTOMER_GROUP_NAME,
                            CIF_KEY = d.CIF_KEY,
                            CUSTOMER_NAME = d.CUSTOMER_NAME,
                            CUSTOMER_GROUP_RELATION = d.CUSTOMER_GROUP_RELATION
                        });
                    }
                    groups.Add(new CustomerGroup
                    {
                        groupNo = list.LastOrDefault().CUSTOMER_GROUP_NO,
                        groupName = list.LastOrDefault().CUSTOMER_GROUP_NAME,
                        data = list.ToArray()
                    });
                }

                var creditRating = _db.Database.SqlQuery<SpCustomerRating>("EXEC SP_LPS_LST_CUSTOMER_RATING @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", cif)
                }).ToList();

                var contactInfo = _db.Database.SqlQuery<CustomerContact>("EXEC SP_LPS_LST_CUSTOMER_CONTACT @CIF_KEY", new SqlParameter[] { new SqlParameter("@CIF_KEY", cif) }).ToArray();

                var watchlist = _db.Database.SqlQuery<CustomerWatchListModel>("EXEC SP_LPS_LST_CUSTOMER_WATCH_LIST @CIF_KEY", new SqlParameter[] { new SqlParameter("@CIF_KEY", cif) }).ToArray();

                return new CustomerInfoModel { customerInfo = customer, customerGroup = groups.ToArray(), creditRating = creditRating.ToArray(), contactInfo = contactInfo, watchlist = watchlist };

                //var customer = Customers.customerInfo.FirstOrDefault(c => cif.Equals(c.cif));
                //return customer;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public CustomerWatchListModel[] GetCustomerWatchList(string cif)
        {
            try
            {
                var watchlist = _db.Database.SqlQuery<CustomerWatchListModel>("EXEC SP_LPS_LST_CUSTOMER_WATCH_LIST @CIF_KEY", new SqlParameter[] { new SqlParameter("@CIF_KEY", cif) }).ToArray();
                return watchlist;
            }
            catch(Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public List<CustomerGroup> GetCustomerGroupDetail(string cif)
        {
            try
            {
                var rawGroups = _db.Database.SqlQuery<SpCustomerGroupModel>("EXEC SP_LPS_LST_CUSTOMER_GROUP @CIF_KEY", new SqlParameter[]
                {
                    new SqlParameter("@CIF_KEY", cif)
                }).ToList();
                List<CustomerGroup> groups = new List<CustomerGroup>();
                foreach (var g in rawGroups.GroupBy(x => x.CUSTOMER_GROUP_NO))
                {
                    List<SpCustomerGroupModel> list = new List<SpCustomerGroupModel>();
                    foreach (var d in g)
                    {
                        list.Add(new SpCustomerGroupModel
                        {
                            CUSTOMER_GROUP_NO = d.CUSTOMER_GROUP_NO,
                            CUSTOMER_GROUP_NAME = d.CUSTOMER_GROUP_NAME,
                            CIF_KEY = d.CIF_KEY,
                            CUSTOMER_NAME = d.CUSTOMER_NAME,
                            CUSTOMER_GROUP_RELATION = d.CUSTOMER_GROUP_RELATION
                        });
                    }
                    groups.Add(new CustomerGroup
                    {
                        groupNo = list.LastOrDefault().CUSTOMER_GROUP_NO,
                        groupName = list.LastOrDefault().CUSTOMER_GROUP_NAME,
                        data = list.ToArray()
                    });
                }

                return groups;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        //public CustomerInfoModel GetCustomerInfo(string cif, string dept, string sub_dept, string unit, string staff_no)
        //{
        //    try
        //    {
        //        var customer = _db.Database.SqlQuery<SpCustomerModel>("EXEC SP_LPS_LST_CUSTOMER @CIF_KEY, @CUSTOMER_NAME, @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO", new SqlParameter[]{
        //            new SqlParameter("@CIF_KEY", cif),
        //            new SqlParameter("@CUSTOMER_NAME", "%"),
        //            new SqlParameter("@DEPT", "%"),
        //            //new SqlParameter("@DEPT", dept),
        //            new SqlParameter("@SUB_DEPT", "%"),
        //            //new SqlParameter("@SUB_DEPT", sub_dept),
        //            new SqlParameter("@UNIT", "%"),
        //            //new SqlParameter("@UNIT", unit),
        //            new SqlParameter("@STAFF_NO", "%")
        //            //new SqlParameter("@STAFF_NO", staff_no)
        //        }).FirstOrDefault();

        //        var rawGroups = _db.Database.SqlQuery<SpCustomerGroupModel>("EXEC SP_LPS_LST_CUSTOMER_GROUP @CIF_KEY", new SqlParameter[]
        //        {
        //            new SqlParameter("@CIF_KEY", cif)
        //        }).ToList();
        //        List<CustomerGroup> groups = new List<CustomerGroup>();
        //        foreach (var g in rawGroups.GroupBy(x => x.CUSTOMER_GROUP_NO))
        //        {
        //            List<SpCustomerGroupModel> list = new List<SpCustomerGroupModel>();
        //            foreach (var d in g)
        //            {
        //                list.Add(new SpCustomerGroupModel
        //                {
        //                    CUSTOMER_GROUP_NO = d.CUSTOMER_GROUP_NO,
        //                    CUSTOMER_GROUP_NAME = d.CUSTOMER_GROUP_NAME,
        //                    CIF_KEY = d.CIF_KEY,
        //                    CUSTOMER_NAME = d.CUSTOMER_NAME,
        //                    CUSTOMER_GROUP_RELATION = d.CUSTOMER_GROUP_RELATION
        //                });
        //            }
        //            groups.Add(new CustomerGroup
        //            {
        //                groupNo = list.LastOrDefault().CUSTOMER_GROUP_NO,
        //                groupName = list.LastOrDefault().CUSTOMER_GROUP_NAME,
        //                data = list.ToArray()
        //            });
        //        }

        //        var creditRating = _db.Database.SqlQuery<SpCustomerRating>("EXEC SP_LPS_LST_CUSTOMER_RATING @CIF_KEY", new SqlParameter[]{
        //            new SqlParameter("@CIF_KEY", cif)
        //        }).ToList();

        //        return new CustomerInfoModel { customerInfo = customer, customerGroup = groups.ToArray(), creditRating = creditRating.ToArray() };

        //        //var customer = Customers.customerInfo.FirstOrDefault(c => cif.Equals(c.cif));
        //        //return customer;
        //    }
        //    catch (Exception e)
        //    {
        //        throw e.GetExceptionError();
        //    }
        //}
    }
}