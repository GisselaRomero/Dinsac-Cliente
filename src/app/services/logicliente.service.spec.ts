import { TestBed } from '@angular/core/testing';

import { LogiclienteService } from './logicliente.service';

describe('LogiclienteService', () => {
  let service: LogiclienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogiclienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
