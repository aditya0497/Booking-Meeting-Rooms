import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingComponent } from './booking.component';
import { MeetingService } from '../../services/meeting.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MeetingInitialState } from "../../models/meeting.model";

describe('BookingComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;
  let mockMeetingService: any;

  beforeEach(async () => {
    mockMeetingService = {
      getRooms: jasmine.createSpy('getRooms').and.returnValue(of([{ id: 1, name: 'Room 1' }]))
    };

    await TestBed.configureTestingModule({
      declarations: [BookingComponent],
      imports: [FormsModule],
      providers: [{ provide: MeetingService, useValue: mockMeetingService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the booking component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form values when modal is opened', () => {
    component.currentMeet = {
      username: 'user1',
      room: 'Room 1',
      date: '2024-12-10',
      timeFrom: '10:00',
      timeTo: '11:00',
      agenda: 'Some agenda'
    };
    component.errorMessage = 'Some error';
    component.isOpen = true; // Simulate opening the modal
    component.ngOnChanges({
      isOpen: {
        previousValue: false,
        currentValue: true,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.currentMeet).toEqual(MeetingInitialState);
    expect(component.errorMessage).toBe('');
  });

  it('should fetch rooms data on initialization', () => {
    component.ngOnInit();
    expect(mockMeetingService.getRooms).toHaveBeenCalled();
    expect(component.rooms.length).toBe(1);
    expect(component.rooms[0].name).toBe('Room 1');
  });

  it('should validate inputs and return true for valid data', () => {
    component.currentMeet = {
      username: 'user1',
      room: 'Room 1',
      date: '2024-12-10',
      timeFrom: '10:00',
      timeTo: '11:00',
      agenda: 'Some agenda'
    };
    const isValid = component.validateInputs();
    expect(isValid).toBeTrue();
    expect(component.errorMessage).toBe('');
  });

  it('should emit booking data on valid submit', () => {
    spyOn(component.bookMeeting, 'emit');
    component.currentMeet = {
      username: 'user1',
      room: 'Room 1',
      date: '2024-12-10',
      timeFrom: '10:00',
      timeTo: '11:00',
      agenda: 'Some agenda'
    };
    component.submit();
    expect(component.bookMeeting.emit).toHaveBeenCalledWith(component.currentMeet);
  });

  it('should set error message for invalid meeting times', () => {
    component.currentMeet = {
      username: 'user1',
      room: 'Room 1',
      date: '2024-12-10',
      timeFrom: '11:00',
      timeTo: '10:00', // Invalid time
      agenda: 'Some agenda'
    };
    const isValid = component.validateInputs();
    expect(isValid).toBeFalse();
    expect(component.errorMessage).toBe('The "To" time must be later than the "From" time.');
  });
});
