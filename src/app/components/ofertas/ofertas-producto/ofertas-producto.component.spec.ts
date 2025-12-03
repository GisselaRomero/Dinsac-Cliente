import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasProductoComponent } from './ofertas-producto.component';

describe('OfertasProductoComponent', () => {
  let component: OfertasProductoComponent;
  let fixture: ComponentFixture<OfertasProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
