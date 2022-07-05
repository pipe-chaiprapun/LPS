using LPS_Service.Helpers;
using LPS_Service.Interfaces;
using LPS_Service.Models.Account;
using LPS_Service.Services;
using System;
using System.Web.Http;

namespace LPS_Service.Controllers
{
    public class AccountController : ApiController
    {
        private IAccountService _account;

        private AccountController()
        {
            this._account = new AccountService();
        }

        [Route("api/account/productGroup")]
        public IHttpActionResult GetProductGroup(string cif)
        {
            try
            {
                var productGroup = _account.GetProductGroup(cif);
                return Json(productGroup);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Route("api/account/loanlimit")]
        public IHttpActionResult PostLoanLimit([FromBody]LoanLimitFilterModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var loans = _account.GetLoanLimit(value);
                    return Json(loans);
                }
                catch(Exception e)
                {
                    ModelState.AddModelError("Exception", e.Message);
                    return InternalServerError(e);
                }
            }
            return BadRequest(ModelState.GetErrorModelState());
        }
        [Route("api/account/loanlimit/detail")]
        public IHttpActionResult GetLoanlimitDetail(string cif_no)
        {
            try
            {
                var details = _account.GetLoanLimitDetail(cif_no);
                return Json(details);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize]
        [Route("api/account/loan")]
        public IHttpActionResult PostLoanAccount([FromBody]LoanAccountFilterModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var accounts = this._account.GetLoanAccount(value);
                    return Json(accounts);
                }
                catch (Exception e)
                {
                    ModelState.AddModelError("Exception", e.Message);
                    return InternalServerError(e);
                }
            }
            return BadRequest(ModelState.GetErrorModelState());
        }

        [Route("api/account/collateral")]
        public IHttpActionResult GetAccountCollateral(string account_no)
        {
            try
            {
                var collaterals = _account.GetAccountCollateral(account_no);
                return Json(collaterals);
            }
            catch(Exception e)
            {
                ModelState.AddModelError("Exception", e.Message);
                return InternalServerError(e);
            }
        }
        [Route("api/account/collateral")]
        public IHttpActionResult PostAccountCollateral([FromBody]CollateralFilterModel value)
        {
            try
            {
                var collaterals = _account.GetAccountCollateral2(value);
                return Json(collaterals);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Authorize]
        [Route("api/account/deposit")]
        public IHttpActionResult PostDepositAccount([FromBody]DepositAccountFilterModel value)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var accounts = this._account.GetDepositAccount(value);
                    return Json(accounts);
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
        [Route("api/account/relation")]
        public IHttpActionResult GetAccountRelation(string account)
        {
            try
            {
                var rel = _account.GetAccountRelation(account);
                return Json(rel);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        }

        [Route("api/account/service")]
        public IHttpActionResult GetAccountService(string cif)
        {
            try
            {
                var service = this._account.GetAccountService(cif);
                return Json(service);
            }
            catch(Exception e)
            {
                return InternalServerError(e);
            }
        } 
    }
}
