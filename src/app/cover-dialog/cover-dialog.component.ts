import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import {Track} from '../track';

@Component({
  selector: 'hs-cover-dialog',
  templateUrl: './cover-dialog.component.html',
  styleUrls: ['./cover-dialog.component.css']
})
export class CoverDialogComponent implements OnInit {
  constructor(
      public dialogRef: MatDialogRef<CoverDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public track: Track) {}

  ngOnInit() {}
}
