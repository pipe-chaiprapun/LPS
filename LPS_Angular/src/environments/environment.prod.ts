export const environment = {
  production: true,
  // apiHost: 'https://w2wasdho115edw'          // Development Server,
  // apiHost: 'http://w2wasuho115edw:8080'      // UAT Server
  // apiHost: 'https://w2waspho160lps:443'         // Production Server
  apiHost: 'https://4b6b-2001-fb1-148-c8c8-790c-4acd-494c-134b.ngrok.io'
  ,
  reportServer: {
    host: 'http://w2sqldho115edw',
    port: '80',
    directory: {
      summary: 'LPSReport/Pages/ReportViewer.aspx?%2fSummary',
      listCustomer: 'LPSReport/Pages/ReportViewer.aspx?%2fList_Customer',
      customerInfo: 'LPSReport/Pages/ReportViewer.aspx?%2fCustomer_Info'
    },
    configuration: {
      pageZoom: {
        pageWidth: 'rc:Zoom=page%20width',
        wholePage: 'rc:Zoom=whole%20page',
        500: 'rc:Zoom=500',
        200: 'rc:Zoom=200',
        150: 'rc:Zoom=150',
        100: 'rc:Zoom=100',
        75: 'rc:Zoom=75',
        50: 'rc:Zoom=50',
        25: 'rc:Zoom=25',
        10: 'rc:Zoom=10'
      },
      toolBar: {
        visible: 'rc:Toolbar=true',
        invisible: 'rc:Toolbar=false'
      }
    }
  }
};

// rc:Zoom=page%20width
