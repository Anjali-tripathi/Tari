import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { AddressesComponent } from './addresses.component';
import { OrderHistoryComponent } from './order-history.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

const routes: Routes = [
  {
    path: '', component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: 'orders', component: OrderHistoryComponent },
      { path: 'addresses', component: AddressesComponent }
    ]
  }
];

@NgModule({
  declarations: [ProfileComponent, AddressesComponent, OrderHistoryComponent],
  imports: [SharedModule, MatTabsModule, MatExpansionModule, RouterModule.forChild(routes)]
})
export class ProfileModule {}
