import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventFormPresenter from '../presenters/EventFormPresenter';
import { useEventAdmin } from '../../hooks/useEventAdmin';
import { HololiveEvent } from '../../../events-calendar/types';

const EventFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  } = useEventAdmin();

  const [event, setEvent] = useState<HololiveEvent | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id && !loading) {
      // 編集モード: IDからイベントを取得（loading完了後）
      const foundEvent = getEventById(id);
      if (foundEvent) {
        setEvent(foundEvent);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    }
  }, [id, loading, getEventById, events]);

  const handleSave = async (eventData: Partial<HololiveEvent>) => {
    if (id) {
      // 編集モード
      return await updateEvent(id, eventData);
    } else {
      // 新規作成モード
      return await createEvent(eventData);
    }
  };

  const handleDelete = async () => {
    if (id) {
      return await deleteEvent(id);
    }
    return false;
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            指定されたイベントが見つかりませんでした
          </div>
        </div>
      </div>
    );
  }

  return (
    <EventFormPresenter
      event={event}
      loading={loading}
      error={error}
      onSave={handleSave}
      onDelete={id ? handleDelete : undefined}
    />
  );
};

export default EventFormContainer;
