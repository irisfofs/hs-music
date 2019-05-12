import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {Track} from '../track';

@Component({
  selector: 'hs-cover-dialog',
  templateUrl: './cover-dialog.component.html',
  styleUrls: ['./cover-dialog.component.css']
})
export class CoverDialogComponent implements OnInit {
  iframeSrc: SafeResourceUrl = '';

  constructor(
      public dialogRef: MatDialogRef<CoverDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public track: Track,
      private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://bandcamp.com/EmbeddedPlayer/album=${
            this.track
                .albumId}/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/artwork=none/track=${
            this.track.trackId}/transparent=true/`);
  }
}
