import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinhabibliotecaPage } from './minhabiblioteca.page';

describe('MinhabibliotecaPage', () => {
  let component: MinhabibliotecaPage;
  let fixture: ComponentFixture<MinhabibliotecaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MinhabibliotecaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
