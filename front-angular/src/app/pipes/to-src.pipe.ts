import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
  name: 'toSrc',
  standalone: true
})
export class ToSrcPipe implements PipeTransform {
  transform (value: File | Blob): string {
    return URL.createObjectURL(value)
  }
}
