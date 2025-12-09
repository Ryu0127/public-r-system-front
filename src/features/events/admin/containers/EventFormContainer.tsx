import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EventFormPresenter from '../presenters/EventFormPresenter';
import { useEventAdmin } from '../hooks/useEventAdmin';
import { HololiveEvent } from '../../events-calendar/types';

const EventFormContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    error,
    createEvent,
    updateEvent,
    getEventById,
  } = useEventAdmin();

  const [event, setEvent] = useState<HololiveEvent | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) {
      // 編集モード: IDからイベントを取得
      const foundEvent = getEventById(id);
      if (foundEvent) {
        setEvent(foundEvent);
      } else {
        setNotFound(true);
      }
    }
  }, [id, getEventById]);

  const handleSave = async (eventData: Partial<HololiveEvent>) => {
    if (id) {
      // 編集モード
      return await updateEvent(id, eventData);
    } else {
      // 新規作成モード
      return await createEvent(eventData);
    }
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
    />
  );
};

export default EventFormContainer;
