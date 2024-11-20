import { createGlobalStyle } from "styled-components";

export const CalendarCustomStyles = createGlobalStyle`
  /* General calendar styles */
  .fc {
    --fc-border-color: #e5e7eb;
    --fc-day-today-bg-color: #f3f4f6;
    --fc-event-bg-color: #3b82f6;
    --fc-event-border-color: #2563eb;
    
    .fc-scrollgrid {
      border: none !important;
    }
  }

  /* Monthly view specific styles */
  .fc-dayGridMonth-view {
    .fc-scrollgrid-sync-inner {
      padding: 8px 4px !important;
      min-height: 140px !important;
    }

    .fc-daygrid-day-frame {
      padding: 8px !important;
      min-height: 140px !important;
    }

    .fc-daygrid-day-top {
      justify-content: center;
      margin-bottom: 4px;
      
      .fc-daygrid-day-number {
        font-size: 1rem;
        font-weight: 500;
        color: #4b5563;
        padding: 4px 8px;
        border-radius: 9999px;

        &:hover {
          background-color: #f3f4f6;
        }
      }
    }

    /* Style for the current date */
    .fc-day-today {
      .fc-daygrid-day-number {
        background-color: #3b82f6;
        color: white;
      }
    }

    /* Weekend days */
    .fc-day-sat, .fc-day-sun {
      background-color: #f9fafb;
    }

    /* Events in month view */
    .fc-daygrid-event-harness {
      margin: 2px 0 !important;
    }

    .fc-daygrid-event {
      border-radius: 4px;
      padding: 2px 4px !important;
      font-size: 0.875rem;
      border: none;
      background: #3b82f6;
      color: white;

      .fc-event-main {
        padding: 0 !important;
      }

      .fc-event-time {
        font-size: 0.75rem;
      }
    }

    /* More events link */
    .fc-daygrid-more-link {
      font-size: 0.875rem;
      color: #3b82f6;
      font-weight: 500;
      padding: 2px 4px;
      margin: 0 4px;

      &:hover {
        background-color: #f3f4f6;
        border-radius: 4px;
      }
    }
  }

  /* Week/Day view styles (keeping these from before) */
  .fc-timegrid {
    .fc-scrollgrid-sync-inner {
      padding: 8px;
      min-height: 6rem;
    }

    .fc-timegrid-slot {
      height: 3rem !important;
      border-bottom: 1px solid #f3f4f6 !important;
    }

    .fc-timegrid-now-indicator-line {
      border-color: #ef4444;
    }

    .fc-timegrid-axis {
      padding: 12px !important;
      border: none !important;
    }

    .fc-timegrid-event {
      border-radius: 6px;
      margin: 2px 4px !important;
      
      .fc-event-main {
        padding: 4px 6px !important;
      }
    }
  }

  /* Header styles */
  .fc-col-header-cell {
    padding: 12px 0 !important;
    background-color: #f9fafb;
    border: none !important;
    
    .fc-scrollgrid-sync-inner {
      padding: 16px 8px;
      min-height: 48px;
      text-align: center;
      font-weight: 600;
      color: #4b5563;
    }
  }

  /* Dark mode support */
  .dark {
    .fc {
      --fc-border-color: #374151;
      --fc-day-today-bg-color: #1f2937;
      
      .fc-col-header-cell {
        background-color: #111827;
        color: #e5e7eb;
      }

      .fc-dayGridMonth-view {
        .fc-daygrid-day-number {
          color: #e5e7eb;
        }

        .fc-day-sat, .fc-day-sun {
          background-color: #111827;
        }

        .fc-daygrid-more-link {
          color: #60a5fa;
        }

        .fc-day-today {
          .fc-daygrid-day-number {
            background-color: #2563eb;
          }
        }
      }
      
      .fc-timegrid-slot {
        border-bottom: 1px solid #1f2937 !important;
      }
    }
  }
`;
