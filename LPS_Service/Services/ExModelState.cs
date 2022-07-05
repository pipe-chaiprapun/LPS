using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.ModelBinding;

namespace LPS_Service.Services
{
    public static class ExModelState
    {
        // config model state error
        public static string GetErrorModelState(this ModelStateDictionary state)
        {
            var modelVal = state.Values.Select(e => e.Errors).Where(value => value.Count() > 0)
                .FirstOrDefault();

            if (modelVal == null) return null;

            return modelVal.FirstOrDefault().ErrorMessage;
        }

        // config error inner exception
        public static Exception GetExceptionError(this Exception exception)
        {
            if (exception.InnerException != null)
                return exception.InnerException.GetExceptionError();

            return exception;
        }
    }
}