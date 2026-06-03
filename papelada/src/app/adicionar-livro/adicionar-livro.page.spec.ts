import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdicionarLivroPage } from './adicionar-livro.page';

describe('AdicionarLivroPage', () => {
  let component: AdicionarLivroPage;
  let fixture: ComponentFixture<AdicionarLivroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionarLivroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
