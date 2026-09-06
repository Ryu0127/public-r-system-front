import React from 'react';
import SectionTitle from 'components/molecules/SectionTitle';
import { HomeEvent } from '../data/homeData';

const CalendarIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const colorClasses: { [key: string]: { gradient: string; shadow: string; hover: string } } = {
  amber: {
    gradient: 'from-amber-400 to-amber-600',
    shadow: 'shadow-amber-500/30',
    hover: 'hover:border-amber-300',
  },
  sky: {
    gradient: 'from-sky-400 to-sky-600',
    shadow: 'shadow-sky-500/30',
    hover: 'hover:border-sky-300',
  },
  rose: {
    gradient: 'from-rose-400 to-pink-600',
    shadow: 'shadow-rose-500/30',
    hover: 'hover:border-rose-300',
  },
};

interface EventsSectionProps {
  events: HomeEvent[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <SectionTitle en="Event" ja="イベント" />

      <div className="grid md:grid-cols-3 gap-8">
        {events.map((event) => {
          const colors = colorClasses[event.color] ?? colorClasses.rose;

          return (
            <a
              key={event.id}
              href={event.link}
              className={`group block bg-white backdrop-blur-sm rounded-3xl p-8 border border-gray-200 ${colors.hover} hover:bg-white/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer`}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${colors.shadow}`}
              >
                <CalendarIcon />
              </div>

              <p className="text-xs font-semibold tracking-wider text-rose-500 mb-2">
                {event.dateLabel}
              </p>

              <div style={{ height: '80px' }}>
                <h3
                  className="text-2xl font-bold text-gray-800 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {event.title}
                </h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {event.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default EventsSection;
