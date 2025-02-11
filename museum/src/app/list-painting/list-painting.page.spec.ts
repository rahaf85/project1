import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPaintingPage } from './list-painting.page';

describe('ListPaintingPage', () => {
  let component: ListPaintingPage;
  let fixture: ComponentFixture<ListPaintingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaintingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
