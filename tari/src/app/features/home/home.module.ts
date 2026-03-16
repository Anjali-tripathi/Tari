import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { LoginDialogComponent } from './login-dialog.component';
import { RegisterDialogComponent } from './register-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
  declarations: [HomeComponent, LoginDialogComponent, RegisterDialogComponent],
  imports: [SharedModule, MatTabsModule, RouterModule.forChild(routes)]
})
export class HomeModule {}
