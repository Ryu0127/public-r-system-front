import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HololiveEvent } from '../../events-calendar/types';
import EventForm from '../components/EventForm';

interface EventFormPresenterProps {
  event?: HololiveEvent;
  loading: boolean;
  error: string | null;
  onSave: (eventData: Partial<HololiveEvent>) => Promise<boolean>;
}

const EventFormPresenter: React.FC<EventFormPresenterProps> = ({
  event,
  loading,
  error,
  onSave,
}) => {
  const navigate = useNavigate();

  const handleSave = async (eventData: Partial<HololiveEvent>) => {
    const success = await onSave(eventData);
    if (success) {
      alert(event ? 'イベントを更新しました' : 'イベントを作成しました');
      navigate('/admin/events');
    }
  };

  const handleCancel = () => {
    navigate('/admin/events');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <div className="max-w-4xl mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <EventForm event={event} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default EventFormPresenter;
