using Jose;
using LPS_Service.Interfaces;
using LPS_Service.Models;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;

namespace LPS_Service.Services
{
    public class JwtService
    {
        private byte[] _secretKey = Encoding.UTF8.GetBytes("LPS_LH-Bank");
        private static string _adHost = WebConfigurationManager.AppSettings["ADHost"].ToString();
        private static int _tokenExp = int.Parse(WebConfigurationManager.AppSettings["TokenExp"]);
        private readonly string url = $"LDAP://{_adHost}/dc=lhb,dc=net";

        public string GenerateAccessToken(string username, string ip)
        {
            JwtPayloadModel payload = new JwtPayloadModel
            {
                username = username,
                exp = DateTime.UtcNow.AddMinutes(_tokenExp)
            };

            return JWT.Encode(payload, this._secretKey, JwsAlgorithm.HS256);
        }
        public UserModel VerifyAccessToken(string token)
        {
            try
            {
                JwtPayloadModel payload = JWT.Decode<JwtPayloadModel>(token, this._secretKey);

                if (payload == null)
                    return null;
                if (payload.exp < DateTime.UtcNow)
                    return null;

                return new UserModel
                {
                    username = payload.username
                };
            }
            catch
            {
                return null;
            }
        }
        public string GetUserFromToken(string token)
        {
            try
            {
                JwtPayloadModel payload = JWT.Decode<JwtPayloadModel>(token, this._secretKey);

                if (payload == null)
                    return null;

                return payload.username;
            }
            catch
            {
                return null;
            }
        }
    }
}