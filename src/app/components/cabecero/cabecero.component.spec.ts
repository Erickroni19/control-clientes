import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabeceroComponent } from './cabecero.component';

describe('CabeceroComponent', () => {
  let component: CabeceroComponent;
  let fixture: ComponentFixture<CabeceroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CabeceroComponent]
    });
    fixture = TestBed.createComponent(CabeceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
