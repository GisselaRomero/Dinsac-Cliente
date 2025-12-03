import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videoFilter',
  standalone: true
})
export class VideoFilterPipe implements PipeTransform {
  transform(videos: any[], selectedCategory: string): any[] {
    if (!selectedCategory) return videos;
    return videos.filter(video => video.category === selectedCategory);
  }
}
