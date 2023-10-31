import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionComponent } from './configuracion.component';

describe('ConfiguracionComponent', () => {
  let component: ConfiguracionComponent;
  let fixture: ComponentFixture<ConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfiguracionComponent]
    });
    fixture = TestBed.createComponent(ConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
