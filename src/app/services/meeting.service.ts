import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Meeting, Room } from '../models/meeting.model';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {

  private apiUrl = 'http://localhost:3000/meetings'; 

  private roomsUrl = 'http://localhost:3000/rooms';

  constructor(private http: HttpClient) {}

  // Get all meetings
  public getMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(this.apiUrl);
  }

  public getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.roomsUrl);
  }

  // Book a meeting room
  public bookMeeting(meetingData: Meeting): Observable<any> {
    return this.http.post<any>(this.apiUrl, meetingData);
  }

  // Delete a scheduled meeting
  public deleteMeeting(meetingId: undefined | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${meetingId}`);
  }
}
