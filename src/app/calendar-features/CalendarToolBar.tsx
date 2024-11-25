import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Plus,
  ChevronDown,
  ListTodo,
  Search,
  CheckSquare,
  CalendarIcon,
  FilterIcon,
  SortAscIcon,
  SortDescIcon,
  MoreVertical,
} from "lucide-react";
import EventForm from "./EventForm";
import { RootState } from "@/store";
import {
  setSearchTerm,
  setEventTypeFilter,
  setPriorityFilter,
  setSorting,
  clearFilters,
  SortField,
  SortOrder,
} from "@/store/event.slice";
import {
  CalendarView,
  EventType,
  Priority,
  ViewMode,
} from "@/store/event.types";

interface CalendarToolBarProps {
  calendarRef: React.RefObject<any>;
  selectedView: CalendarView;
  screenType: "mobile" | "tablet" | "desktop";
  isEventDialogOpen: boolean;
  setSelectedView: (view: CalendarView) => void;
  setIsEventDialogOpen: (open: boolean) => void;
  handleCreateEvent: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const CalendarToolBar = ({
  calendarRef,
  selectedView,
  screenType,
  isEventDialogOpen,
  viewMode,
  setSelectedView,
  setIsEventDialogOpen,
  setViewMode,
  handleCreateEvent,
}: CalendarToolBarProps) => {
  const dispatch = useDispatch();
  const { filter, sort } = useSelector((state: RootState) => state.events);
  const searchTerm = filter.searchTerm;
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const getCurrentDate = () => {
    const api = calendarRef.current?.getApi();
    if (api) {
      const date = api.getDate();
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);
    }
    return "";
  };

  const viewOptions = [
    {
      view: "timeGridWeek" as const,
      icon: <List className="h-4 w-4" />,
      label: "Week",
    },
    {
      view: "dayGridMonth" as const,
      icon: <Grid className="h-4 w-4" />,
      label: "Month",
    },
    {
      view: "timeGridDay" as const,
      icon: <CalendarIcon className="h-4 w-4" />,
      label: "Day",
    },
    {
      view: "listWeek" as const,
      icon: <List className="h-4 w-4" />,
      label: "Week Agenda",
    },
    {
      view: "listMonth" as const,
      icon: <ListTodo className="h-4 w-4" />,
      label: "Month Agenda",
    },
  ];

  const sortOptions: { field: SortField; label: string }[] = [
    { field: "date", label: "Date" },
    { field: "title", label: "Title" },
    { field: "priority", label: "Priority" },
    { field: "type", label: "Type" },
    { field: "createdAt", label: "Created At" },
  ];

