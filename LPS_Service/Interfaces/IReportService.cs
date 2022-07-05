using LPS_Service.Models.Account;
using LPS_Service.Models.Report;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface IReportService
    {
        ReportModel[] GetReports(string role_code, string staff_no);
        OdAccModel[] GetOdAcc(string name, string dept);
        OdStatementModel[] GetOdStatements(string date, decimal acc_no);
        int CheckReviewAuth(string report_id, string role_code, string staff_no);
        MemoryStream ExportOD(OdStatementModel[] data, string reviewTime);
    }
}
