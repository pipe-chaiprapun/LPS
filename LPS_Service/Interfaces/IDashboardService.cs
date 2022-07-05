using LPS_Service.Models.Dashboard;
using System.Collections.Generic;

namespace LPS_Service.Interfaces
{
    interface IDashboardService
    {
        List<SpTodoModel> GetTodo(string department, string sub_department, string unit, string staff_no);
        List<SpTodoDetailModel> GetTodoDetail(string department, string sub_department, string unit, string staff_no, string topic);
        GetKpiModel GetKpi(string role_code);
        List<SpSummaryModel> GetSummary(string department, string sub_department, string unit, string staff_no);
    }
}
