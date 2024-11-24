import { createGlobalStyle } from "styled-components";

export const CalendarCustomStyles = createGlobalStyle`
  .fc {
    /* Color Palette */
    --fc-primary-color: #3b82f6;
    --fc-primary-color-light: #60a5fa;
    --fc-neutral-100: #f9fafb;
    --fc-neutral-200: #e5e7eb;
    --fc-neutral-500: #6b7280;
    --fc-neutral-600: #4b5563;
    --fc-neutral-700: #374151;
    --fc-neutral-800: #1f2937;
    --fc-neutral-900: #111827;

    /* Border & Background Defaults */
    --fc-border-color: var(--fc-neutral-200);
    --fc-day-today-bg-color: var(--fc-neutral-100);
    --fc-event-bg-color: var(--fc-primary-color);
    --fc-event-border-color: var(--fc-primary-color);

    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;

    /* Global Resets */
    .fc-scrollgrid {
      border: 1px solid var(--fc-border-color) !important;
      border-radius: 8px;
      overflow: hidden;
    }
  }

  /* Monthly View Enhancements */
  .fc-dayGridMonth-view {
    .fc-scrollgrid-sync-inner {
      padding: 4px !important;
      min-height: 120px !important;
    }

    .fc-daygrid-day-frame {
      padding: 6px !important;
      transition: background-color 0.2s ease;
    }

    .fc-daygrid-day-top {
      justify-content: center;

      .fc-daygrid-day-number {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--fc-neutral-600);
        padding: 4px 8px;
        border-radius: 9999px;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--fc-primary-color-light);
          color: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      }
    }

    /* Today Highlight */
    .fc-day-today {
      background-color: color-mix(in srgb, var(--fc-primary-color) 10%, transparent) !important;

      .fc-daygrid-day-number {
        background-color: var(--fc-primary-color);
        color: white;
        font-weight: 600;
      }
    }

    /* Weekend Styling */
    .fc-day-sat, .fc-day-sun {
      background-color: color-mix(in srgb, var(--fc-neutral-100) 50%, transparent);
    }

    /* Event Styling */
    .fc-daygrid-event-harness {
      margin: 2px 0 !important;
    }

    .fc-daygrid-event {
      border-radius: 6px;
      padding: 2px 4px !important;
      font-size: 0.75rem;
      border: none;
      background: var(--fc-primary-color);
      color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;

      &:hover {
        background: var(--fc-primary-color-light);
        transform: scale(1.03);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .fc-event-main {
        padding: 0 !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    /* More Events Link */
    .fc-daygrid-more-link {
      font-size: 0.75rem;
      color: var(--fc-primary-color);
      font-weight: 600;
      padding: 2px 4px;
      border-radius: 4px;
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--fc-primary-color-light);
        color: white;
      }
    }
  }

  /* Time Grid View */
  .fc-timegrid {
    .fc-timegrid-slot {
      height: 3rem !important;
      border-bottom: 1px solid var(--fc-neutral-200) !important;

      &.fc-timegrid-slot-lane {
        opacity: 0.6;
      }
    }

    .fc-timegrid-now-indicator-line {
      border-color: #ef4444;
      border-width: 2px;
    }

    .fc-timegrid-event {
      border-radius: 8px;
      margin: 2px 4px !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

      .fc-event-main {
        padding: 4px 6px !important;
      }
    }
  }

  /* Header Styling */
  .fc-col-header-cell {
    background-color: var(--fc-neutral-100);
    border: none !important;

    .fc-scrollgrid-sync-inner {
      padding: 12px 8px;
      text-align: center;
      font-weight: 600;
      color: var(--fc-neutral-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  /* Dark Mode */
  .dark {
    .fc {
      --fc-border-color: var(--fc-neutral-700);
      --fc-day-today-bg-color: var(--fc-neutral-800);

      .fc-col-header-cell {
        background-color: var(--fc-neutral-900);
        color: var(--fc-neutral-200);
      }

      .fc-dayGridMonth-view {
        .fc-daygrid-day-number {
          color: var(--fc-neutral-200);
        }

        .fc-day-today {
          background-color: color-mix(in srgb, var(--fc-primary-color) 20%, transparent) !important;

          .fc-daygrid-day-number {
            background-color: var(--fc-primary-color-light);
          }
        }

        .fc-day-sat, .fc-day-sun {
          background-color: color-mix(in srgb, var(--fc-neutral-800) 50%, transparent);
        }
      }

      .fc-timegrid-slot {
        border-bottom: 1px solid var(--fc-neutral-700) !important;
      }
    }
  }
`;
