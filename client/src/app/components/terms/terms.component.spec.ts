import { ComponentFixture, TestBed } from '@angular/core/testing';

import { termsComponent } from './terms.component';

describe('RulesComponent', () => {
  let component: termsComponent;
  let fixture: ComponentFixture<termsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [termsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(termsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
