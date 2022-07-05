using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models.Account;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;

namespace LPS_Service.Services
{
    public class AccountService : IAccountService
    {
        private LPSDBEntities _db = new LPSDBEntities();
        public ProductGroupModel GetProductGroup(string cif)
        {
            try
            {
                var deposit = _db.Database.SqlQuery<string>("EXEC SP_LPS_LST_PRODUCT_GROUP_DEPOSIT @CIF_KEY",
                    new SqlParameter[]
                    {
                        new SqlParameter("@CIF_KEY", cif)
                    }).ToArray();
                var loan = _db.Database.SqlQuery<string>("EXEC SP_LPS_LST_PRODUCT_GROUP_LOAN @CIF_KEY",
                    new SqlParameter[]
                    {
                        new SqlParameter("@CIF_KEY", cif)
                    }).ToArray();
                var loanLimit = _db.Database.SqlQuery<string>("EXEC SP_LPS_LST_PRODUCT_GROUP_LOANLIMIT @CIF_KEY",
                    new SqlParameter[]
                    {
                        new SqlParameter("@CIF_KEY", cif)
                    }).ToArray();

                return new ProductGroupModel { loanProducts = loan, depositProducts = deposit, loanLimitProducts = loanLimit };
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public GetLoanLimitModel GetLoanLimit(LoanLimitFilterModel value)
        {
            try
            {
                var loans = _db.Database.SqlQuery<SpLoanLimitModel>("EXEC SP_LPS_LST_LIMIT @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", value.cif)
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    loans = value.ascending == true ? loans.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                    : loans.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                var filterLoans = new GetLoanLimitModel
                {
                    loans = loans.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
                    totalItems = loans.Count()
                };
                if (!string.IsNullOrEmpty(value.productAlco) && !value.productAlco.Equals("ALL"))
                {
                    var searchAccounts = loans.Where(a => a.ALL_PRODUCT_ALCO.Equals(value.productAlco));
                    filterLoans.loans = searchAccounts.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray();
                    filterLoans.totalItems = searchAccounts.Count();
                }
                return filterLoans;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<GetLoanlimitDetailModel2> GetLoanLimitDetail(string cif)
        {
            try
            {
                var level0 = _db.Database.
                    SqlQuery<GetLoanlimitDetailModel2>
                    (@"SELECT DISTINCT AFOFFR, AFAPNO, AFFCDE, AFSEQ, AFLEVL, AFLTYP, AFCPNO, AFCUR, AFFAMT
                        FROM LPS_LIMIT_DETAIL WHERE AFAPNO = @CIF_NO", new SqlParameter[] { new SqlParameter("@CIF_NO", cif) }).ToList();

                if (level0.Count > 0)
                {
                    //List<GetLoanlimitDetailModel2> level1 = default(List<GetLoanlimitDetailModel2>);
                    //List<GetLoanlimitDetailModel2> level2;
                    foreach (var l1 in level0)
                    {
                        var level1 = _db.Database.
                            SqlQuery<GetLoanlimitDetailModel2>
                            (@"SELECT DISTINCT 
                                AFOFFR,
                                AFAPNO_L1 AS AFAPNO, 
                                AFFCDE_L1 AS AFFCDE, 
                                AFSEQ_L1 AS AFSEQ,
                                AFLEVL_L1 AS AFLEVL, 
                                AFLTYP_L1 AS AFLTYP, 
                                AFCPNO_L1 AS AFCPNO, 
                                AFCUR_L1 AS AFCUR, 
                                AFFAMT_L1 AS AFFAMT
                                FROM LPS_LIMIT_DETAIL 
                                WHERE AFAPNO = @AFAPNO AND AFFCDE = @AFFCDE AND AFSEQ = @AFSEQ AND AFAPNO_L1 IS NOT NULL",
                                new SqlParameter[] {
                                    new SqlParameter("@AFAPNO", l1.AFAPNO),
                                    new SqlParameter("@AFFCDE", l1.AFFCDE),
                                    new SqlParameter("@AFSEQ", l1.AFSEQ)
                                }).ToList();

                        if (level1.Count > 0)
                        {
                            foreach (var l2 in level1)
                            {
                                var level2 = _db.Database.
                                SqlQuery<GetLoanlimitDetailModel2>
                                (@"SELECT DISTINCT 
                                    AFOFFR, 
                                    AFAPNO_L2 AS AFAPNO, 
                                    AFFCDE_L2 AS AFFCDE, 
                                    AFSEQ_L2 AS AFSEQ,
                                    AFLEVL_L2 AS AFLEVL, 
                                    AFLTYP_L2 AS AFLTYP, 
                                    AFCPNO_L2 AS AFCPNO, 
                                    AFCUR_L2 AS AFCUR, 
                                    AFFAMT_L2 AS AFFAMT
                                    FROM LPS_LIMIT_DETAIL 
                                    WHERE AFAPNO_L1 = @AFAPNO AND AFFCDE_L1 = @AFFCDE AND AFSEQ_L1 = @AFSEQ AND AFAPNO_L2 IS NOT NULL",
                                    new SqlParameter[] {
                                        new SqlParameter("@AFAPNO", l2.AFAPNO),
                                        new SqlParameter("@AFFCDE", l2.AFFCDE),
                                        new SqlParameter("@AFSEQ", l2.AFSEQ)
                                    }).ToList();

                                if (level2.Count > 0) { l2.children = level2; }
                            }

                            l1.children = level1;
                        }
                        //level0[level0.IndexOf(l1)].children = level1;
                    }
                }
                return level0;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public GetLoanAccountModel GetLoanAccount(LoanAccountFilterModel value)
        {
            try
            {
                var accounts = _db.Database.SqlQuery<SpLoanAccountModel>("EXEC SP_LPS_LST_ACCOUNT_LOAN @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", value.cif)
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    accounts = value.ascending == true ? accounts.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                        : accounts.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                var filterAccounts = new GetLoanAccountModel
                {
                    accounts = accounts.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
                    totalItems = accounts.Count()
                };
                if (!string.IsNullOrEmpty(value.productGroup) && !value.productGroup.Equals("ALL"))
                {
                    var searchAccounts = accounts.Where(a => a.PRODUCT_GROUP.Equals(value.productGroup));
                    filterAccounts.accounts = searchAccounts.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray();
                    filterAccounts.totalItems = searchAccounts.Count();
                }
                return filterAccounts;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public GetCollateralModel[] GetAccountCollateral(string account_no)
        {
            try
            {
                var collaterals = _db.Database.SqlQuery<GetCollateralModel>("[dbo].[SP_LPS_LST_COLLATERAL] @VIEW_TYPE, @CIF_KEY, @ACCT_NO",
                    new SqlParameter[] {
                    new SqlParameter("@VIEW_TYPE", "A"),
                    new SqlParameter("@CIF_KEY", DBNull.Value),
                    new SqlParameter("@ACCT_NO", account_no)
                }).ToArray();

                if (collaterals.Length > 0)
                {
                    List<GetCollateralModel> res = new List<GetCollateralModel>();
                    foreach (var c in collaterals)
                    {
                        if (c.DETAIL_FLAG == "Y")
                        {
                            c.COLLATERAL_DETAILS = GetAccountCollateralDetail(c.CCDCID);
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
        public GetCollateralModel[] GetAccountCollateral2(CollateralFilterModel value)
        {
            try
            {
                var collaterals = _db.Database.SqlQuery<GetCollateralModel>("[dbo].[SP_LPS_LST_COLLATERAL] @VIEW_TYPE, @CIF_KEY, @ACCT_NO",
                    new SqlParameter[] {
                    new SqlParameter("@VIEW_TYPE", "A"),
                    new SqlParameter("@CIF_KEY", DBNull.Value),
                    new SqlParameter("@ACCT_NO", value.account_no)
                }).ToList();

                if (collaterals.Count > 0)
                {
                    List<GetCollateralModel> res = new List<GetCollateralModel>();
                    foreach (var c in collaterals)
                    {
                        if (c.DETAIL_FLAG == "Y")
                        {
                            c.COLLATERAL_DETAILS = GetAccountCollateralDetail(c.CCDCID);
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
        public CollateralDetailModel[] GetAccountCollateralDetail(string id)
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

        public GetDepositAccountModel GetDepositAccount(DepositAccountFilterModel value)
        {
            try
            {
                var accounts = _db.Database.SqlQuery<SpDepositAccountModel>("EXEC SP_LPS_LST_ACCOUNT_DEPOSIT @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", value.cif)
                }).ToList();

                if (!string.IsNullOrEmpty(value.sortBy))
                {
                    accounts = value.ascending == true ? accounts.OrderBy(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList()
                                                        : accounts.OrderByDescending(o => o.GetType().GetProperty(value.sortBy).GetValue(o)).ToList();
                }

                var filterAccounts = new GetDepositAccountModel
                {
                    accounts = accounts.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray(),
                    totalItems = accounts.Count()
                };
                if (!string.IsNullOrEmpty(value.productGroup) && !value.productGroup.Equals("ALL"))
                {
                    var searchAccounts = accounts.Where(a => a.PRODUCT_GROUP.Equals(value.productGroup));
                    filterAccounts.accounts = searchAccounts.Skip((value.startPage - 1) * value.limitPage).Take(value.limitPage).ToArray();
                    filterAccounts.totalItems = searchAccounts.Count();
                }
                return filterAccounts;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpAccountRelationshipModel> GetAccountRelation(string account)
        {
            try
            {
                var relations = _db.Database.SqlQuery<SpAccountRelationshipModel>("EXEC SP_LPS_LST_ACCOUNT_RELATIONSHIP @ACCOUNT_NO", new SqlParameter[]{
                    new SqlParameter("@ACCOUNT_NO", account)
                }).ToList();
                return relations;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpServiceModel> GetAccountService(string cif)
        {
            try
            {
                var services = _db.Database.SqlQuery<SpServiceModel>("EXEC SP_LPS_LST_CUSTOMER_SERVICE @CIF_KEY", new SqlParameter[]{
                    new SqlParameter("@CIF_KEY", cif)
                }).ToList();
                return services;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
    }
}