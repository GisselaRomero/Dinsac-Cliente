import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosTodosComponent } from './productos-todos.component';

describe('ProductosTodosComponent', () => {
  let component: ProductosTodosComponent;
  let fixture: ComponentFixture<ProductosTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
