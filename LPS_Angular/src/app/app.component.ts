import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    // this.router.events.subscribe(event => {
    //   if (event instanceof RouteConfigLoadStart) {
    //     Swal.fire({
    //       titleText: 'Loading Module',
    //       icon: 'info',
    //       timerProgressBar: true,
    //       allowOutsideClick: false,
    //       showConfirmButton: false,
    //       onOpen: () => Swal.showLoading()
    //     });
    //   } else if (event instanceof RouteConfigLoadEnd) {
    //     Swal.close();
    //   }
    // });
  }
}
