import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RepeatType, EventType, Priority, IReminder, IRepeat, ITodo, IRoutine, ISpecialEvent, IAppointment,  } from './event.types';


// Define the filter and sort types
export type SortField = 'date' | 'title' | 'priority' | 'type' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface IEvent {
  _id: string;
  userId: string;
  title: string;
  type: EventType;
  date: Date;
  startTime?: Date | null;
  endTime?: Date | null;
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

interface EventsFilter {
  searchTerm: string;
  eventTypes: EventType[];
  priorities: Priority[];
  repeatTypes: RepeatType[];
  startDate?: Date;
  endDate?: Date;
  isAllDayOnly?: boolean;
}

interface EventsState {
  events: IEvent[];
  filteredEvents: IEvent[];
  loading: boolean;
  error: string | null;
  filter: EventsFilter;
  sort: {
    field: SortField;
    order: SortOrder;
  };
  selectedEventId: string | null;
}

const initialState: EventsState = {
  events: [],
  filteredEvents: [],
  loading: false,
  error: null,
  filter: {
    searchTerm: '',
    eventTypes: [],
    priorities: [],
    repeatTypes: [],
    isAllDayOnly: false
  },
  sort: {
    field: 'date',
    order: 'asc'
  },
  selectedEventId: null
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (userId: string) => {
    const response = await fetch(`/api/event`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json() as Promise<IEvent[]>;
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (event: Partial<IEvent>) => {
    const response = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json() as Promise<IEvent>;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, event }: { id: string; event: Partial<IEvent> }) => {
    const response = await fetch(`/api/event/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to update event');
    return response.json() as Promise<IEvent>;
  }
);

export const toggleTodoCompletion = createAsyncThunk(
  'events/toggleTodoCompletion',
  async ({ eventId, isCompleted }: { eventId: string; isCompleted: boolean }) => {
    const response = await fetch(`/api/event/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'todoData.isCompleted': isCompleted
      })
    });
    if (!response.ok) throw new Error('Failed to update todo completion status');
    return response.json() as Promise<IEvent>;
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string) => {
    const response = await fetch(`/api/event/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return id;
  }
);

// Helper functions
const filterEvents = (events: IEvent[], filter: EventsFilter): IEvent[] => {
  return events.filter(event => {
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(searchLower) ||
        (event.todoData?.description?.toLowerCase().includes(searchLower)) ||
        (event.routineData?.routineNotes?.toLowerCase().includes(searchLower)) ||
        (event.specialEventData?.eventName?.toLowerCase().includes(searchLower)) ||
        (event.appointmentData?.additionalNotes?.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }

    // Event type filter
    if (filter.eventTypes.length > 0 && !filter.eventTypes.includes(event.type)) {
      return false;
    }

    // Priority filter
    if (filter.priorities.length > 0) {
      const eventPriority = event.todoData?.priority || event.routineData?.priority;
      if (!eventPriority || !filter.priorities.includes(eventPriority)) {
        return false;
      }
    }

    // Repeat type filter
    if (filter.repeatTypes.length > 0 && !filter.repeatTypes.includes(event.repeat?.type || RepeatType.NO_REPEAT)) {
      return false;
    }

    // Date range filter
    if (filter.startDate && new Date(event.date) < filter.startDate) return false;
    if (filter.endDate && new Date(event.date) > filter.endDate) return false;

    // All-day event filter
    if (filter.isAllDayOnly && !event.isAllDayEvent) return false;

    return true;
  });
};

const sortEvents = (events: IEvent[], field: SortField, order: SortOrder): IEvent[] => {
  return [...events].sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const aPriority = a.todoData?.priority || a.routineData?.priority || Priority.LOW;
        const bPriority = b.todoData?.priority || b.routineData?.priority || Priority.LOW;
        comparison = aPriority.localeCompare(bPriority);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime();
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filter.searchTerm = action.payload;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setEventTypeFilter: (state, action: PayloadAction<EventType[]>) => {
      state.filter.eventTypes = action.payload;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setPriorityFilter: (state, action: PayloadAction<Priority[]>) => {
      state.filter.priorities = action.payload;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setRepeatTypeFilter: (state, action: PayloadAction<RepeatType[]>) => {
      state.filter.repeatTypes = action.payload;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setDateRange: (state, action: PayloadAction<{ startDate?: Date; endDate?: Date }>) => {
      state.filter.startDate = action.payload.startDate;
      state.filter.endDate = action.payload.endDate;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setAllDayFilter: (state, action: PayloadAction<boolean>) => {
      state.filter.isAllDayOnly = action.payload;
      state.filteredEvents = sortEvents(
        filterEvents(state.events, state.filter),
        state.sort.field,
        state.sort.order
      );
    },
    setSorting: (state, action: PayloadAction<{ field: SortField; order: SortOrder }>) => {
      state.sort = action.payload;
      state.filteredEvents = sortEvents(
        state.filteredEvents,
        action.payload.field,
        action.payload.order
      );
    },
    setSelectedEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload;
    },
    clearFilters: (state) => {
      state.filter = initialState.filter;
      state.filteredEvents = sortEvents(
        state.events,
        state.sort.field,
        state.sort.order
      );
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.filteredEvents = sortEvents(
          filterEvents(action.payload, state.filter),
          state.sort.field,
          state.sort.order
        );
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch events';
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.push(action.payload);
        state.filteredEvents = sortEvents(
          filterEvents(state.events, state.filter),
          state.sort.field,
          state.sort.order
        );
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
          state.filteredEvents = sortEvents(
            filterEvents(state.events, state.filter),
            state.sort.field,
            state.sort.order
          );
        }
      })
     .addCase(toggleTodoCompletion.fulfilled, (state, action) => {
        const index = state.events.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
          state.filteredEvents = sortEvents(
            filterEvents(state.events, state.filter),
            state.sort.field,
            state.sort.order
          );
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter(e => e._id !== action.payload);
        state.filteredEvents = sortEvents(
          filterEvents(state.events, state.filter),
          state.sort.field,
          state.sort.order
        );
        if (state.selectedEventId === action.payload) {
          state.selectedEventId = null;
        }
      });
  }
});

export const {
  setSearchTerm,
  setEventTypeFilter,
  setPriorityFilter,
  setRepeatTypeFilter,
  setDateRange,
  setAllDayFilter,
  setSorting,
  setSelectedEvent,
  clearFilters
} = eventsSlice.actions;

export default eventsSlice.reducer;