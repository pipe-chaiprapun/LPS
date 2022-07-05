using LPS_Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface ITokenService
    {
        string GenerateAccessToken(string username, string ip);
        UserModel VerifyAccessToken(string token);
        string GenerateAccessToken_SP(string username, string ip);
        void SetTokenExpiration(string staff_no, int expire);
    }
}
