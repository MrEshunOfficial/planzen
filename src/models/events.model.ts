import mongoose, { Document, Schema } from 'mongoose';

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

export enum AppointmentType {
  CONSULTATION = 'consultation',
  OTHER = 'other'
}

export interface ITodo {
  description?: string;
  priority?: Priority;
  tags?: string;
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
  type?: string;
  time?: Date;
  message?: string;
  notificationMethod?: string;
}

export interface IRepeatConfig {
  repeatPattern?: string;
  repeatFrequency?: number;
  selectedDays?: string[];
  endRepeatOption?: EndRepeatOption;
  endDate?: Date;
  occurrences?: number;
  repeatMonth?: number;
  monthDate?: Date;
}

export interface IRepeat {
  type: RepeatType;
  config?: IRepeatConfig;
}

export interface IEvent extends Document {
  _id:string;
  userId: string;
  title: string;
  type: EventType;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  isAllDayEvent?: boolean;
  reminders?: IReminder[];
  repeat?: IRepeat;
  todoData?: ITodo;
  routineData?: IRoutine;
  specialEventData?: ISpecialEvent;
  appointmentData?: IAppointment;
  createdAt?: Date;
  updatedAt?: Date;
}

const TodoSchema = new Schema<ITodo>({
  description: String,
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM
  },
  tags: String,
  links: [String],
  isCompleted: {
    type: Boolean,
    default: false
  }
});

const RoutineSchema = new Schema<IRoutine>({
  routineNotes: String,
  priority: {
    type: String,
    enum: Object.values(Priority),
    default: Priority.MEDIUM
  },
  label: String
});

const SpecialEventSchema = new Schema<ISpecialEvent>({
  eventName: String,
  location: {
    type: String,
    required: true
  },
  attendees: {
    type: Number,
    min: 0
  },
  budget: {
    type: Number,
    min: 0
  }
});

const AppointmentSchema = new Schema<IAppointment>({
  venue: {
    type: String,
    required: true
  },
  appointmentDate: String,
  contactNumber: {
    type: String,
    required: true
  },
  appointmentType: {
    type: String,
    enum: Object.values(AppointmentType),
    default: AppointmentType.CONSULTATION
  },
  appointmentLinks: [String],
  additionalNotes: String
});

const ReminderSchema = new Schema<IReminder>({
  type: String,
  time: Date,
  message: String,
  notificationMethod: String
});

const RepeatConfigSchema = new Schema<IRepeatConfig>({
  repeatPattern: String,
  repeatFrequency: Number,
  selectedDays: [String],
  endRepeatOption: {
    type: String,
    enum: Object.values(EndRepeatOption),
    default: EndRepeatOption.NEVER
  },
  endDate: Date,
  occurrences: Number,
  repeatMonth: Number,
  monthDate: Date
});

const EventSchema = new Schema<IEvent>({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(EventType),
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: Date,
  endTime: Date,
  isAllDayEvent: {
    type: Boolean,
    default: false
  },
  reminders: [ReminderSchema],
  repeat: {
    type: {
      type: String,
      enum: Object.values(RepeatType),
      default: RepeatType.NO_REPEAT
    },
    config: RepeatConfigSchema
  },
  todoData: TodoSchema,
  routineData: RoutineSchema,
  specialEventData: SpecialEventSchema,
  appointmentData: AppointmentSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
EventSchema.index({ date: 1 });
EventSchema.index({ type: 1 });
EventSchema.index({ 'repeat.type': 1 });

// Middleware
EventSchema.pre('save', function(next) {
  const eventType = this.type;
  
  switch(eventType) {
    case EventType.SPECIAL_EVENT:
      if (!this.specialEventData?.location) {
        return next(new Error('Location is required for special events'));
      }
      break;
    case EventType.APPOINTMENT:
      if (!this.appointmentData?.venue || !this.appointmentData?.contactNumber) {
        return next(new Error('Venue and contact number are required for appointments'));
      }
      break;
  }
  next();
});

// Type guard functions
export const isTodoEvent = (event: IEvent): event is IEvent & { todoData: ITodo } => {
  return event.type === EventType.TODO && !!event.todoData;
};

export const isRoutineEvent = (event: IEvent): event is IEvent & { routineData: IRoutine } => {
  return event.type === EventType.ROUTINE && !!event.routineData;
};

export const isSpecialEvent = (event: IEvent): event is IEvent & { specialEventData: ISpecialEvent } => {
  return event.type === EventType.SPECIAL_EVENT && !!event.specialEventData;
};

export const isAppointmentEvent = (event: IEvent): event is IEvent & { appointmentData: IAppointment } => {
  return event.type === EventType.APPOINTMENT && !!event.appointmentData;
};

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;