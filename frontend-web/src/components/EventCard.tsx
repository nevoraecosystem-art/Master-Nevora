import { Link } from 'react-router-dom';
import { EventItem } from '../store/eventsStore';

interface Props {
  event: EventItem;
}

const EventCard = ({ event }: Props) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="mb-2 text-xs uppercase tracking-wide text-primary">{event.location}</div>
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">{event.description}</p>
        <div className="mt-3 text-sm text-slate-500">
          <div>
            {new Date(event.startDate).toLocaleDateString('pt-BR')} -{' '}
            {new Date(event.endDate).toLocaleDateString('pt-BR')}
          </div>
          <div className="font-semibold text-primary-dark">R$ {event.price?.toFixed(2)}</div>
        </div>
      </div>
      <Link
        to={`/events/${event.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-light"
      >
        Ver detalhes
      </Link>
    </div>
  );
};

export default EventCard;
