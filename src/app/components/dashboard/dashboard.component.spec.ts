import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MeetingService } from '../../services/meeting.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let meetingServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mock MeetingService
    meetingServiceMock = {
      getMeetings: jasmine.createSpy().and.returnValue(of([])), // Return empty meetings array
      bookMeeting: jasmine.createSpy().and.returnValue(of({})),
      deleteMeeting: jasmine.createSpy().and.returnValue(of({})),
    };

    // Mock Router
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: MeetingService, useValue: meetingServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize meetings on ngOnInit', () => {
    meetingServiceMock.getMeetings.and.returnValue(of([
      { id: 1, username: 'testUser', room: 'Room 1', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00', agenda: 'Test Meeting' }
    ]));
    component.ngOnInit();
    expect(component.meetings.length).toBeGreaterThan(0);
    expect(meetingServiceMock.getMeetings).toHaveBeenCalled();
  });

  it('should open the modal when openModal is called', () => {
    component.openModal();
    expect(component.isModalOpen).toBe(true);
  });

  it('should close the modal when closeModal is called', () => {
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it('should filter meetings by room when onRoomChange is called', () => {
    component.meetings = [
      { meetingId: "3", room: 'Room 1', agenda: 'Meeting 1', username: 'testUser', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00' },
      { meetingId: "4", room: 'Room 2', agenda: 'Meeting 2', username: 'testUser', date: '2024-12-10', timeFrom: '12:00', timeTo: '13:00' }
    ];
    component.selectedRoom = 'Room 1';
    component.onRoomChange();
    expect(component.filteredMeetings.length).toBe(1);
    expect(component.filteredMeetings[0].room).toBe('Room 1');
  });

  it('should filter user meetings by room', () => {
    component.selectedUserRoom = 'Room 1';
    component.filterUserMeetings();
    expect(component.filterCurrentUserMeetings.length).toBe(0); // Initially, there are no user meetings
  });

  it('should handle booking meeting failure gracefully', () => {
    const meetingData = { meetingId: "3", username: 'testUser', agenda: 'New Meeting', room: 'Room 1', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00' };
    meetingServiceMock.bookMeeting.and.returnValue(throwError('Error booking meeting'));
    spyOn(console, 'error'); // Spy on the console error
    component.handleBooking(meetingData);
    expect(console.error).toHaveBeenCalledWith('Failed to book meeting:', 'Error booking meeting');
  });

  it('should delete a meeting successfully', () => {
    const meetingData = { meetingId: "1", username: 'testUser', room: 'Room 1', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00', agenda: 'Test Meeting' };
    component.meetings = [meetingData];
    meetingServiceMock.deleteMeeting.and.returnValue(of({}));
    component.deleteMeeting(meetingData.meetingId);
    expect(meetingServiceMock.deleteMeeting).toHaveBeenCalledWith(meetingData.meetingId);
    expect(component.meetings.length).toBe(0); // Meeting should be removed
  });

  it('should handle meeting deletion failure gracefully', () => {
    const meetingData = { meetingId: "1", username: 'testUser', room: 'Room 1', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00', agenda: 'Test Meeting' };
    component.meetings = [meetingData];
    meetingServiceMock.deleteMeeting.and.returnValue(throwError('Error deleting meeting'));
    spyOn(console, 'error'); // Spy on the console error
    component.deleteMeeting(meetingData.meetingId);
    expect(console.error).toHaveBeenCalledWith('Failed to delete meeting:', 'Error deleting meeting');
  });

  it('should log out the user when logout is called', () => {
    spyOn(localStorage, 'clear');
    component.logout();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
