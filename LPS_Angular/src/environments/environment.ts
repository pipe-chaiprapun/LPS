// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiHost: 'http://localhost:56540',
  // apiHost: 'http://w2wasuho115edw:8080',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
