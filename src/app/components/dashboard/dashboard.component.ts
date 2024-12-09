import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { Router } from '@angular/router';
import { Meeting } from 'src/app/models/meeting.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public isModalOpen: boolean = false;

  public isLoading: boolean = false;

  public meetings: any[] = []; // All meetings (user-specific and all users)

  public filteredRooms: string[] = []; // Rooms based on all meetings

  public filteredMeetings: any[] = []; // Meetings filtered by room selection

  public selectedRoom: string = ''; // Room selected by the user

  public currentUser = localStorage.getItem('currentUser'); 

  public userMeetingRooms: string[] = []; // Rooms based on user's upcoming meetings

  public filterCurrentUserMeetings: any[] = []; // Filtered user's upcoming meetings

  public selectedUserRoom: string = ''; // Selected room for filtering user meetings

  constructor(private meetingService: MeetingService, private router: Router) {}

  public ngOnInit(): void {
    this.loadAllMeetings();
  }

  public filterUserMeetings(): void {
    this.filterCurrentUserMeetings = this.selectedUserRoom
      ? this.getUserUpcomingMeetings().filter(
          (meeting) => meeting.room === this.selectedUserRoom
        )
      : this.getUserUpcomingMeetings();
  }

  // Filter meetings by selected room (for the "Room Meeting Details" section)
  public onRoomChange(): void {
    this.filteredMeetings = this.meetings.filter(meeting => meeting.room === this.selectedRoom);
  }

  public openModal(): void {
    this.isModalOpen = true;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }

  public handleBooking(meetingData: Meeting): void {
    this.meetingService.bookMeeting(meetingData).subscribe({
      next: (newMeeting) => {
        this.meetings.push(newMeeting);
        this.loadAllMeetings();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to book meeting:', err);
      }
    });
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  public deleteMeeting(meetingId: number): void {
    this.isLoading = true;
    this.meetingService.deleteMeeting(meetingId).subscribe({
      next: () => {
        // Remove the meeting from the main array
        this.meetings = this.meetings.filter((meeting) => meeting.id !== meetingId);
        
        // Update filtered lists immediately
        this.filterUserMeetings(); // Update user's filtered meetings
        this.onRoomChange(); // Update room-based filtered meetings
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to delete meeting:', err);
        alert('Failed to delete the meeting. Please try again.');
        this.isLoading = false;
      }
    });
  }

  // Filter meetings for the current logged-in user (for the "Upcoming Meetings" section)
  public getUserUpcomingMeetings(): any[] {
    return this.meetings.filter(meeting => meeting.username === this.currentUser);
  }
  
  private loadAllMeetings(): void {
    this.isLoading = true;
    
    // Get all meetings (regardless of the user)
    this.meetingService.getMeetings().subscribe({
      next: (data) => {
        // Store all meetings in the meetings array
        this.meetings = data;
        
        // Filter rooms from all meetings (based on unique rooms)
        this.filteredRooms = [...new Set(this.meetings.map(meeting => meeting.room))];
        this.selectedRoom = this.filteredRooms[0] || ''; // Default to the first room or empty
        this.userMeetingRooms = [
          ...new Set(
            this.getUserUpcomingMeetings().map((meeting) => meeting.room)
          ),
        ]; // Unique rooms for the current user
        this.selectedUserRoom = ''; // Reset filter
        this.filterCurrentUserMeetings = this.getUserUpcomingMeetings();
        this.onRoomChange(); // Filter meetings for the selected room
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load meetings:', err);
        this.isLoading = false;
      }
    });
  }
}
