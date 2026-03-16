import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MenuComponent } from './menu.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuService } from './menu.service';

const routes: Routes = [{ path: '', component: MenuComponent }];

@NgModule({
  declarations: [MenuComponent],
  imports: [SharedModule, MatChipsModule, MatSidenavModule, RouterModule.forChild(routes)],
  exports: [MenuComponent],
  providers: [MenuService]
})
export class MenuModule {}
