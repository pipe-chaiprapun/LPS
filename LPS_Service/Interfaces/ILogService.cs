using LPS_Service.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LPS_Service.Interfaces
{
    interface ILogService
    {
        void logSignin(LPS_LOG_SIGNIN log);
    }
}
