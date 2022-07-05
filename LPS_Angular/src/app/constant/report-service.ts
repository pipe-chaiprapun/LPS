export const ReportService = {
    LocalHost: {
        Host: 'http://plachado-s540',
        Port: '80',
        Directory: {
            Summary: 'ReportServer/Pages/ReportViewer.aspx?%2fSummary',
            ListCustomer: 'ReportServer/Pages/ReportViewer.aspx?%2fList_Customer',
            CustomerInfo: 'ReportServer/Pages/ReportViewer.aspx?%2fCustomer_Info'
        }
    },
    Development: {
        Host: 'http://w2sqldho115edw',
        Port: '80',
        Directory: {
            Summary: 'LPSReport/Pages/ReportViewer.aspx?%2fSummary',
            ListCustomer: 'LPSReport/Pages/ReportViewer.aspx?%2fList_Customer',
            CustomerInfo: 'LPSReport/Pages/ReportViewer.aspx?%2fCustomer_Info'
        }
    }
};

