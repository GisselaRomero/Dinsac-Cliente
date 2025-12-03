import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotPruebaComponent } from './chatbot-prueba.component';

describe('ChatbotPruebaComponent', () => {
  let component: ChatbotPruebaComponent;
  let fixture: ComponentFixture<ChatbotPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotPruebaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
