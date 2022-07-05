using LPS_Service.Models;
using LPS_Service.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface IAuthenService
    {
        UserModel VerifyUsernamePassword(LoginModel value, string ip, bool adLogin, bool production);
        MasterDataModel[] GetMasterData();
    }
}
