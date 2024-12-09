import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MeetingService } from './meeting.service';
import { Meeting, Room } from '../models/meeting.model';

describe('MeetingService', () => {
  let service: MeetingService;
  let httpMock: HttpTestingController;

  const mockMeetings: Meeting[] = [
    { id: 1, username: 'user1', room: 'Room 1', date: '2024-12-10', timeFrom: '10:00', timeTo: '11:00', agenda: 'Agenda 1' },
    { id: 2, username: 'user2', room: 'Room 2', date: '2024-12-11', timeFrom: '14:00', timeTo: '15:00', agenda: 'Agenda 2' },
  ];

  const mockRooms: Room[] = [
    { id: "1", name: 'Room 1' },
    { id: "2", name: 'Room 2' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MeetingService],
    });
    service = TestBed.inject(MeetingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all meetings', () => {
    service.getMeetings().subscribe((meetings) => {
      expect(meetings).toEqual(mockMeetings);
    });

    const req = httpMock.expectOne('http://localhost:3000/meetings');
    expect(req.request.method).toBe('GET');
    req.flush(mockMeetings); // Simulate the response
  });

  it('should fetch all rooms', () => {
    service.getRooms().subscribe((rooms) => {
      expect(rooms).toEqual(mockRooms);
    });

    const req = httpMock.expectOne('http://localhost:3000/rooms');
    expect(req.request.method).toBe('GET');
    req.flush(mockRooms); // Simulate the response
  });

  it('should book a meeting room', () => {
    const newMeeting: Meeting = {
      id: 3,
      username: 'user3',
      room: 'Room 3',
      date: '2024-12-12',
      timeFrom: '12:00',
      timeTo: '13:00',
      agenda: 'New Meeting',
    };

    service.bookMeeting(newMeeting).subscribe((response) => {
      expect(response).toEqual(newMeeting);
    });

    const req = httpMock.expectOne('http://localhost:3000/meetings');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMeeting);
    req.flush(newMeeting); // Simulate the response
  });

  it('should delete a meeting', () => {
    const meetingId = 1;

    service.deleteMeeting(meetingId).subscribe((response) => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`http://localhost:3000/meetings/${meetingId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true }); // Simulate the response
  });
});
