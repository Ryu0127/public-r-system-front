import React from 'react';
import EventAdminPresenter from '../presenters/EventAdminPresenter';
import { useEventList } from '../hooks/useEventList';

const EventAdminContainer: React.FC = () => {
  const {
    events,
    loading,
    error,
    getEventById,
  } = useEventList();

  return (
    <EventAdminPresenter
      events={events}
      loading={loading}
      error={error}
      getEventById={getEventById}
    />
  );
};

export default EventAdminContainer;
