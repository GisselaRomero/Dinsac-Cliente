import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoFilterPipe } from '../../../pipes/video-filter.pipe'; // ✅ correcto
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-videos-page',
  standalone: true,
  imports: [CommonModule, VideoFilterPipe, FormsModule],
  templateUrl: './videos-page.component.html',
  styleUrls: ['./videos-page.component.scss']
})
export class VideosPageComponent {
  selectedCategory: string = '';

  categories: string[] = [
    'Agro y Jardinería',
    'Limpieza y Hogar',
    'Maquinaria y Motores',
    'Construcción e Industria',
    'Sistemas de Agua y Bombeo'
  ];

  videos = [
    { title: 'Agro y Jardinería', src: 'assets/videos/video1.mp4', category: 'Agro y Jardinería' },
    { title: 'Limpieza y Hogar', src: 'assets/videos/video2.mp4', category: 'Limpieza y Hogar' },
    { title: 'Maquinaria y Motores', src: 'assets/videos/video3.mp4', category: 'Maquinaria y Motores' },
    { title: 'Construcción e Industria', src: 'assets/videos/video4.mp4', category: 'Construcción e Industria' },
    { title: 'Sistemas de Agua y Bombeo', src: 'assets/videos/video5.mp4', category: 'Sistemas de Agua y Bombeo' }
  ];
}
