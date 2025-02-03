import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl', standalone: true }) // Standalone to use in component imports
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
