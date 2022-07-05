import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SharedsModule } from 'src/app/shareds/shareds.module';
import { RouterModule } from '@angular/router';
import { ReportRouting } from './report.routing';
import { OdStatementComponent } from './components/od-statement/od-statement.component';



@NgModule({
  declarations: [OdStatementComponent],
  imports: [
    CommonModule,
    ReportRouting,
    HttpClientModule,
    SharedsModule,
    RouterModule
  ]
})
export class ReportModule { constructor() { console.log('Loaded Report Module'); } }
