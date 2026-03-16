import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TrackingComponent } from './tracking.component';
import { MatStepperModule } from '@angular/material/stepper';
import { GoogleMapsModule } from '@angular/google-maps';

const routes: Routes = [{ path: ':orderId', component: TrackingComponent }];

@NgModule({
  declarations: [TrackingComponent],
  imports: [SharedModule, MatStepperModule, GoogleMapsModule, RouterModule.forChild(routes)]
})
export class TrackingModule {}
