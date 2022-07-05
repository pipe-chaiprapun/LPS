import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRouting } from './app.routing';
import { SharedsModule } from './shareds/shareds.module';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRouting,
    SharedsModule,
    RouterModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    HttpClientModule
    // UserIdleModule.forRoot({ idle: 6, timeout: 6 })
  ],
  providers: [
    // { provide: APP_BASE_HREF, useValue: '/' },
    // { provide: LocationStrategy, useClass: HashLocationStrategy }
    AuthGuard,
    DecimalPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { constructor() { console.log('Loaded App Module'); } }
