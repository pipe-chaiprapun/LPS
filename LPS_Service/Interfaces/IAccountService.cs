using LPS_Service.Models.Account;
using System.Collections.Generic;

namespace LPS_Service.Interfaces
{
    interface IAccountService
    {
        ProductGroupModel GetProductGroup(string cif);
        GetLoanAccountModel GetLoanAccount(LoanAccountFilterModel value);
        GetDepositAccountModel GetDepositAccount(DepositAccountFilterModel value);
        List<SpAccountRelationshipModel> GetAccountRelation(string account);
        List<SpServiceModel> GetAccountService(string cif);
        GetLoanLimitModel GetLoanLimit(LoanLimitFilterModel value);
        GetCollateralModel[] GetAccountCollateral(string account_no);
        GetCollateralModel[] GetAccountCollateral2(CollateralFilterModel value);
        CollateralDetailModel[] GetAccountCollateralDetail(string id);
        List<GetLoanlimitDetailModel2> GetLoanLimitDetail(string cif);
    }
}
