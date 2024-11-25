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

import { z } from "zod";

// Base schema for repeat configuration
const repeatConfigSchema = z.object({
  repeatPattern: z.string(),
  repeatFrequency: z.number(),
  selectedDays: z.array(z.string()),
  endRepeatOption: z.nativeEnum(EndRepeatOption),
  endDate: z.date().nullable(),
  occurrences: z.number(),
  repeatMonth: z.number(),
  monthDate: z.date().nullable(),
}) satisfies z.ZodType<IRepeatConfig>;

// Base schema for repeat
const repeatSchema = z.object({
  type: z.nativeEnum(RepeatType),
  config: repeatConfigSchema.optional(),
}) satisfies z.ZodType<IRepeat>;

// Base schema for common fields across all event types
const baseEventSchema = z.object({
  userId: z.string(),
  eventType: z.nativeEnum(EventType),
  priority: z.nativeEnum(Priority),
  location: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  isAllDayEvent: z.boolean(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  reminders: z.array(z.any()).optional(),
  repeat: repeatSchema.optional(),
});

// Todo schema matching ITodo interface
const todoSchema = baseEventSchema.extend({
  todoData: z.object({
    description: z.string().optional(),
    priority: z.nativeEnum(Priority),
    tags: z.array(z.string()).optional(),
    links: z.array(z.string().url("Invalid URL format")).optional(),
    isCompleted: z.boolean().optional(),
  }) satisfies z.ZodType<ITodo>,
});

// Routine schema matching IRoutine interface
const routineSchema = baseEventSchema.extend({
  routineData: z.object({
    routineNotes: z.string().optional(),
    priority: z.nativeEnum(Priority),
    label: z.string().optional(),
  }) satisfies z.ZodType<IRoutine>,
});

// Special event schema matching ISpecialEvent interface
const specialEventSchema = baseEventSchema.extend({
  specialEventData: z.object({
    eventName: z.string().optional(),
    location: z.string(),
    attendees: z.number().optional(),
    budget: z.number().optional(),
  }) satisfies z.ZodType<ISpecialEvent>,
});

// Appointment schema matching IAppointment interface
const appointmentSchema = baseEventSchema.extend({
  appointmentData: z.object({
    venue: z.string(),
    appointmentDate: z.string().optional(),
    contactNumber: z.string(),
    appointmentType: z.nativeEnum(AppointmentType).optional(),
    appointmentLinks: z.array(z.string().url("Invalid URL format")).optional(),
    additionalNotes: z.string().optional(),
  }) satisfies z.ZodType<IAppointment>,
});

// Combined schema for all event types using discriminated union
export const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(EventType.TODO), ...todoSchema.shape }),
  z.object({ type: z.literal(EventType.ROUTINE), ...routineSchema.shape }),
  z.object({ type: z.literal(EventType.SPECIAL_EVENT), ...specialEventSchema.shape }),
  z.object({ type: z.literal(EventType.APPOINTMENT), ...appointmentSchema.shape }),
]);

// Type inference from the schema
export type EventFormData = z.infer<typeof eventSchema>;