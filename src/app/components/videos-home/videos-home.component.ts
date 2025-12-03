import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videos-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videos-home.component.html',
  styleUrls: ['./videos-home.component.scss']
})
export class VideosHomeComponent {
  videos = [
    { title: 'Agro y Jardinería', src: 'assets/videos/video1.mp4' },
    { title: 'Limpieza y Hogar', src: 'assets/videos/video2.mp4' },
    { title: 'Maquinaria y Motores', src: 'assets/videos/video3.mp4' },
    { title: 'Construcción e Industria', src: 'assets/videos/video4.mp4' },
    { title: 'Sistemas de Agua y Bombeo', src: 'assets/videos/video5.mp4' }
  ];

  get limitedVideos() {
    return this.videos.slice(0, 3);
  }
}
