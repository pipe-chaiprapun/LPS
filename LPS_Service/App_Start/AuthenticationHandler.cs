using LPS_Service.Interfaces;
using LPS_Service.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace LPS_Service.App_Start
{
    public class AuthenticationHandler : DelegatingHandler
    {
        private ITokenService _tokenService;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var authorization = request.Headers.Authorization;
            if (authorization != null)
            {
                string token = authorization.Parameter;
                string tokenType = authorization.Scheme;
                if (tokenType.Equals("Bearer"))
                {
                    _tokenService = new DbTokenService();
                    var userFound = _tokenService.VerifyAccessToken(token);
                    if (userFound != null)
                    {
                        var userLogin = new UserLogin(new GenericIdentity(userFound.username), userFound.role);
                        userLogin.User = userFound;
                        Thread.CurrentPrincipal = userLogin;
                        HttpContext.Current.User = userLogin;
                    }
                }
            }
            return base.SendAsync(request, cancellationToken);
        }
    }
}