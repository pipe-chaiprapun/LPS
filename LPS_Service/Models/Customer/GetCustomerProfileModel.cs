namespace LPS_Service.Models.Customer
{
    public class GetCustomerProfileModel
    {
        public SpCustomerProfileModel[] loans { get; set; }
        public SpCustomerProfileModel[] deposits { get; set; }
        public SpCustomerProfileModel collateral { get; set; }
        public SpCustomerProfileModel mortgage { get; set; }
        public SpCustomerProfileModel[] fees { get; set; }
        public SpCustomerProfileModel nii_acc { get; set; }
        public SpCustomerProfileModel nii_ytd { get; set; }
    }
}