import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { RepeatType, EventType, Priority, IReminder, IRepeat, ITodo, IRoutine, ISpecialEvent, IAppointment } from './event.types';
import { AxiosResponse } from 'axios';

// Type definitions
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
  loading: 'idle' | 'loading' | 'succeeded' | 'failed';
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
  loading: 'idle',
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

// Create the async thunk with proper type parameters
export const fetchEvents = createAsyncThunk<
  IEvent[],                    // Return type
  void,                       // First argument type (none in this case)
  {                           // ThunkAPI configuration
    rejectValue: string;      // Type for rejectWithValue
  }
>('events/fetchEvents', async (_, { rejectWithValue }) => {
  try {
    const response: AxiosResponse<IEvent[]> = await api.get<IEvent[]>('/event');
    
    // Validate response data
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      return rejectWithValue('Invalid response format from server');
    }

    // Type guard to ensure we have an array of IEvent objects
    const isValidEvent = (event: any): event is IEvent => {
      return (
        typeof event === 'object' &&
        event !== null &&
        '_id' in event &&
        'userId' in event &&
        'title' in event &&
        'type' in event &&
        'date' in event
      );
    };

    // Validate each event in the array
    if (!response.data.every(isValidEvent)) {
      console.error('Invalid event data in response');
      return rejectWithValue('Invalid event data received');
    }

    return response.data;
  } catch (err: unknown) {
    // Type guard for error handling
    const error = err as { 
      response?: { 
        status?: number; 
        data?: { 
          error?: string 
        } 
      }; 
      message?: string 
    };

    // Log the error for debugging
    console.error('Error fetching events:', error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      return rejectWithValue('Unauthorized: Please log in again');
    }
    if (error.response?.status === 404) {
      return rejectWithValue('No events found');
    }
    if (error.response?.status && error.response.status >= 500) {
      return rejectWithValue('Server error: Please try again later');
    }
    
    // Generic error handling
    return rejectWithValue(
      error.response?.data?.error || 
      error.message || 
      'Failed to fetch events'
    );
  }
});

export const createEvent = createAsyncThunk<
  IEvent,
  Partial<IEvent>,
  { rejectValue: string }
>('events/createEvent', async (eventData, { rejectWithValue }) => {
  try {
    const response = await api.post('/event', eventData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create event');
  }
});

export const updateEvent = createAsyncThunk<
  IEvent,
  { id: string; event: Partial<IEvent> },
  { rejectValue: string }
>('events/updateEvent', async ({ id, event }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/event/${id}`, event);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update event');
  }
});

export const toggleTodoCompletion = createAsyncThunk<
  IEvent,
  { eventId: string; isCompleted: boolean },
  { rejectValue: string }
>('events/toggleTodoCompletion', async ({ eventId, isCompleted }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/event/${eventId}`, {
      'todoData.isCompleted': isCompleted
    });
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update todo completion status');
  }
});

export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('events/deleteEvent', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/event/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete event');
  }
});

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
    resetEventsState: (state) => {
      return { ...initialState };
    },
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
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.events = action.payload;
        state.filteredEvents = sortEvents(
          filterEvents(action.payload, state.filter),
          state.sort.field,
          state.sort.order
        );
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.events.push(action.payload);
        state.filteredEvents = sortEvents(
          filterEvents(state.events, state.filter),
          state.sort.field,
          state.sort.order
        );
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = 'succeeded';
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
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Toggle todo completion
      .addCase(toggleTodoCompletion.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(toggleTodoCompletion.fulfilled, (state, action) => {
        state.loading = 'succeeded';
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
      .addCase(toggleTodoCompletion.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = 'loading';
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.events = state.events.filter(e => e._id !== action.payload);
        state.filteredEvents = sortEvents(
          filterEvents(state.events, state.filter),
          state.sort.field,
          state.sort.order
        );
        if (state.selectedEventId === action.payload) {
          state.selectedEventId = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const {
  resetEventsState,
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

// Selectors
export const selectEvents = (state: { events: EventsState }) => state.events.events;
export const selectFilteredEvents = (state: { events: EventsState }) => state.events.filteredEvents;
export const selectEventsStatus = (state: { events: EventsState }) => state.events.loading;
export const selectEventsError = (state: { events: EventsState }) => state.events.error;
export const selectSelectedEventId = (state: { events: EventsState }) => state.events.selectedEventId;
export const selectEventsFilter = (state: { events: EventsState }) => state.events.filter;
export const selectEventsSort = (state: { events: EventsState }) => state.events.sort;

// Helper selector to get an event by ID
export const selectEventById = (state: { events: EventsState }, eventId: string) => 
  state.events.events.find(event => event._id === eventId);

// Helper selector to get filtered events for a specific date
export const selectFilteredEventsByDate = (state: { events: EventsState }, date: Date) => 
  state.events.filteredEvents.filter(event => 
    new Date(event.date).toDateString() === date.toDateString()
  );

// Helper selector to get upcoming events within the next n days
export const selectUpcomingEvents = (state: { events: EventsState }, days: number) => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return state.events.filteredEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= futureDate;
  });
};

// Helper selector to get overdue todos
export const selectOverdueTodos = (state: { events: EventsState }) => {
  const today = new Date();
  return state.events.filteredEvents.filter(event => 
    event.type === EventType.TODO && 
    !event.todoData?.isCompleted &&
    new Date(event.date) < today
  );
};

export default eventsSlice.reducer;