import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoFilter',
  standalone: true
})
export class VideoFilterPipe implements PipeTransform {
  transform(videos: any[], category: string): any[] {
    if (!category) return videos;
    return videos.filter(video => video.category === category);
  }
}