  const handleViewChange = (view: CalendarView) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi) {
        calendarApi.changeView(view);
        setSelectedView(view);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleEventTypeFilter = (type: EventType) => {
    const currentTypes = [...filter.eventTypes];
    const typeIndex = currentTypes.indexOf(type);

    if (typeIndex === -1) {
      currentTypes.push(type);
    } else {
      currentTypes.splice(typeIndex, 1);
    }

    dispatch(setEventTypeFilter(currentTypes));
  };

  const handlePriorityFilter = (priority: Priority) => {
    const currentPriorities = [...filter.priorities];
    const priorityIndex = currentPriorities.indexOf(priority);

    if (priorityIndex === -1) {
      currentPriorities.push(priority);
    } else {
      currentPriorities.splice(priorityIndex, 1);
    }

    dispatch(setPriorityFilter(currentPriorities));
  };

  const handleSort = (field: SortField) => {
    const newOrder: SortOrder =
      sort.field === field && sort.order === "asc" ? "desc" : "asc";
    dispatch(setSorting({ field, order: newOrder }));
  };

  const getCurrentViewOption = () => {
    return (
      viewOptions.find((option) => option.view === selectedView) ||
      viewOptions[0]
    );
  };

  const NavigationControls = () => (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
        <Button
          onClick={() => calendarRef.current?.getApi()?.prev()}
          variant="ghost"
          size="icon"
          className="hover:bg-white dark:hover:bg-gray-600 rounded-md h-8 w-8 flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => calendarRef.current?.getApi()?.next()}
          variant="ghost"
          size="icon"
          className="hover:bg-white dark:hover:bg-gray-600 rounded-md h-8 w-8 flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={() => calendarRef.current?.getApi()?.today()}
        variant="outline"
        size="sm"
        className="text-xs font-medium hidden sm:block"
      >
        Today
      </Button>
    </div>
  );

  const SearchBar = () => (
    <div
      className={`relative transition-all duration-200 ${
        isSearchVisible ? "w-full sm:w-auto" : "w-auto"
      }`}
    >
      {isSearchVisible ? (
        <div className="flex items-center w-full sm:w-[200px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 w-full"
          />
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 sm:hidden"
            onClick={() => setIsSearchVisible(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchVisible(true)}
          className="sm:hidden"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
      <div className="hidden sm:block relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-8 w-[200px]"
        />
      </div>
    </div>
  );

  const AddEventButton = () =>
    screenType === "mobile" ? (
      <Drawer open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DrawerTrigger asChild>
          <Button size="icon" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create New Event</DrawerTitle>
            <DrawerDescription>
              Add a new event to your calendar
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <EventForm />
          </div>
          <DrawerFooter>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <Button
          onClick={() => setIsEventDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Event</span>
        </Button>
        <DialogContent className="max-w-[550px] mx-auto rounded-xl shadow-lg p-3">
          <EventForm />
        </DialogContent>
      </Dialog>
    );

  return (
    <div className="w-full bg-white dark:bg-black shadow-sm p-2 sm:p-4 mb-4">
      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-4">
          {/* Modified mobile navigation section */}
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <Button
                onClick={() => calendarRef.current?.getApi()?.prev()}
                variant="ghost"
                size="icon"
                className="hover:bg-white dark:hover:bg-gray-600 rounded-md h-8 w-8 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => calendarRef.current?.getApi()?.next()}
                variant="ghost"
                size="icon"
                className="hover:bg-white dark:hover:bg-gray-600 rounded-md h-8 w-8 flex items-center justify-center"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={() => calendarRef.current?.getApi()?.today()}
              variant="outline"
              size="sm"
              className="text-xs font-medium"
            >
              Today
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <SearchBar />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <AddEventButton />
          </div>
        </div>
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">{getCurrentDate()}</h2>
        </div>
        {isMobileMenuOpen && (
          <div className="space-y-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Tabs
              value={viewMode}
              onValueChange={(value: string) => setViewMode(value as ViewMode)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tasks
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                >
                  {getCurrentViewOption().icon}
                  <span className="ml-2">{getCurrentViewOption().label}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-full flex  flex-col gap-2 items-start"
              >
                {viewOptions.map(({ view, icon, label }) => (
                  <DropdownMenuItem
                    key={view}
                    className="flex items-center space-x-2"
                    onClick={() => handleViewChange(view)}
                  >
                    {icon}
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <FilterIcon className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => dispatch(clearFilters())}>
                    Clear Filters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">Event Types</h4>
                    {Object.values(EventType).map((type) => (
                      <div key={type} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={filter.eventTypes.includes(type)}
                          onChange={() => handleEventTypeFilter(type)}
                          className="mr-2"
                        />
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <h4 className="mb-2 text-sm font-medium">Priority</h4>
                    {Object.values(Priority).map((priority) => (
                      <div key={priority} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={filter.priorities.includes(priority)}
                          onChange={() => handlePriorityFilter(priority)}
                          className="mr-2"
                        />
                        <span className="text-sm">{priority}</span>
                      </div>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    {sort.order === "asc" ? (
                      <SortAscIcon className="h-4 w-4" />
                    ) : (
                      <SortDescIcon className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map(({ field, label }) => (
                    <DropdownMenuItem
                      key={field}
                      onClick={() => handleSort(field)}
                      className="flex items-center justify-between"
                    >
                      <span>{label}</span>
                      {sort.field === field &&
                        (sort.order === "asc" ? (
                          <SortAscIcon className="h-4 w-4" />
                        ) : (
                          <SortDescIcon className="h-4 w-4" />
                        ))}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      {/* Desktop/Tablet View */}
      <div className="hidden sm:block">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <NavigationControls />
            <h2 className="text-lg font-semibold">{getCurrentDate()}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <SearchBar />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => dispatch(clearFilters())}>
                  Clear Filters
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Event Types</h4>
                  {Object.values(EventType).map((type) => (
                    <div key={type} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={filter.eventTypes.includes(type)}
                        onChange={() => handleEventTypeFilter(type)}
                        className="mr-2"
                      />
                      <span className="text-sm">{type}</span>
                    </div>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Priority</h4>
                  {Object.values(Priority).map((priority) => (
                    <div key={priority} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={filter.priorities.includes(priority)}
                        onChange={() => handlePriorityFilter(priority)}
                        className="mr-2"
                      />
                      <span className="text-sm">{priority}</span>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {sort.order === "asc" ? (
                    <SortAscIcon className="h-4 w-4" />
                  ) : (
                    <SortDescIcon className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map(({ field, label }) => (
                  <DropdownMenuItem
                    key={field}
                    onClick={() => handleSort(field)}
                    className="flex items-center justify-between"
                  >
                    <span>{label}</span>
                    {sort.field === field &&
                      (sort.order === "asc" ? (
                        <SortAscIcon className="h-4 w-4" />
                      ) : (
                        <SortDescIcon className="h-4 w-4" />
                      ))}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tabs
              value={viewMode}
              onValueChange={(value: string) => setViewMode(value as ViewMode)}
            >
              <TabsList className="grid w-[100px] grid-cols-2">
                <TabsTrigger value="calendar">
                  <CalendarIcon className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tasks">
                  <CheckSquare className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="hidden md:flex items-center space-x-2"
                >
                  {getCurrentViewOption().icon}
                  <span className="ml-2">{getCurrentViewOption().label}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {viewOptions.map(({ view, icon, label }) => (
                  <DropdownMenuItem
                    key={view}
                    className="flex items-center space-x-2"
                    onClick={() => handleViewChange(view)}
                  >
                    {icon}
                    <span>{label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <AddEventButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolBar;
