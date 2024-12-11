export interface Meeting {
    meetingId: string;
    username: string;
    room: string;
    date: string;
    timeFrom: string;
    timeTo: string;
    agenda: string;
  }

  export interface Room {
    id: string;
    name: string;
  }

  export const MeetingInitialState = {
    meetingId: '',
    username: '',
    room: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    agenda: '',
  };  
  