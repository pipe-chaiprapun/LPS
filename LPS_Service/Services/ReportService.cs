using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models.Account;
using LPS_Service.Models.Report;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using PdfSharp.Pdf;
using PdfSharp.Drawing;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using System.IO;
using MigraDoc.DocumentObjectModel.Tables;
using System.Globalization;

namespace LPS_Service.Services
{
    public class ReportService : IReportService
    {
        private LPSDBEntities _db = new LPSDBEntities();
        private Document doc;
        private Section section;

        public ReportModel[] GetReports(string role_code, string staff_no)
        {
            try
            {
                var reports = _db.Database.SqlQuery<ReportModel>("EXEC SP_LPS_LST_REPORT @ROLE_CODE, @STAFF_NO",
                    new SqlParameter[]
                    {
                        new SqlParameter("@ROLE_CODE", role_code),
                        new SqlParameter("@STAFF_NO", staff_no)
                    }).ToArray();
                return reports;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public int CheckReviewAuth(string report_id, string role_code, string staff_no)
        {
            try
            {
                var result = _db.Database.SqlQuery<int>("SELECT COUNT(*) FROM LPS_USER_MAP_REPORT WHERE REPORT_ID = @REPORT_ID AND (ROLE_CODE = @ROLE_CODE OR ROLE_CODE = @STAFF_NO)",
                    new SqlParameter[] {
                        new SqlParameter("@REPORT_ID", report_id),
                        new SqlParameter("@ROLE_CODE", role_code),
                        new SqlParameter("@STAFF_NO", staff_no)
                    }).ToArray();
                return result.First();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
        public OdAccModel[] GetOdAcc(string name, string dept)
        {
            try
            {
                var accounts = _db.Database.SqlQuery<OdAccModel>("[dbo].[SP_LPS_LST_OD_ACC] @ACC_NAME, @DEPT",
                    new SqlParameter[]
                    {
                        new SqlParameter("@ACC_NAME", !string.IsNullOrEmpty(name) ? name : ""),
                        new SqlParameter("@DEPT", dept)
                    }).ToArray();
                return accounts;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }
        public OdStatementModel[] GetOdStatements(string date, decimal acc_no)
        {
            try
            {
                var statements = _db.Database.SqlQuery<OdStatementModel>("EXEC [dbo].[SP_LPS_LST_OD_STATEMENT] @AS_DATE, @ACC_NO",
                    new SqlParameter[]
                    {
                        new SqlParameter("@AS_DATE", date),
                        new SqlParameter("@ACC_NO", acc_no)
                    }).ToArray();
                return statements;
            }
            catch (Exception e)
            {
                throw e.GetExceptionError();
            }
        }

        public MemoryStream ExportOD(OdStatementModel[] data, string reviewTime)
        {
            doc = new Document();
            doc.Info.Title = "OD Utilize";
            doc.Info.Subject = "OD Utilize";
            doc.Info.Author = "LPS";
            doc.DefaultPageSetup.TopMargin = 20;
            doc.DefaultPageSetup.BottomMargin = 10;
            doc.DefaultPageSetup.RightMargin = 20;
            doc.DefaultPageSetup.LeftMargin = 25;
            doc.DefaultPageSetup.Orientation = Orientation.Landscape;
            var info = data.First();
            var review = DateTime.ParseExact(reviewTime, "yyyyMMdd", new CultureInfo("en-US"));

            return CreatePdfContent(doc, info, data, review.ToString("MMM-yyyy", new CultureInfo("en-US")));
        }
        private MemoryStream CreatePdfContent(Document doc, OdStatementModel info, OdStatementModel[] data, string reviewTime)
        {
            section = doc.AddSection();

            _createReportTitle(info.ACC_NAME);

            section.AddParagraph().AddLineBreak();
            section.AddParagraph().AddLineBreak();
            section.AddParagraph().AddLineBreak();

            _createAccountInfo(info);

            section.AddParagraph().AddLineBreak();
            _createReviewTime(reviewTime);
            _fillOdData(data);

            PdfDocumentRenderer renderer = new PdfDocumentRenderer(true, PdfFontEmbedding.Always);
            renderer.Document = doc;
            renderer.RenderDocument();

            using (MemoryStream stream = new MemoryStream())
            {
                renderer.PdfDocument.Save(stream, false);

                return stream;
            }
        }
        private void _createReportTitle(string title)
        {
            Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Font.Name = "Tahoma";
            paragraph.Format.Font.Size = 18;
            paragraph.Format.Alignment = ParagraphAlignment.Center;
            paragraph.AddFormattedText(title, TextFormat.Bold);
        }
        private void _createReviewTime(string time)
        {
            var frame = section.AddTextFrame();
            frame.Width = "10cm";
            frame.Height = "0.8cm";
            //frame.MarginBottom = "1cm";
            var paragraph = frame.AddParagraph();
            //Paragraph paragraph = section.AddParagraph();
            paragraph.Format.Font.Name = "Microsoft Sans Serif";
            paragraph.Format.Font.Size = 12;
            //paragraph.Format.Alignment = ParagraphAlignment.Center;
            paragraph.AddText($"Statement Review as : {time}");
        }
        private void _createAccountInfo(OdStatementModel info)
        {
            //Section section = doc.AddSection();
            // Add Account Name;
            var tableAccInfo = section.AddTable();
            Column accCol = tableAccInfo.AddColumn("8cm");    // Account Number table
            accCol = tableAccInfo.AddColumn("9cm");             // CostCenter table 
            accCol = tableAccInfo.AddColumn("10cm");             // BranchZone table
            Row accRow = tableAccInfo.AddRow();

            var bgColor = System.Drawing.ColorTranslator.FromHtml("#cceae7");
            var backgroundColor = new Color(bgColor.R, bgColor.G, bgColor.B);
            var bdColor = System.Drawing.ColorTranslator.FromHtml("#b8e2de");
            var borderColor = new Color(bdColor.R, bdColor.G, bdColor.B);
            var fcolor = System.Drawing.ColorTranslator.FromHtml("#004e47");
            var fontColor = new Color(fcolor.R, fcolor.G, fcolor.B);

            // Add Account Number table
            var accNoFrame = accRow.Cells[0].AddTextFrame();
            accNoFrame.Height = "1cm";
            var accNoTable = accNoFrame.AddTable();
            accNoTable.BottomPadding = 2;
            accNoTable.TopPadding = 2;
            accNoTable.Borders.Color = borderColor;
            accNoTable.Borders.Width = 1;
            Column accNoCol = accNoTable.AddColumn("3.5cm");
            accNoCol.Format.Alignment = ParagraphAlignment.Left;
            accNoCol = accNoTable.AddColumn("3cm");
            Row accNoRow = accNoTable.AddRow();
            accNoRow.Cells[0].AddParagraph("Account Number : ");
            accNoRow.Cells[0].Format = _accInfoFormat();
            accNoRow.Cells[0].Shading.Color = backgroundColor;
            accNoRow.Cells[0].Format.Font.Color = fontColor;
            accNoRow.Cells[1].AddParagraph(info.ACC_NO.ToString());
            accNoRow.Cells[1].Format = _accInfoFormat();

            // Add CostCenter table
            var costFrame = accRow.Cells[1].AddTextFrame();
            costFrame.Height = "1cm";
            var costTable = costFrame.AddTable();
            costTable.BottomPadding = 2;
            costTable.TopPadding = 2;
            costTable.Borders.Color = borderColor;
            costTable.Borders.Width = 1;
            Column costCol = costTable.AddColumn("2.5cm");
            accNoCol = costTable.AddColumn("1cm");
            accNoCol = costTable.AddColumn("4cm");
            Row costRow = costTable.AddRow();
            costRow.Cells[0].AddParagraph("CostCenter : ");
            costRow.Cells[0].Format = _accInfoFormat();
            costRow.Cells[0].Shading.Color = backgroundColor;
            costRow.Cells[0].Format.Font.Color = fontColor;
            costRow.Cells[1].AddParagraph(info.COST_CENTER.ToString());
            costRow.Cells[1].Format = _accInfoFormat();
            costRow.Cells[2].AddParagraph(info.COST_CENTER_NAME);
            costRow.Cells[2].Format = _accInfoFormat();

            //Add BranchZone table
            var brnZoneFrame = accRow.Cells[2].AddTextFrame();
            brnZoneFrame.Height = "1cm";
            var brnZoneTable = brnZoneFrame.AddTable();
            brnZoneTable.BottomPadding = 2;
            brnZoneTable.TopPadding = 2;
            brnZoneTable.Borders.Color = borderColor;
            brnZoneTable.Borders.Width = 1;
            Column brnZoneCol = brnZoneTable.AddColumn("3cm");
            brnZoneCol = brnZoneTable.AddColumn("7cm");
            Row brnZoneRow = brnZoneTable.AddRow();
            brnZoneRow.Cells[0].AddParagraph("Branch Zone : ");
            brnZoneRow.Cells[0].Format = _accInfoFormat();
            brnZoneRow.Cells[0].Shading.Color = backgroundColor;
            brnZoneRow.Cells[0].Format.Font.Color = fontColor;
            brnZoneRow.Cells[1].AddParagraph(info.ZONE_NAME);
            brnZoneRow.Cells[1].Format = _accInfoFormat();

            accRow = tableAccInfo.AddRow();

            // Add Number of Months 
            var noMonthFrame = accRow.Cells[0].AddTextFrame();
            noMonthFrame.Height = "1cm";
            var noMonthTable = noMonthFrame.AddTable();
            noMonthTable.BottomPadding = 2;
            noMonthTable.TopPadding = 2;
            noMonthTable.Borders.Color = borderColor;
            noMonthTable.Borders.Width = 1;
            Column noMonthCol = noMonthTable.AddColumn("3.5cm");
            noMonthCol.Format.Alignment = ParagraphAlignment.Left;
            noMonthCol = noMonthTable.AddColumn("3cm");
            Row noMonthRow = noMonthTable.AddRow();
            noMonthRow.Cells[0].AddParagraph("Number of Month : ");
            noMonthRow.Cells[0].Format = _accInfoFormat();
            noMonthRow.Cells[0].Shading.Color = backgroundColor;
            noMonthRow.Cells[0].Format.Font.Color = fontColor;
            noMonthRow.Cells[1].AddParagraph(info.NUMBER_OF_MONTH.ToString());
            noMonthRow.Cells[1].Format = _accInfoFormat(ParagraphAlignment.Right);

            // Add OD Rate
            var odFrame = accRow.Cells[1].AddTextFrame();
            odFrame.Height = "1cm";
            var odTable = odFrame.AddTable();
            odTable.BottomPadding = 2;
            odTable.TopPadding = 2;
            odTable.Borders.Color = borderColor;
            odTable.Borders.Width = 1;
            Column odCol = odTable.AddColumn("2.5cm");
            odCol.Format.Alignment = ParagraphAlignment.Left;
            odCol = odTable.AddColumn("5cm");
            Row odRow = odTable.AddRow();
            odRow.Cells[0].AddParagraph("O/D Rate : ");
            odRow.Cells[0].Format = _accInfoFormat();
            odRow.Cells[0].Shading.Color = backgroundColor;
            odRow.Cells[0].Format.Font.Color = fontColor;
            odRow.Cells[1].AddParagraph(info.OD_RATE.ToString() + "%");
            odRow.Cells[1].Format = _accInfoFormat(ParagraphAlignment.Right);

            // Add Branch
            var brnFrame = accRow.Cells[2].AddTextFrame();
            brnFrame.Height = "1cm";
            var brnTable = brnFrame.AddTable();
            brnTable.BottomPadding = 2;
            brnTable.TopPadding = 2;
            brnTable.Borders.Color = borderColor;
            brnTable.Borders.Width = 1;
            Column brnCol = brnTable.AddColumn("3cm");
            brnCol = brnTable.AddColumn("7cm");
            Row brnRow = brnTable.AddRow();
            brnRow.Cells[0].AddParagraph("Branch : ");
            brnRow.Cells[0].Format = _accInfoFormat();
            brnRow.Cells[0].Shading.Color = backgroundColor;
            brnRow.Cells[0].Format.Font.Color = fontColor;
            brnRow.Cells[1].AddParagraph(info.BRH_NAME);
            brnRow.Cells[1].Format = _accInfoFormat();

            //return doc;
            //return section;
        }
        private void _fillOdData(OdStatementModel[] data)
        {
            var table = section.AddTable();
            //table.Rows.HeightRule = RowHeightRule.Exactly;
            //table.Rows.Height = 20;
            table.RightPadding = 3;
            table.LeftPadding = 1;
            table.BottomPadding = 4;
            table.TopPadding = 4;
            //table.Borders.Width = 1;
            var bgOdColor = System.Drawing.ColorTranslator.FromHtml("#009688");
            var backgroundOdColor = new Color(bgOdColor.R, bgOdColor.G, bgOdColor.B);

            Column column = table.AddColumn("0.7cm");  // No.
            column = table.AddColumn("1.5cm"); // Month
            column = table.AddColumn("1.3cm"); // Credit
            column = table.AddColumn("2.3cm"); // Turnover (THB)
            column = table.AddColumn("1.3cm"); // Debit
            column = table.AddColumn("2.3cm"); // Turnover (THB)
            column = table.AddColumn("2.3cm"); // Highest Balance
            column = table.AddColumn("2.3cm"); // Lowest Balance
            column = table.AddColumn("2.3cm"); // Average Balance
            column = table.AddColumn("2.3cm"); // Ending Balance
            column = table.AddColumn("2.3cm"); // Swing
            column = table.AddColumn("1.3cm"); // % of Swing
            column = table.AddColumn("2cm"); // Monthly Interest
            column = table.AddColumn("2cm"); // Returned Item
            column = table.AddColumn("2cm"); // Dep Check Amount
            Row row = table.AddRow();

            var headerName = new string[] { "", "Month\n", "Credit", "Turnover (THB)", "Debit", "Turnover (THB)", "Highest Balance", "Lowest Balance", "Average Balance", "Ending Balance", "Swing", "% of Swing", "Monthly Interest", "Returned Item", "Dep Check Amount" };
            row = _createHeaderCell(headerName, row);
            int count = 0;
            decimal totalCredit = 0;
            decimal totalTurnoverCredit = 0;
            decimal totalDebit = 0;
            decimal totalTurnoverDebit = 0;
            decimal totalMonthlyInt = 0;
            decimal totalReturnItem = 0;
            decimal totalDepCheckAmt = 0;
            decimal avgCredit = 0;
            decimal avgTurnoverCredit = 0;
            decimal avgDebit = 0;
            decimal avgTurnoverDebit = 0;

            foreach(var item in data)
            {
                row = table.AddRow();
                row.Borders = _borderData();
                row.Cells[0].AddParagraph(item.NUMBER.ToString());
                row.Cells[0].Format = _tableDataFormat();

                row.Cells[1].AddParagraph(item.MONTH.ToString());
                row.Cells[1].Format = _tableDataFormat(ParagraphAlignment.Center);

                row.Cells[2].AddParagraph(item.CREDIT.ToString("#,##0.00"));
                row.Cells[2].Format = _tableDataFormat(ParagraphAlignment.Right, item.CREDIT < 0 ? true : false);

                row.Cells[3].AddParagraph(item.TURNOVER_CREDIT.ToString("#,##0.00"));
                row.Cells[3].Format = _tableDataFormat(ParagraphAlignment.Right, item.TURNOVER_CREDIT < 0 ? true : false);

                row.Cells[4].AddParagraph(item.DEBIT.ToString("#,##0.00"));
                row.Cells[4].Format = _tableDataFormat(ParagraphAlignment.Right, item.DEBIT < 0 ? true : false);

                row.Cells[5].AddParagraph(item.TURNOVER_DEBIT.ToString("#,##0.00"));
                row.Cells[5].Format = _tableDataFormat(ParagraphAlignment.Right, item.TURNOVER_DEBIT < 0 ? true : false);

                row.Cells[6].AddParagraph(item.HIGHEST_BAL.ToString("#,##0.00"));
                row.Cells[6].Format = _tableDataFormat(ParagraphAlignment.Right, item.HIGHEST_BAL < 0 ? true : false);

                row.Cells[7].AddParagraph(item.LOWEST_BAL.ToString("#,##0.00"));
                row.Cells[7].Format = _tableDataFormat(ParagraphAlignment.Right, item.LOWEST_BAL < 0 ? true : false);

                row.Cells[8].AddParagraph(item.AVG_BAL.ToString("#,##0.00"));
                row.Cells[8].Format = _tableDataFormat(ParagraphAlignment.Right, item.AVG_BAL < 0 ? true : false);

                row.Cells[9].AddParagraph(item.ENDING_BAL.ToString("#,##0.00"));
                row.Cells[9].Format = _tableDataFormat(ParagraphAlignment.Right, item.ENDING_BAL < 0 ? true : false);

                row.Cells[10].AddParagraph(item.SWING.ToString("#,##0.00"));
                row.Cells[10].Format = _tableDataFormat(ParagraphAlignment.Right, item.SWING < 0 ? true : false);

                row.Cells[11].AddParagraph(item.PER_OF_SWING.ToString("#,##0.00"));
                row.Cells[11].Format = _tableDataFormat(ParagraphAlignment.Right, item.PER_OF_SWING < 0 ? true : false);

                row.Cells[12].AddParagraph(item.MONTHLY_INTEREST.ToString("#,##0.00"));
                row.Cells[12].Format = _tableDataFormat(ParagraphAlignment.Right, item.MONTHLY_INTEREST < 0 ? true : false);

                row.Cells[13].AddParagraph(item.RETURN_ITEM.ToString("#,##0.00"));
                row.Cells[13].Format = _tableDataFormat(ParagraphAlignment.Right, item.RETURN_ITEM < 0 ? true : false);

                row.Cells[14].AddParagraph(item.DEP_CHECK_AMT.ToString("#,##0.00"));
                row.Cells[14].Format = _tableDataFormat(ParagraphAlignment.Right, item.DEP_CHECK_AMT < 0 ? true : false);

                count++;
                totalCredit += item.CREDIT;
                totalTurnoverCredit += item.TURNOVER_CREDIT;
                totalDebit += item.DEBIT;
                totalTurnoverDebit += item.TURNOVER_DEBIT;
                totalMonthlyInt += item.MONTHLY_INTEREST;
                totalReturnItem += item.RETURN_ITEM;
                totalDepCheckAmt += item.DEP_CHECK_AMT;
            }
            avgCredit = totalCredit / count;
            avgTurnoverCredit = totalTurnoverCredit / count;
            avgDebit = totalDebit / count;
            avgTurnoverDebit = totalTurnoverDebit / count;

            var totalRow = table.AddRow();
            var rwfooterColor = System.Drawing.ColorTranslator.FromHtml("#86d0a7");
            var footerColor = new Color(rwfooterColor.R, rwfooterColor.G, rwfooterColor.B);
            totalRow.Borders = _borderData();

            totalRow.Cells[0].MergeRight = 1;
            totalRow.Cells[0].AddParagraph("Total:");
            totalRow.Cells[0].Format = _tableDataFormat(ParagraphAlignment.Center);
            totalRow.Cells[0].Shading.Color = footerColor;
            totalRow.Cells[2].AddParagraph(totalCredit.ToString("#,##0.00"));
            totalRow.Cells[2].Format = _tableDataFormat(ParagraphAlignment.Right, totalCredit < 0 ? true : false);
            totalRow.Cells[2].Shading.Color = footerColor;
            totalRow.Cells[3].AddParagraph(totalTurnoverCredit.ToString("#,##0.00"));
            totalRow.Cells[3].Format = _tableDataFormat(ParagraphAlignment.Right, totalTurnoverCredit < 0 ? true : false);
            totalRow.Cells[3].Shading.Color = footerColor;
            totalRow.Cells[4].AddParagraph(totalDebit.ToString("#,##0.00"));
            totalRow.Cells[4].Format = _tableDataFormat(ParagraphAlignment.Right, totalDebit < 0 ? true : false);
            totalRow.Cells[4].Shading.Color = footerColor;
            totalRow.Cells[5].AddParagraph(totalTurnoverDebit.ToString("#,##0.00"));
            totalRow.Cells[5].Format = _tableDataFormat(ParagraphAlignment.Right, totalTurnoverDebit < 0 ? true : false);
            totalRow.Cells[5].Shading.Color = footerColor;
            totalRow.Cells[12].AddParagraph(totalMonthlyInt.ToString("#,##0.00"));
            totalRow.Cells[12].Format = _tableDataFormat(ParagraphAlignment.Right, totalMonthlyInt < 0 ? true : false);
            totalRow.Cells[12].Shading.Color = footerColor;
            totalRow.Cells[13].AddParagraph(totalReturnItem.ToString("#,##0.00"));
            totalRow.Cells[13].Format = _tableDataFormat(ParagraphAlignment.Right, totalReturnItem < 0 ? true : false);
            totalRow.Cells[13].Shading.Color = footerColor;
            totalRow.Cells[14].AddParagraph(totalDepCheckAmt.ToString("#,##0.00"));
            totalRow.Cells[14].Format = _tableDataFormat(ParagraphAlignment.Right, totalDepCheckAmt < 0 ? true : false);
            totalRow.Cells[14].Shading.Color = footerColor;

            var avgRow = table.AddRow();
            avgRow.Borders = _borderData();
            avgRow.Cells[0].MergeRight = 1;
            avgRow.Cells[0].AddParagraph("Average:");
            avgRow.Cells[0].Format = _tableDataFormat(ParagraphAlignment.Center);
            avgRow.Cells[0].Shading.Color = footerColor;
            avgRow.Cells[2].AddParagraph(avgCredit.ToString("#,##0.00"));
            avgRow.Cells[2].Format = _tableDataFormat(ParagraphAlignment.Right, avgCredit < 0 ? true : false);
            avgRow.Cells[2].Shading.Color = footerColor;
            avgRow.Cells[3].AddParagraph(avgTurnoverCredit.ToString("#,##0.00"));
            avgRow.Cells[3].Format = _tableDataFormat(ParagraphAlignment.Right, avgTurnoverCredit < 0 ? true : false);
            avgRow.Cells[3].Shading.Color = footerColor;
            avgRow.Cells[4].AddParagraph(avgDebit.ToString("#,##0.00"));
            avgRow.Cells[4].Format = _tableDataFormat(ParagraphAlignment.Right, avgDebit < 0 ? true : false);
            avgRow.Cells[4].Shading.Color = footerColor;
            avgRow.Cells[5].AddParagraph(avgTurnoverDebit.ToString("#,##0.00"));
            avgRow.Cells[5].Format = _tableDataFormat(ParagraphAlignment.Right, avgTurnoverDebit < 0 ? true : false);
            avgRow.Cells[5].Shading.Color = footerColor;

            section.AddParagraph().AddLineBreak();

            _fillOdSummary(data.FirstOrDefault(), avgTurnoverCredit, avgDebit, avgCredit);
        }

        private void _fillOdSummary(OdStatementModel data, decimal avgTurnoverCredit, decimal avgDebit, decimal avgCredit)
        {
            var tableSummary = section.AddTable();
            var sumCol = tableSummary.AddColumn("17.3cm");
            sumCol = tableSummary.AddColumn("13cm");
            var sumRow = tableSummary.AddRow();

            var sumFrame1 = sumRow.Cells[0].AddTextFrame();
            var table = sumFrame1.AddTable();
            table.RightPadding = 3;
            table.LeftPadding = 3;
            table.BottomPadding = 2;
            table.TopPadding = 2;
            table.Borders = _borderSummary();
            var bgOdColor = System.Drawing.ColorTranslator.FromHtml("#c3e6cb");
            var backgroundOdColor = new Color(bgOdColor.R, bgOdColor.G, bgOdColor.B);

            Column column = table.AddColumn("5cm");
            column = table.AddColumn("4cm");
            Row row = table.AddRow();
            row.Cells[0].AddParagraph("OD Limit");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(data.OD_LIMIT.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.OD_LIMIT < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("Avg.Credit Turn-Over");
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[1].AddParagraph(avgTurnoverCredit.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, avgTurnoverCredit < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("% of OD Utilization");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(data.PER_OF_OD_UTIL.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.PER_OF_OD_UTIL < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("Average Swing");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(data.AVG_SWING.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.AVG_SWING < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("Average % of Swing");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(data.AVG_PER_OF_SWING.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.AVG_PER_OF_SWING < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("Avg. Number of Debit");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(avgDebit.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, avgDebit < 0 ? true : false);
            row = table.AddRow();
            row.Cells[0].AddParagraph("Avg. Number of Credit");
            row.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row.Cells[0].Shading.Color = backgroundOdColor;
            row.Cells[1].AddParagraph(avgCredit.ToString("#,##0.00"));
            row.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, avgCredit < 0 ? true : false);


            var sumFrame2 = sumRow.Cells[1].AddTextFrame();
            var table2 = sumFrame2.AddTable();
            //var table2 = section.AddTable();
            table2.RightPadding = 3;
            table2.LeftPadding = 3;
            table2.BottomPadding = 2;
            table2.TopPadding = 2;
            table2.Borders = _borderSummary();
            Column column2 = table2.AddColumn("7cm");
            column2 = table2.AddColumn("4cm");
            Row row2 = table2.AddRow();
            row2.Cells[0].AddParagraph("Avg. Return Check Item");
            row2.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row2.Cells[0].Shading.Color = backgroundOdColor;
            row2.Cells[1].AddParagraph(data.AVG_RETURN_CHECK_ITEM.ToString("#,##0.00"));
            row2.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.AVG_RETURN_CHECK_ITEM < 0 ? true : false);
            row2 = table2.AddRow();
            row2.Cells[0].AddParagraph("Avg. Return Check Amount");
            row2.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row2.Cells[0].Shading.Color = backgroundOdColor;
            row2.Cells[1].AddParagraph(data.AVG_RETURN_CHECK_AMT.ToString("#,##0.00"));
            row2.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.AVG_RETURN_CHECK_AMT < 0 ? true : false);
            row2 = table2.AddRow();
            row2.Cells[0].AddParagraph("Avg. Return Check Amount By Item");
            row2.Cells[0].Format = _summaryFormat(ParagraphAlignment.Left, false);
            row2.Cells[0].Shading.Color = backgroundOdColor;
            row2.Cells[1].AddParagraph(data.AVG_RETURN_CHECK_AMT_ITEM.ToString("#,##0.00"));
            row2.Cells[1].Format = _summaryFormat(ParagraphAlignment.Right, data.AVG_RETURN_CHECK_AMT_ITEM < 0 ? true : false);
        }

        private ParagraphFormat _accInfoFormat(ParagraphAlignment align = ParagraphAlignment.Left)
        {
            var format = new ParagraphFormat();
            format.Font.Name = "Microsoft Sans Serif";
            format.Font.Size = 10;
            format.Alignment = align;
            return format;
        }  
        private Row _createHeaderCell(string[] colName, Row row)
        {
            var bgOdColor = System.Drawing.ColorTranslator.FromHtml("#009688");
            var backgroundOdColor = new Color(bgOdColor.R, bgOdColor.G, bgOdColor.B);
            for (int i = 0; i < colName.Length; i++)
            {
                row.Cells[i].AddParagraph(colName[i]);
                row.Cells[i].Format = _tableHeaderFormat();
                row.Cells[i].Borders = _borderHeader();
                row.Cells[i].Shading.Color = backgroundOdColor;
            }
            return row;
        }
        private ParagraphFormat _tableHeaderFormat()
        {   
            var format = new ParagraphFormat();
            format.Font.Name = "Microsoft Sans Serif";
            format.Font.Size = 10;
            format.Alignment = ParagraphAlignment.Center;
            format.Font.Color = Colors.White;
            //format.Shading.Color = backgroundOdColor;

            return format;
        }
        private Borders _borderHeader()
        {
            var border = new Borders();
            border.Width = 0.5;
            border.Color = Colors.White;
            return border;
        }
        private ParagraphFormat _tableDataFormat(ParagraphAlignment alignment = ParagraphAlignment.Right, bool minus = false)
        {
            var raw = System.Drawing.ColorTranslator.FromHtml("#dc3545");
            var red = new Color(raw.R, raw.G, raw.B);
            var format = new ParagraphFormat();
            format.Font.Name = "Microsoft Sans Serif";
            format.Font.Size = 8;
            format.Alignment = alignment;
            format.Font.Color = minus ? red : Colors.Black;
            return format;
        }
        private Borders _borderData()
        {
            var raw = System.Drawing.ColorTranslator.FromHtml("#dee2e6");
            var Color = new Color(raw.R, raw.G, raw.B);
            var border = new Borders();
            border.Width = 0.5;
            border.Color = Color;
            return border;

        }
        private ParagraphFormat _summaryFormat(ParagraphAlignment alignment = ParagraphAlignment.Right, bool minus = false)
        {
            var raw = System.Drawing.ColorTranslator.FromHtml("#dc3545");
            var red = new Color(raw.R, raw.G, raw.B);
            var format = new ParagraphFormat();
            format.Font.Name = "Microsoft Sans Serif";
            format.Font.Size = 10;
            format.Alignment = alignment;
            format.Font.Color = minus ? red : Colors.Black;
            return format;
        }
        private Borders _borderSummary()
        {
            var raw = System.Drawing.ColorTranslator.FromHtml("#8fd19e");
            var Color = new Color(raw.R, raw.G, raw.B);
            var border = new Borders();
            border.Width = 0.5;
            border.Color = Color;
            return border;

        }
    }
}