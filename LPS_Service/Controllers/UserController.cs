using LPS_Service.Interfaces;
using LPS_Service.Models;
using LPS_Service.Models.User;
using LPS_Service.Services;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LPS_Service.Controllers
{
    public class UserController : ApiController
    {
        IUserService _user;
        ITokenService _token;

        private UserController()
        {
            _user = new UserService();
            _token = new DbTokenService();
        }

        //[Authorize]
        //[Route("api/user/users")]
        //public IHttpActionResult PostUser([FromBody]UserFilterModel value)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            var users = this._user.GetUsers(value);
        //            return Json(users);
        //        }
        //        catch (Exception e)
        //        {
        //            ModelState.AddModelError("Exception", e.Message);
        //            return InternalServerError(e);
        //        }
        //    }
        //    return BadRequest(ModelState.GetErrorModelState());
        //}

        [Authorize]
        [Route("api/user/users2")]
        public IHttpActionResult PostUser2([FromBody]RmFilterModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var users = _user.GetRms(value);
                    return Json(users);
                }
                catch (Exception e)
                {
                    ModelState.AddModelError("Exception", e.Message);
                    return InternalServerError(e);
                }
            }
            return BadRequest(ModelState.GetErrorModelState());
        }

        [Authorize]
        [Route("api/user/setrole")]
        public IHttpActionResult GetSetRmRole(string staff_no, string role_code, string create_by)
        {
            try
            {
                var ip = HttpContext.Current.Request.UserHostAddress;
                var res = _user.SetRmRole(staff_no, role_code, create_by, ip);
                return Json(res);
            }
            catch (SqlException e)
            {
                var code = e.ErrorCode;
                if (code == -2146232060)
                {
                    return BadRequest("User already has this role!");
                }
                return InternalServerError(e);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
            //catch (Exception e)
            //{
            //    ModelState.AddModelError("Exception", e.Message);
            //    return InternalServerError(e);
            //}
        }

        [Authorize]
        [Route("api/user/deleterole")]
        public IHttpActionResult DeleteRmRole(string staff_no, string role_code, string create_by)
        {
            try
            {
                var ip = HttpContext.Current.Request.UserHostAddress;
                var res = _user.DeleteRmRole(staff_no, role_code, create_by, ip);
                return Json(res);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [Route("api/user/setstatus")]
        public IHttpActionResult GetStatus(string staff_no, string flag, string update_by)
        {
            try
            {
                var ip = HttpContext.Current.Request.UserHostAddress;
                var res = _user.SetStatus(staff_no, flag, update_by, ip);
                if (res > 0)
                {
                    _token.SetTokenExpiration(staff_no, 0);
                }
                return Json(res);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/user/getstatus")]
        public IHttpActionResult GetStatus(string staff_no)
        {
            try
            {
                var res = _user.GetStatus(staff_no);
                return Ok(res);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Route("api/user/filter")]
        public IHttpActionResult GetDepartment(int level, string parent)
        {
            try
            {
                var roles = _user.GetRmRoleFilter(level, parent);
                return Json(roles);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        //[Authorize(Roles = "Admin")]
        [Route("api/user/units")]
        public IHttpActionResult GetUnit()
        {
            try
            {
                var units = _user.GetEmpUnit();
                return Json(units);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        //[Authorize(Roles = "Admin")]
        //[Route("api/user/id")]
        //public IHttpActionResult GetUser(string id)
        //{
        //    try
        //    {
        //        var user = _user.GetUserById(id);
        //        if (user != null)
        //            return Json(user);
        //    }
        //    catch (Exception e)
        //    {
        //        ModelState.AddModelError("Exception", e.Message);
        //        return InternalServerError(e);
        //    }
        //    return BadRequest(ModelState.GetErrorModelState());
        //}

        [Route("api/user/roles")]
        public IHttpActionResult GetUserRoles(string employee_id)
        {
            try
            {
                var roles = _user.GetRmRoles(employee_id);
                return Json(roles);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/user/roles/org")]
        public IHttpActionResult GetRoleOrg(string role_code, string staff_no)
        {
            try
            {
                var org = _user.GetRmRoleOrg(role_code, staff_no);
                var department = (from d in org where d.ROLE_LEVEL == 1 select d).ToArray();
                var subDepartment = (from s in org where s.ROLE_LEVEL == 2 select s).ToArray();
                var unitLeader = (from l in org where l.ROLE_LEVEL == 3 select l).ToArray();
                var unit = (from u in org where u.ROLE_LEVEL == 4 select u).ToArray();

                return Json(new { department, subDepartment, unitLeader, unit });
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/Transaction")]
        public IHttpActionResult GetFundSellDetail(string StartDate, string EndDate)
        {
            ArrayOfTransactionInfo transaction = new ArrayOfTransactionInfo();
            transaction.TransactionInfo = new ArrayOfTransactionInfoTransactionInfo[] { 
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "MM",
                    FundCode = "LHMM-A",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Switch In",
                    AmountUnit = "932.78940",
                    AmountBaht = "10879.59000",
                    NAVPrice = "11.66350",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาบิ๊กซี อ่อนนุช",
                    CardID = "IDAAAA",
                    OfficerID = "P3059",
                    SPRRate = "0",
                    Count = "Y",
                    SPRRateAmount = "0",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "03059",
                    CC_CODE = "562",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจกรุงเทพใต้",
                    UNIT = "เขตธนบดีธนกิจบางนา",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIXFUND",
                    FundCode = "LHSTPLUS-A",
                    HolderId = "992000000218",
                    Name = "NAME : BBBBBB",
                    TranDate = "09/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "481.55310",
                    AmountBaht = "5080.00000",
                    NAVPrice = "10.54920",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P1119 SURNAME : P1119",
                    BranchAccount = "สำนักธนบดีธนกิจ",
                    CardID = "IDBBBB",
                    OfficerID = "P1119",
                    SPRRate = "0",
                    Count = "Y",
                    SPRRateAmount = "0",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "01119",
                    CC_CODE = "565",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจลุมพินี",
                    UNIT = "เขตธนบดีธนกิจลุมพินี 2",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIF-EQU",
                    FundCode = "LHMOBILITY-A",
                    HolderId = "995220001827",
                    Name = "NAME : CCCCC",
                    TranDate = "09/07/2021",
                    TranTypeCode = "Switch In",
                    AmountUnit = "44.82730",
                    AmountBaht = "458.27000",
                    NAVPrice = "10.22300",
                    Url = "",
                    Status = "Confirmed",
                    Source = "AMC",
                    IPFGAccount = "NAME : P2176 SURNAME : P2176",
                    BranchAccount = "สาขาสะพานควาย",
                    CardID = "IDCCCC",
                    OfficerID = "P2176",
                    SPRRate = "0.008000",
                    Count = "Y",
                    SPRRateAmount = "3.666160",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "02176",
                    CC_CODE = "557",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจกรุงเทพเหนือ",
                    UNIT = "เขตธนบดีธนกิจอโศก",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "MM",
                    FundCode = "LHMM-A",
                    HolderId = "994020001423",
                    Name = "NAME : GGGGG",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "85.73750",
                    AmountBaht = "1000.00000",
                    NAVPrice = "11.66350",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P2899 SURNAME : P2899",
                    BranchAccount = "สาขาโลตัสภูเก็ต",
                    CardID = "IDGGGG",
                    OfficerID = "P2899",
                    SPRRate = "0",
                    Count = "Y",
                    SPRRateAmount = "0",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "02899",
                    CC_CODE = "571",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจภูมิภาคตอนล่าง",
                    UNIT = "เขตธนบดีธนกิจภาคใต้",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIF-EQU",
                    FundCode = "LHROBOTE-D",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "4153.96240",
                    AmountBaht = "50000.00000",
                    NAVPrice = "12.03670",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาแฟชั่นไอส์แลนด์",
                    CardID = "IDAAAA",
                    OfficerID = "P5177",
                    SPRRate = "0.008000",
                    Count = "Y",
                    SPRRateAmount = "400.000000",
                    SPRRateGL = "0.010500",
                    SPRRateGLAmount = "525.000000",
                    FEELHFG = "N",
                    EM_CODE = "05177",
                    CC_CODE = "558",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจกรุงเทพเหนือ",
                    UNIT = "เขตธนบดีธนกิจรามอินทรา",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "MM",
                    FundCode = "LHMM-A",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Switch In",
                    AmountUnit = "70070.90490",
                    AmountBaht = "817272.00000",
                    NAVPrice = "11.66350",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาบางรัก",
                    CardID = "IDAAAA",
                    OfficerID = "P5183",
                    SPRRate = "0",
                    Count = "Y",
                    SPRRateAmount = "0",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "05183",
                    CC_CODE = "563",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธนบดีธนกิจกรุงเทพใต้",
                    UNIT = "เขตธนบดีธนกิจบางรัก",
                    DIVISION = "",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "MIXED",
                    FundCode = "LHSELECT-D",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "203.62030",
                    AmountBaht = "2000.00000",
                    NAVPrice = "9.82220",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาเดอะมอลล์ บางกะปิ",
                    CardID = "IDAAAA",
                    OfficerID = "P2636",
                    SPRRate = "0.006000",
                    Count = "Y",
                    SPRRateAmount = "12.000000",
                    SPRRateGL = "0.007000",
                    SPRRateGLAmount = "14.000000",
                    FEELHFG = "N",
                    EM_CODE = "02636",
                    CC_CODE = "012",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขากรุงเทพ",
                    UNIT = "เขตธุรกิจสาขารามอินทรา",
                    DIVISION = "สาขาแฟชั่นไอส์แลนด์",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FUND-PROP",
                    FundCode = "LHPROPIA-D",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Sell",
                    AmountUnit = "403.75000",
                    AmountBaht = "4136.02000",
                    NAVPrice = "10.24400",
                    Url = "-863.984625",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาโฮมโปร สุวรรณภูมิ",
                    CardID = "IDAAAA",
                    OfficerID = "P2619",
                    SPRRate = "0.007000",
                    Count = "Y",
                    SPRRateAmount = "28.952140",
                    SPRRateGL = "0.008000",
                    SPRRateGLAmount = "33.088160",
                    FEELHFG = "N",
                    EM_CODE = "02619",
                    CC_CODE = "192",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขากรุงเทพ",
                    UNIT = "เขตธุรกิจสาขาบางนา",
                    DIVISION = "สาขาเดอะ พาซิโอมอลล์ (ลาดกระบัง)",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "MM",
                    FundCode = "LHMM-A",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "85.73750",
                    AmountBaht = "1000.00000",
                    NAVPrice = "11.66350",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาโฮมโปร บุรีรัมย์",
                    CardID = "IDAAAA",
                    OfficerID = "P2693",
                    SPRRate = "0",
                    Count = "Y",
                    SPRRateAmount = "0",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "02693",
                    CC_CODE = "152",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขาภูมิภาคตอนบน",
                    UNIT = "เขตธุรกิจสาขาภาคตะวันออก",
                    DIVISION = "สาขาโฮมโปร บุรีรัมย์",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIF-EQU",
                    FundCode = "LHINNO-A",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "256.11470",
                    AmountBaht = "2000.00000",
                    NAVPrice = "7.80900",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาเดอะมอลล์ นครราชสีมา",
                    CardID = "IDAAAA",
                    OfficerID = "P5241",
                    SPRRate = "0.008000",
                    Count = "Y",
                    SPRRateAmount = "16.000000",
                    SPRRateGL = "0.010500",
                    SPRRateGLAmount = "21.000000",
                    FEELHFG = "N",
                    EM_CODE = "05241",
                    CC_CODE = "076",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขาภูมิภาคตอนบน",
                    UNIT = "เขตธุรกิจสาขาภาคตะวันออก",
                    DIVISION = "สาขาเดอะมอลล์ นครราชสีมา",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIF-EQU",
                    FundCode = "LHSEMICON-A",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Buy",
                    AmountUnit = "5064.93240",
                    AmountBaht = "50000.00000",
                    NAVPrice = "9.87180",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาเดอะคริสตัล เอกมัย-รามอินทรา",
                    CardID = "IDAAAA",
                    OfficerID = "P2716",
                    SPRRate = "0.008000",
                    Count = "Y",
                    SPRRateAmount = "400.000000",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "02716",
                    CC_CODE = "184",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขากรุงเทพ",
                    UNIT = "เขตธุรกิจสาขารามอินทรา",
                    DIVISION = "สาขาเซ็นทรัล แจ้งวัฒนะ",
                    SECTION = "",
                    OP_TNAME = ""
                },
                new ArrayOfTransactionInfoTransactionInfo
                {
                    AmcCode = "LHFUND",
                    FundType = "FIF-EQU",
                    FundCode = "LHSEMICON-D",
                    HolderId = "995210000658",
                    Name = "NAME : AAAAA",
                    TranDate = "05/07/2021",
                    TranTypeCode = "Switch In",
                    AmountUnit = "422.05310",
                    AmountBaht = "4181.66000",
                    NAVPrice = "9.90790",
                    Url = "",
                    Status = "Confirmed",
                    Source = "SA",
                    IPFGAccount = "NAME : P3059 SURNAME : P3059",
                    BranchAccount = "สาขาบิ๊กซี รัตนาธิเบศร์",
                    CardID = "IDAAAA",
                    OfficerID = "P3705",
                    SPRRate = "0.008000",
                    Count = "Y",
                    SPRRateAmount = "33.453280",
                    SPRRateGL = "0",
                    SPRRateGLAmount = "0",
                    FEELHFG = "N",
                    EM_CODE = "03705",
                    CC_CODE = "093",
                    GROUP = "",
                    SECTER = "Omni Channel Management",
                    DEPARTMENT = "ภาคธุรกิจสาขากรุงเทพ",
                    UNIT = "เขตธุรกิจสาขาบางแค",
                    DIVISION = "สาขาเซ็นทรัลปิ่นเกล้า",
                    SECTION = "",
                    OP_TNAME = ""
                },
            };

            return Content(HttpStatusCode.OK, transaction.TransactionInfo, Configuration.Formatters.XmlFormatter);
        }
        //[Route("api/user/roles/org2")]
        //public IHttpActionResult GetRoleOrg2(string role_code, string staff_no)
        //{
        //    RoleOrgModel[] department;
        //    RoleOrgModel[] subDepartment;
        //    RoleOrgModel[] unitLeader;
        //    RoleOrgModel[] unit;

        //    try
        //    {
        //        var org = _user.GetRoleOrg(role_code, staff_no);
        //        if (org.First().ROLE_PARENT != null)
        //        {
        //            var org2 = _user.GetRoleOrg(org.First().ROLE_PARENT).ToArray();
        //            if (org2.First().ROLE_PARENT != null)
        //            {
        //                var org3 = _user.GetRoleOrg(org2.First().ROLE_PARENT).ToArray();
        //                department = (from d in org3 where d.ROLE_LEVEL == 1 select d).ToArray();
        //                subDepartment = (from s in org3 where s.ROLE_LEVEL == 2 select s).ToArray();
        //                unit = (from u in org3 where u.ROLE_LEVEL == 3 select u).ToArray();
        //                return Json(new { department, subDepartment, unit });
        //            }
        //            else
        //            {
        //                department = (from d in org2 where d.ROLE_LEVEL == 1 select d).ToArray();
        //                subDepartment = (from s in org2 where s.ROLE_LEVEL == 2 select s).ToArray();
        //                unit = (from u in org2 where u.ROLE_LEVEL == 3 select u).ToArray();
        //                return Json(new { department, subDepartment, unit });
        //            }
        //        }
        //        else
        //        {
        //            department = (from d in org where d.ROLE_LEVEL == 1 select d).ToArray();
        //            subDepartment = (from s in org where s.ROLE_LEVEL == 2 select s).ToArray();
        //            unit = (from u in org where u.ROLE_LEVEL == 3 select u).ToArray();
        //            return Json(new { department, subDepartment, unit });
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        ModelState.AddModelError("Exception", e.Message);
        //        return InternalServerError(e);
        //    }
        //}
    }
}
