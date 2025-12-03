import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorComponent } from './explor.component';

describe('ExplorComponent', () => {
  let component: ExplorComponent;
  let fixture: ComponentFixture<ExplorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
