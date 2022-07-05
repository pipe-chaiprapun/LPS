using LPS_Service.Entity;
using LPS_Service.Interfaces;
using LPS_Service.Models;
using LPS_Service.Services;
using System;
using System.DirectoryServices;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Routing;

namespace LPS_Service.Controllers
{
    public class AuthorizationController : ApiController
    {
        private IAuthenService _authen;
        private ITokenService _token;
        private ILogService _log;

        private AuthorizationController()
        {
            _authen = new AuthenService();
            //this._token = new JwtService();
            _token = new DbTokenService();
            _log = new LogService();
        }

        [Route("api/authorization/login")]
        //public IHttpActionResult PostLogin2([FromBody]LoginModel value)
        public IHttpActionResult PostLogin()
        {
            var authHeader = HttpContext.Current.Request.Headers["Authorization"];

            //if (ModelState.IsValid)
            if (!string.IsNullOrEmpty(authHeader) && authHeader.Contains("Basic"))
            {
                var ip = HttpContext.Current.Request.UserHostAddress;

                Encoding encoding = Encoding.GetEncoding("iso-8859-1");
                authHeader = authHeader.Replace("Basic", "").Trim();
                string userPass = encoding.GetString(Convert.FromBase64String(authHeader));
                var value = new LoginModel { username = userPass.Split(':')[0], password = userPass.Split(':')[1] };

                if (string.IsNullOrEmpty(value.username))
                    return BadRequest("Invalid username or password");

                try
                {
                    var production = bool.Parse(WebConfigurationManager.AppSettings["Production"]);
                    var adLogin = bool.Parse(WebConfigurationManager.AppSettings["ADLogin"]);
                    var user = _authen.VerifyUsernamePassword(value, ip, adLogin, production);
                    if (user != null)
                    {
                        if (user.status != "N")
                        {
                            if (user.roles.Length > 0)
                            {
                                _log.logSignin(new LPS_LOG_SIGNIN
                                {
                                    EMPLOYEE_ID = value.username,
                                    EMPLOYEE_NAME = user.name,
                                    IP = ip,
                                    TIME = DateTime.Now,
                                    REMARK = "Success"
                                });
                                return Json(new { user, accessToken = _token.GenerateAccessToken(value.username.ToUpper(), ip) });
                            }
                            else
                            {
                                _log.logSignin(new LPS_LOG_SIGNIN
                                {
                                    EMPLOYEE_ID = value.username.ToUpper(),
                                    EMPLOYEE_NAME = user.name,
                                    IP = ip,
                                    TIME = DateTime.Now,
                                    REMARK = "Failure, No role!"
                                });
                                return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                                {
                                    Content = new StringContent("Your role is unauthorized!")
                                });
                            }
                        }
                        _log.logSignin(new LPS_LOG_SIGNIN
                        {
                            EMPLOYEE_ID = value.username.ToUpper(),
                            EMPLOYEE_NAME = user.name,
                            IP = ip,
                            TIME = DateTime.Now,
                            REMARK = "Failure, User Account has been Disabled!"
                        });
                        return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                        {
                            Content = new StringContent("Your Account has been Disabled!")
                        });
                    }

                    _log.logSignin(new LPS_LOG_SIGNIN { EMPLOYEE_ID = value.username, IP = ip, TIME = DateTime.Now, REMARK = "Failure, Invalid Username or Password!" });
                    return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                    {
                        Content = new StringContent("Invalid username or password!")
                    });
                }
                catch (DirectoryServicesCOMException e)
                {
                    if (e.ErrorCode == -2147023570)
                    {
                        _log.logSignin(new LPS_LOG_SIGNIN { EMPLOYEE_ID = value.username, IP = ip, TIME = DateTime.Now, REMARK = "Failure, Invalid Username or Password!" });
                        return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                        {
                            Content = new StringContent("Invalid username or password!")
                        });
                    }
                    _log.logSignin(new LPS_LOG_SIGNIN { EMPLOYEE_ID = value.username, IP = ip, TIME = DateTime.Now, REMARK = "Failure, " + e.Message });
                    return ResponseMessage(new HttpResponseMessage(HttpStatusCode.Unauthorized)
                    {
                        Content = new StringContent(e.Message)
                    });
                }
                catch (COMException e)
                {
                    _log.logSignin(new LPS_LOG_SIGNIN { EMPLOYEE_ID = value.username, IP = ip, TIME = DateTime.Now, REMARK = "Failure, Domain Server " + e.Message });
                    return InternalServerError(e);
                }
                catch (Exception e)
                {
                    _log.logSignin(new LPS_LOG_SIGNIN { EMPLOYEE_ID = value.username, IP = ip, TIME = DateTime.Now, REMARK = "Failure, " + e.Message });
                    //ModelState.AddModelError("Exception", e.Message);
                    return InternalServerError(e);
                }
            }
            return BadRequest(ModelState.GetErrorModelState());
        }
        [Route("api/authorization/masterdata")]
        public IHttpActionResult GetMasterData()
        {
            try
            {
                var res = _authen.GetMasterData();
                return Json(res);
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
        }
    }
}
