export interface ServiceAvailability {
  id: number;
  professional_id: number;
  day_of_week: string;
  start_time: string; // ISO string format: "21:49:52.374Z"
  end_time: string;   // ISO string format: "21:49:52.374Z"
}

export interface ServiceAvailabilityCreateData {
  professional_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface ServiceAvailabilityUpdateData {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface ServiceAvailabilityListResponse {
  items: ServiceAvailability[];
  total: number;
}

// Days of week constants
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Maximum slots allowed
export const MAX_AVAILABILITY_SLOTS = 7;

// Helper function to convert Time to string
export const timeToString = (time: Date): string => {
  return time.toISOString().split('T')[1].split('.')[0] + 'Z';
};

// Helper function to parse time string
export const parseTimeString = (timeString: string): Date => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds || 0);
  return date;
};

// Helper function to format time for display
export const formatTimeForDisplay = (timeString: string): string => {
  const time = parseTimeString(timeString);
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Helper function to get Nepali day names
export const getDayNameInNepali = (day: string): string => {
  const dayMap: Record<string, string> = {
    'Sunday': 'आइतबार',
    'Monday': 'सोमबार',
    'Tuesday': 'मङ्गलबार',
    'Wednesday': 'बुधबार',
    'Thursday': 'बिहिबार',
    'Friday': 'शुक्रबार',
    'Saturday': 'शनिबार',
  };
  return dayMap[day] || day;
};