import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Meeting, MeetingInitialState, Room } from "../../models/meeting.model";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnChanges, OnInit {

  @Input() 
  public isOpen: boolean = false;
  
  @Input() 
  public title: string = '';
  
  @Output() 
  public closeModal = new EventEmitter<void>();
  
  @Output() 
  public bookMeeting = new EventEmitter<any>();
  
  @Input()
  public meetings: Meeting[] = []; 

  public currentMeet: Meeting = MeetingInitialState;

  public errorMessage: string = '';

  public rooms: Room[] = [];

  constructor(private meetingService: MeetingService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.isOpen) {
      this.resetForm();  
    }
  }

  public ngOnInit(): void {
    // Fetch rooms data from the backend when the component initializes
    this.meetingService.getRooms().subscribe(rooms => {
      this.rooms = rooms;
    });

    const currentUser = localStorage.getItem('currentUser');
    this.currentMeet.username = currentUser || ''; // Set the current user's username
  }

  public close(): void {
    this.errorMessage = "";
    this.closeModal.emit();
  }

  public submit(): void {
    if (this.validateInputs()) {      
      const meetingData = {
        username: this.currentMeet.username,
        room: this.currentMeet.room,
        date: this.currentMeet.date,
        timeFrom: this.currentMeet.timeFrom,
        timeTo: this.currentMeet.timeTo,
        agenda: this.currentMeet.agenda
      };

      this.bookMeeting.emit(meetingData);
    }
  }

  public validateInputs(): boolean {
    const fromTime = new Date(`${this.currentMeet.date}T${this.currentMeet.timeFrom}`);
    const toTime = new Date(`${this.currentMeet.date}T${this.currentMeet.timeTo}`);
    const duration = (toTime.getTime() - fromTime.getTime()) / (1000 * 60); 

    if (this.currentMeet.agenda === '' 
        || this.currentMeet.date === '' 
        || this.currentMeet.room === '' 
        || this.currentMeet.timeFrom === '' 
        || this.currentMeet.timeTo === '') {
      this.errorMessage = 'All fields are required.';
      return false;
    }


    if (toTime <= fromTime) {
      this.errorMessage = 'The "To" time must be later than the "From" time.';
      return false;
    }

    // Ensure duration is at least 30 minutes
    if (duration < 30) {
      this.errorMessage = 'The meeting duration must be at least 30 minutes.';
      return false;
    }

    // Ensure the meeting is scheduled between 9:00 AM and 6:00 PM
    const minTime = new Date(`${this.currentMeet.date}T09:00:00`);
    const maxTime = new Date(`${this.currentMeet.date}T18:00:00`);
    if (fromTime < minTime || toTime > maxTime) {
      this.errorMessage = 'Meetings can only be scheduled between 9:00 AM and 6:00 PM.';
      return false;
    }

    // Ensure the date is a weekday
    const day = new Date(this.currentMeet.date).getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      this.errorMessage = 'Meetings can only be scheduled on weekdays (Monday to Friday).';
      return false;
    }

    // Check for room availability
    if (this.isRoomAvailable(this.currentMeet.room, this.currentMeet.date, this.currentMeet.timeFrom, this.currentMeet.timeTo)) {
      this.errorMessage = 'The selected room is already booked during this time slot.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

    // Check if the room is available for the selected time slot
    private isRoomAvailable(room: string, date: string, timeFrom: string, timeTo: string): boolean {
      const fromTime = new Date(`${date}T${timeFrom}`);
      const toTime = new Date(`${date}T${timeTo}`);
  
      // Check if the room is already booked at the same time
      return this.meetings.some(meeting => {
        const meetingFromTime = new Date(`${meeting.date}T${meeting.timeFrom}`);
        const meetingToTime = new Date(`${meeting.date}T${meeting.timeTo}`);
  
        return meeting.room === room &&
               meeting.date === date &&
               ((fromTime >= meetingFromTime && fromTime < meetingToTime) ||
                (toTime > meetingFromTime && toTime <= meetingToTime) ||
                (fromTime <= meetingFromTime && toTime >= meetingToTime));
      });
    }

  private resetForm(): void {
    this.currentMeet = MeetingInitialState;
    this.errorMessage = '';
  }
}
