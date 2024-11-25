// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfigue/dbConfigue';
import { z } from 'zod';
import { auth } from '@/auth';
import Event, { EventType, Priority, RepeatType, EndRepeatOption, AppointmentType } from '@/models/events.model'

// Zod schemas for validation
const ReminderSchema = z.object({
  type: z.string().optional(),
  time: z.string().datetime().optional(),
  message: z.string().optional(),
  notificationMethod: z.string().optional()
});

const RepeatConfigSchema = z.object({
  repeatPattern: z.string().optional(),
  repeatFrequency: z.number().optional(),
  selectedDays: z.array(z.string()).optional(),
  endRepeatOption: z.nativeEnum(EndRepeatOption).optional(),
  endDate: z.string().datetime().nullable().optional(),
  monthDate: z.string().datetime().nullable().optional(),
  occurrences: z.number().optional(),
  repeatMonth: z.number().optional(),
});

const TodoDataSchema = z.object({
  description: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  tags: z.string().optional(),
  links: z.array(z.string()).optional()
});

const RoutineDataSchema = z.object({
  routineNotes: z.string().optional(),
  priority: z.nativeEnum(Priority).optional(),
  label: z.string().optional()
});

const SpecialEventDataSchema = z.object({
  eventName: z.string().optional(),
  location: z.string(),
  attendees: z.number().min(0).optional(),
  budget: z.number().min(0).optional()
});

const AppointmentDataSchema = z.object({
  venue: z.string(),
  appointmentDate: z.string().optional(),
  contactNumber: z.string(),
  appointmentType: z.nativeEnum(AppointmentType).optional(),
  appointmentLinks: z.array(z.string()).optional(),
  additionalNotes: z.string().optional()
});

const EventSchema = z.object({
  userId: z.string(),
  title: z.string(),
  type: z.nativeEnum(EventType),
  date: z.string().datetime(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isAllDayEvent: z.boolean().optional(),
  reminders: z.array(ReminderSchema).optional(),
  repeat: z.object({
    type: z.nativeEnum(RepeatType),
    config: RepeatConfigSchema.optional()
  }).optional(),
  todoData: TodoDataSchema.optional(),
  routineData: RoutineDataSchema.optional(),
  specialEventData: SpecialEventDataSchema.optional(),
  appointmentData: AppointmentDataSchema.optional()
});

function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid data', details: error.errors },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
    { status: 500 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connect();
    
    const json = await req.json();
    const validatedData = EventSchema.parse(json);
    
    const event = await Event.create({
      ...validatedData,
      userId: session.user.id
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connect();
    
    // Changed from findOne to find to get all events for the user
    const userEvents = await Event.find({ userId }).select('-__v').lean();
    
    // Return empty array if no events found (instead of 404 error)
    if (!userEvents) {
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(userEvents, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return handleError(error);
  }
}