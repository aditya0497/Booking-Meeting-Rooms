import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing'; // For testing routing

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Import RouterTestingModule for routing tests
      declarations: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to render the component
  });

  it('should create the app', () => {
    expect(app).toBeTruthy(); // Check if the component is created successfully
  });

  it(`should have as title 'book-meeting-room'`, () => {
    expect(app.title).toEqual('book-meeting-room'); // Check if the title is set correctly
  });

  it('should contain <router-outlet></router-outlet>', () => {
    const compiled = fixture.nativeElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy(); // Check if the <router-outlet> element is present
  });
});
