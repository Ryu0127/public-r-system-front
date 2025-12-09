import React from 'react';
import EventAdminPresenter from '../presenters/EventAdminPresenter';
import { useEventAdmin } from '../hooks/useEventAdmin';

const EventAdminContainer: React.FC = () => {
  const {
    events,
    loading,
    error,
    deleteEvent,
    getEventById,
  } = useEventAdmin();

  return (
    <EventAdminPresenter
      events={events}
      loading={loading}
      error={error}
      onDeleteEvent={deleteEvent}
      getEventById={getEventById}
    />
  );
};

export default EventAdminContainer;
