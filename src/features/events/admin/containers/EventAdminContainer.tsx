import React from 'react';
import EventAdminPresenter from '../presenters/EventAdminPresenter';
import { useEventAdmin } from '../hooks/useEventAdmin';

const EventAdminContainer: React.FC = () => {
  const {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    changeEventStatus,
    getEventById,
  } = useEventAdmin();

  return (
    <EventAdminPresenter
      events={events}
      loading={loading}
      error={error}
      onCreateEvent={createEvent}
      onUpdateEvent={updateEvent}
      onDeleteEvent={deleteEvent}
      onStatusChange={changeEventStatus}
      getEventById={getEventById}
    />
  );
};

export default EventAdminContainer;
