using LPS_Service.Helpers;
using LPS_Service.Interfaces;
using LPS_Service.Models.Account;
using LPS_Service.Models.Customer;
using LPS_Service.Services;
using System;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace LPS_Service.Controllers
{
    public class CustomerController : ApiController
    {
        private ICustomerService _customer;
        //private ITokenService _jwtService;

        private CustomerController()
        {
            _customer = new CustomerService();
            //this._jwtService = new JwtService();
        }

        [Authorize]
        [Route("api/customer/customers")]
        public IHttpActionResult PostCustomer([FromBody]CustomerFilterModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //var currentUser = (UserLogin)HttpContext.Current.User;
                    //if(currentUser != null)
                    //{
                    var customers = _customer.GetCustomers(value);
                    return Json(customers);
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
            return BadRequest(ModelState.GetErrorModelState());
        }
        [Route("api/customer/groups")]
        public IHttpActionResult PostCustomerGroup([FromBody]CustomerGroupFilterModel value)
        {
            try
            {
                var groups = _customer.ListCustomerGroups(value);
                return Json(groups);
            }
            catch(Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [Route("api/customer/download")]
        public IHttpActionResult PostCustomerDownload([FromBody] CustomerFilterModel value)
        {
            try
            {
                var customers = _customer.DownloadCustomers(value);
                return Json(customers);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Authorize]
        [Route("api/customer/info")]
        public IHttpActionResult GetCustomerInfo(string cif)
        {
            try
            {
                var info = _customer.GetCustomerInfo(cif);
                return Json(info);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        //[Authorize]
        //[Route("api/customer/info")]
        //public IHttpActionResult GetCustomerInfo(string cif, string dept, string sub_dept, string unit, string staff_no)
        //{
        //    try
        //    {
        //        var info = _customer.GetCustomerInfo(cif, dept, sub_dept, unit, staff_no);
        //        return Json(info);
        //    }
        //    catch (Exception e)
        //    {
        //        ModelState.AddModelError("Exception", e.Message);
        //        return InternalServerError(e);
        //    }
        //}
        //[Authorize]
        //[Route("api/customer/info/watchlist")]
        //public IHttpActionResult GetCustomerWathlist(string cif)
        //{
        //    try
        //    {
        //        var watchlist = _customer.GetCustomerWatchList(cif);
        //        return Json(watchlist);
        //    }
        //    catch(Exception e)
        //    {
        //        ModelState.AddModelError("Exception", e.Message);
        //        return InternalServerError(e);
        //    }
        //}
        [Authorize]
        [Route("api/customer/group/detail")]
        public IHttpActionResult GetCustomerGroupDetail(string cif)
        {
            try
            {
                var groups = _customer.GetCustomerGroupDetail(cif);
                return Json(groups);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/customer/profile")]
        public IHttpActionResult GetCustomerProfile(string cif)
        {
            try
            {
                var profile = _customer.GetCustomerProfile(cif);
                return Json(profile);
            }
            catch (Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }

        [Route("api/customer/collateral")]
        public IHttpActionResult GetCustomerCollateral(string cif)
        {
            try
            {
                var collaterals = _customer.GetCustomerCollateral(cif);
                return Json(collaterals);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
        [Route("api/customer/collateral")]
        public IHttpActionResult PostCustomerCollateral([FromBody]CollateralFilterModel value)
        {
            try
            {
                var collaterals = _customer.GetCustomerCollateral2(value);
                return Json(collaterals);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Route("api/customer/collateral/detail")]
        public IHttpActionResult GetCustomerCollateralDetail(string id)
        {
            try
            {
                var collaterals = _customer.GetCustomerCollateralDetail(id);
                return Json(collaterals);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
