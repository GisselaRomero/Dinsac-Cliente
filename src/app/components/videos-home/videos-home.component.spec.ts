import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosHomeComponent } from './videos-home.component';

describe('VideosHomeComponent', () => {
  let component: VideosHomeComponent;
  let fixture: ComponentFixture<VideosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideosHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
