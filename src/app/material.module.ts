import { NgModule } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

// here are angular material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const materialModules = [
  MatToolbarModule,
  MatIconModule,
  MatSliderModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatDividerModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatSelectModule,
  MatTabsModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatDatepickerModule,
  MatTableModule,
  MatTreeModule,
  MatRadioGroup,
  MatRadioButton,
  MatStepperModule,
  NgOptimizedImage,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports: [...materialModules],
  exports: [...materialModules],
})
export class MaterialModule {}
