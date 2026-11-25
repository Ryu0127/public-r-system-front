import ClientOnly from 'components/ClientOnly';
import EventsCalendarContainer from 'features/events/events-calendar/containers/EventsCalendarContainer';

/**
 * イベントカレンダー画面
 *
 * URL: /events/calendar
 */
export default function EventsCalendarPage() {
  return (
    <ClientOnly>
      <EventsCalendarContainer />
    </ClientOnly>
  );
}
