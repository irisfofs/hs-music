import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {CoverDialogComponent} from './cover-dialog/cover-dialog.component';
import {TimelineComponent} from './timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    CoverDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CoverDialogComponent],
})
export class AppModule {
}
