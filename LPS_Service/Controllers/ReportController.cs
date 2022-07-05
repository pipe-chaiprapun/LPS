using LPS_Service.Interfaces;
using LPS_Service.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace LPS_Service.Controllers
{
    public class ReportController : ApiController
    {
        private IReportService _report;

        ReportController()
        {
            _report = new ReportService();
        }

        [Route("api/report/list")]
        public IHttpActionResult GetReportList(string role_code, string staff_no)
        {
            try
            {
                var reports = _report.GetReports(role_code, staff_no);
                return Json(reports);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
        [Route("api/report/checkauth")]
        public IHttpActionResult GetReportAuth(string report_id, string role_code, string staff_no)
        {
            try
            {
                var auth = _report.CheckReviewAuth(report_id, role_code, staff_no);
                if (auth == 0)
                {
                    return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Forbidden)
                    {
                        Content = new StringContent("Your account or role are unauthorized for this report!")
                    });
                }
                return Ok();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Route("api/report/od/statement")]
        public IHttpActionResult GetOdStatement(string date, string account)
        {
            try
            {
                if (!string.IsNullOrEmpty(date) && !string.IsNullOrEmpty(account))
                {
                    var acc_no = Decimal.Parse(account);
                    var statements = _report.GetOdStatements(date, acc_no);
                    return Json(statements);
                }
                return BadRequest("Please input AsDate and Account No!");
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Route("api/report/od/account")]
        public IHttpActionResult GetOdAcc(string name, string dept)
        {
            try
            {
                var accounts = _report.GetOdAcc(name, dept);
                return Json(accounts);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Authorize]
        [Route("api/report/od/download")]
        public HttpResponseMessage GetDownloadFile(string account, string date)
        {
            try
            {
                //var acc_no = Decimal.Parse("5171000653");
                //var statements = _report.GetOdStatements("20201231", acc_no);
                if (!string.IsNullOrEmpty(date) && !string.IsNullOrEmpty(account))
                {
                    var acc_no = Decimal.Parse(account);
                    var statements = _report.GetOdStatements(date, acc_no);
                    HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
                    var stream = _report.ExportOD(statements, date);
                    result.Content = new ByteArrayContent(stream.ToArray());
                    result.Content.Headers.Add("x-filename", $"OD_{acc_no}.pdf");
                    result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                    result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                    result.Content.Headers.ContentDisposition.FileName = $"OD_{acc_no}.pdf";
                    return result;
                }
                return new HttpResponseMessage(HttpStatusCode.BadRequest)
                {
                    Content = new StringContent("Invalid Account No or Review Date"),
                    ReasonPhrase = "Invalid Account No or Review Date"
                };
                //var contentType = MimeMapping.GetMimeMapping(Path.GetExtension(item.PATH));
                //var bFile = File.ReadAllBytes(item.PATH);


            }
            catch (Exception e)
            {
                //return InternalServerError(e.Message);
                return new HttpResponseMessage(HttpStatusCode.InternalServerError)
                {
                    Content = new StringContent(e.Message),
                    ReasonPhrase = e.Message
                };
            }
        }
    }
}
