import { Pipe, PipeTransform, inject } from '@angular/core';
import { HttpPaths } from '../services/http-paths';

@Pipe({
  name: 'absoluteUrl',
  standalone: true
})
export class AbsoluteUrlPipe implements PipeTransform {
  private httpPaths = inject(HttpPaths);

  transform(value: string): string {
    if (value && !value.startsWith('http')) {
      return this.httpPaths.baseApiUrl + value;
    }
    return value;
  }

}