import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatClienteComponent } from './chat-cliente.component';

describe('ChatClienteComponent', () => {
  let component: ChatClienteComponent;
  let fixture: ComponentFixture<ChatClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
