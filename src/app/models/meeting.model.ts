export interface Meeting {
    id?: number;
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
    username: '',
    room: '',
    date: '',
    timeFrom: '',
    timeTo: '',
    agenda: '',
  };  
  