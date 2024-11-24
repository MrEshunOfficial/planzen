// TypeScript Interfaces
export enum EventType {
  TODO = 'todo',
  ROUTINE = 'routine',
  SPECIAL_EVENT = 'special-event',
  APPOINTMENT = 'appointment'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum RepeatType {
  NO_REPEAT = 'no-repeat',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom'
}

export enum EndRepeatOption {
  NEVER = 'never',
  ON = 'on',
  AFTER = 'after'
}

// In event.types.ts
export enum AppointmentType {
  CONSULTATION = "consultation",
  CHECKUP = "checkup",
  FOLLOW_UP = "follow_up",
  TREATMENT = "treatment",
  OTHER = "other"
}

export interface ITodo {
  description?: string;
  priority?: Priority;
  tags?: string[];  // Explicitly define tags as string array
  links?: string[];
  isCompleted?: boolean;
}

export interface IRoutine {
  routineNotes?: string;
  priority?: Priority;
  label?: string;
}

export interface ISpecialEvent {
  eventName?: string;
  location: string;
  attendees?: number;
  budget?: number;
}

export interface IAppointment {
  venue: string;
  appointmentDate?: string;
  contactNumber: string;
  appointmentType?: AppointmentType;
  appointmentLinks?: string[];
  additionalNotes?: string;
}

export interface IReminder {
  title?: string;
  type?: string;
  date?: Date;
  time?: Date;
  message?: string;
  notificationMethod?: string;
  recurrence?: "daily" | "weekly" | "monthly" | "yearly" | "none";
  notes?: string; // Add notes here
}

export interface IRepeatConfig {
  repeatPattern: string;
  repeatFrequency: number;
  selectedDays: string[];
  endRepeatOption: EndRepeatOption;
  endDate?: Date | null; // Allow null as a value
  occurrences: number;
  repeatMonth: number;
  monthDate?: Date | null; // Allow null as a value
}

export interface IRepeat {
  type: RepeatType;
  config?: IRepeatConfig;
}

export type CalendarView = 'timeGridWeek' | 'dayGridMonth' | 'timeGridDay' | 'listWeek' | 'listMonth';
export type ViewMode = 'calendar' | 'tasks';
