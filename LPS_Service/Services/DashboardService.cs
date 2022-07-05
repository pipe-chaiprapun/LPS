using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models;
using LPS_Service.Models.Dashboard;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;

namespace LPS_Service.Services
{
    public class DashboardService : IDashboardService
    {
        private LPSDBEntities _db = new LPSDBEntities();

        public GetKpiModel GetKpi(string role_code)
        {
            try
            {
                var kpi = _db.Database.SqlQuery<SpKpiModel>("EXEC LPS_LST_KPI_SUMMARY @ROLE_CODE", new SqlParameter[] {
                    new SqlParameter("@ROLE_CODE", role_code)
                    }).ToList();

                if (kpi == null || kpi.Count == 0)
                {
                    return new GetKpiModel { kpi = kpi.ToArray() };
                }

                var date = DateTime.ParseExact(kpi.FirstOrDefault().ASDATE, "yyyyMMdd", CultureInfo.InvariantCulture);
                return new GetKpiModel { date = date, kpi = kpi.ToArray() };
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpTodoModel> GetTodo(string department, string sub_department, string unit, string staff_no)
        {
            try
            {
                var todo = _db.Database.SqlQuery<SpTodoModel>("EXEC SP_LPS_LST_TO_DO @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO", new SqlParameter[]{
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(department) ? department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(sub_department) ? sub_department : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(unit) ? unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(staff_no) ? staff_no : "%")
                }).ToList();

                //var bill = todo.FirstOrDefault(b => b.TO_DO_TOPIC == "Past Due/Due Date Warning");
                //bill.NO_CIF = 15;
                //bill.TOTAL_AMT = (decimal)6066.1403;

                foreach(var t in todo)
                {
                    if (t.TO_DO_TOPIC == "Past Due/Due Date Warning")
                    {
                        t.NO_CIF = 15;
                        t.TOTAL_AMT = (decimal)6066.1403;
                    }
                }
                //todo.Add(new SpTodoModel { DEPT = "L4000", SUB_DEPT = "L4200", UNIT = string.Empty, NO_CIF = 15, TOTAL_AMT = (decimal)447.2423, TO_DO_TOPIC = "Bill Warning" });
                return todo;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpTodoDetailModel> GetTodoDetail(string department, string sub_department, string unit, string staff_no, string topic)
        {
            try
            {
                if (topic == "Past Due/Due Date Warning")
                {
                    var detail = new List<SpTodoDetailModel>();
                    detail.Add(new SpTodoDetailModel { CIFNO = "31006676", CUSTOMER_NAME = "NAME 31006676", ACCOUNT_NO = "AL31006676000002067", EXPIRED_DATE = "20210601", CBAL = (decimal)56.1818/100000, OTHER_INFO = "Over Due 92 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "31000085", CUSTOMER_NAME = "NAME 31000085", ACCOUNT_NO = "AL31000085000001716", EXPIRED_DATE = "20210603", CBAL = (decimal)25000.0000 / 100000, OTHER_INFO = "Over Due 90 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "31001835", CUSTOMER_NAME = "NAME 31001835", ACCOUNT_NO = "AL31001835000001885", EXPIRED_DATE = "20210608", CBAL = (decimal)28109.1100 / 100000, OTHER_INFO = "Over Due 85 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "73011313", CUSTOMER_NAME = "NAME 73011313", ACCOUNT_NO = "AL73011313000030060", EXPIRED_DATE = "20210725", CBAL = (decimal)601401863.0100 / 100000, OTHER_INFO = "Over Due 38 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "47011137", CUSTOMER_NAME = "NAME 47011137", ACCOUNT_NO = "AL47011137000007936", EXPIRED_DATE = "20210810", CBAL = (decimal)298.6100 / 100000, OTHER_INFO = "Over Due 22 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "55020020", CUSTOMER_NAME = "NAME 55020020", ACCOUNT_NO = "AL55020020000015094", EXPIRED_DATE = "20210831", CBAL = (decimal)16600.0000 / 100000, OTHER_INFO = "Over Due 1 day(s)", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "53028320", CUSTOMER_NAME = "NAME 53028320", ACCOUNT_NO = "AL53028320000013281", EXPIRED_DATE = "20210901", CBAL = (decimal)14043.9700 / 100000, OTHER_INFO = "", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "53027749", CUSTOMER_NAME = "NAME 53027749", ACCOUNT_NO = "AL53027749000013189", EXPIRED_DATE = "20210901", CBAL = (decimal)10574.4500 / 100000, OTHER_INFO = "", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "61012516", CUSTOMER_NAME = "NAME 61012516", ACCOUNT_NO = "AL61012516000019682", EXPIRED_DATE = "20210905", CBAL = (decimal)13384.5800 / 100000, OTHER_INFO = "4 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "58034682", CUSTOMER_NAME = "NAME 58034682", ACCOUNT_NO = "AL58034682000017581", EXPIRED_DATE = "20210907", CBAL = (decimal)12268.0600 / 100000, OTHER_INFO = "6 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "58029324", CUSTOMER_NAME = "NAME 58029324", ACCOUNT_NO = "AL58029324000017331", EXPIRED_DATE = "20210908", CBAL = (decimal)27305.6200 / 100000, OTHER_INFO = "7 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "36020309", CUSTOMER_NAME = "NAME 36020309", ACCOUNT_NO = "AL36020309000005120", EXPIRED_DATE = "20210912", CBAL = (decimal)18286.3000 / 100000, OTHER_INFO = "11 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "50000196", CUSTOMER_NAME = "NAME 50000196", ACCOUNT_NO = "AL50000196000009297", EXPIRED_DATE = "20210915", CBAL = (decimal)5020547.9500 / 100000, OTHER_INFO = "14 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "58000848", CUSTOMER_NAME = "NAME 58000848", ACCOUNT_NO = "AL58000848000015891", EXPIRED_DATE = "20211001", CBAL = (decimal)25000.0000 / 100000, OTHER_INFO = "30 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    detail.Add(new SpTodoDetailModel { CIFNO = "54008740", CUSTOMER_NAME = "NAME 54008740", ACCOUNT_NO = "AL54008740000013907", EXPIRED_DATE = "20211031", CBAL = (decimal)687.6500 / 100000, OTHER_INFO = "60 day(s) Before Due Date", TO_DO_TOPIC = "Past Due/Due Date Warning" });
                    return detail;
                }
                else
                {
                    var detail = _db.Database.SqlQuery<SpTodoDetailModel>("EXEC SP_LPS_LST_TO_DO_DETAIL @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO, @TO_DO_TOPIC", new SqlParameter[]{
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(department) ? department : "%"),
                    new SqlParameter("@SUB_DEPT", !string.IsNullOrEmpty(sub_department) ? sub_department : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(unit) ? unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(staff_no) ? staff_no : "%"),
                    new SqlParameter("@TO_DO_TOPIC", topic)
                    }).ToList();
                    return detail;
                }
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public List<SpSummaryModel> GetSummary(string department, string sub_department, string unit, string staff_no)
        {
            try
            {
                var summary = _db.Database.SqlQuery<SpSummaryModel>("EXEC SP_LPS_LST_SUMMARY_PORT @DEPT, @SUB_DEPT, @UNIT, @STAFF_NO", new SqlParameter[]
                {
                    new SqlParameter("@DEPT", !string.IsNullOrEmpty(department) ? department : "%"),
                    new SqlParameter("@SUB_DEPT",!string.IsNullOrEmpty(sub_department) ? sub_department : "%"),
                    new SqlParameter("@UNIT", !string.IsNullOrEmpty(unit) ? unit : "%"),
                    new SqlParameter("@STAFF_NO", !string.IsNullOrEmpty(staff_no) ? staff_no : "%")
                }).ToList();
                return summary;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
    }
}