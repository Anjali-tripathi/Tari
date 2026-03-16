import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ProductCardComponent } from './components/product-card/product-card.component';

// Pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { NewFooterComponent } from './components/new-footer/new-footer.component';
import { SearchComponent } from './components/search/search.component';

import { MatSidenavModule } from '@angular/material/sidenav';

const MATERIAL = [
  MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule,
  MatCardModule, MatChipsModule, MatBadgeModule, MatProgressSpinnerModule,
  MatMenuModule, MatDividerModule, MatTooltipModule, MatDialogModule,
  MatSelectModule, MatSnackBarModule, MatToolbarModule
];

const COMPONENTS = [NavbarComponent,  LoaderComponent, ProductCardComponent];
const PIPES = [CurrencyFormatPipe, TimeAgoPipe];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES, NewFooterComponent, ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, ...MATERIAL],
  exports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, NewFooterComponent,  ...MATERIAL, ...COMPONENTS, ...PIPES]
})
export class SharedModule {}


