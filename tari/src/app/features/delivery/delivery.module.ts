import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DeliveryDashboardComponent } from './delivery-dashboard.component';
import { GoogleMapsModule } from '@angular/google-maps';

const routes: Routes = [{ path: '', component: DeliveryDashboardComponent }];

@NgModule({
  declarations: [DeliveryDashboardComponent],
  imports: [SharedModule, GoogleMapsModule, RouterModule.forChild(routes)]
})
export class DeliveryModule {}
