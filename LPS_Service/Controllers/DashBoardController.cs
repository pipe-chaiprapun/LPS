using LPS_Service.Helpers;
using LPS_Service.Interfaces;
using LPS_Service.Models.Dashboard;
using LPS_Service.Services;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LPS_Service.Content
{
    public class DashBoardController : ApiController
    {
        private IDashboardService _dashboard;
        //private ITokenService _jwtService;

        private DashBoardController()
        {
            this._dashboard = new DashboardService();
            //this._jwtService = new JwtService();
        }

        [Authorize]
        [Route("api/dashboard/kpi")]
        public IHttpActionResult GetKpi(string role_code)
        {
            try
            {
                //var currentUser = (UserLogin)HttpContext.Current.User;
                //if (currentUser != null)
                //{
                var kpi = _dashboard.GetKpi(role_code);
                return Json(kpi);
                //}
                //return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                //{
                //    Content = new StringContent("You are unthorized or you session has been expired!")
                //});
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Route("api/dashboard/todo")]
        public IHttpActionResult GetTodo(string department, string sub_department, string unit, string staff_no)
        {
            try
            {
                var todo = _dashboard.GetTodo(department, sub_department, unit, staff_no);
                return Json(todo);
            }
            catch (InvalidCastException e)
            {
                return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                {
                    Content = new StringContent("You are unthorized or you session has been expired!")
                });
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/dashboard/todo/notification")]
        public IHttpActionResult GetTodoNotification(string department, string sub_department, string unit, string staff_no)
        {
            try
            {
                //var detail = _dashboard.GetTodoDetail(department, sub_department, unit, staff_no, "Bill Warning");
                var detail = _dashboard.GetTodoDetail(department, sub_department, unit, staff_no, "Past Due/Due Date Warning");
                int yellow = 0, red = 0;
                List<double> dates = new List<double>();
                if(detail.Count > 0)
                {
                    foreach(var d in detail)
                    {
                        var tempDate = DateTime.ParseExact(d.EXPIRED_DATE, "yyyyMMdd", CultureInfo.InvariantCulture);
                        var diff = Math.Ceiling((tempDate - DateTime.Now).TotalDays);
                        if(diff < 1) { red++; }
                        if(diff <= 7 && diff >= 1) { yellow++; }
                        dates.Add(Math.Ceiling((tempDate - DateTime.Now).TotalDays));
                    }
                }
                return Json(new { yellow, red });
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/dashboard/todo/detail")]
        public IHttpActionResult GetTodoDetail(string department, string sub_department, string unit, string topic, string staff_no)
        {
            try
            {
                var detail = _dashboard.GetTodoDetail(department, sub_department, unit, staff_no, topic);
                return Json(detail);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Route("api/dashboard/summary")]
        public IHttpActionResult GetSummary(string department, string sub_department, string unit, string staff_no)
        {
            try
            {
                var summary = _dashboard.GetSummary(department, sub_department, unit, staff_no);
                return Json(summary);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
    }
}
