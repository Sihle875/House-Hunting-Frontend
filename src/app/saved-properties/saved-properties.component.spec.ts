import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedPropertiesComponent } from './saved-properties.component';

describe('SavedPropertiesComponent', () => {
  let component: SavedPropertiesComponent;
  let fixture: ComponentFixture<SavedPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedPropertiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
