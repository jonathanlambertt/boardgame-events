import { ClockIcon, MapPinIcon, UserIcon, UsersIcon } from 'lucide-react'
import type { Event } from '../types'

type Props = {
  event: Event
  attendeeCount: number
  darkMode: boolean
  onMoreInfo: (event: Event) => void
}

export function GameCard({ event, attendeeCount, darkMode, onMoreInfo }: Props) {
  const currentPlayers = attendeeCount + 1 // +1 for the host
  const scheduledDate = new Date(event.scheduled_at)

  const formattedDate = scheduledDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const formattedTime = scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div
      className={`rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition-all duration-300 group ${
        darkMode
          ? 'bg-slate-800 border border-slate-700 shadow-black/30'
          : 'bg-white border border-white/20 shadow-slate-600/20'
      }`}
    >
      <img
        src={event.image_url}
        alt={event.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3
            className={`text-xl font-bold group-hover:text-indigo-500 transition-colors ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {event.title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
              darkMode
                ? 'bg-slate-700 text-slate-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {event.game_type}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div
            className={`flex items-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <UserIcon
              className={`w-4 h-4 mr-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
            />
            Hosted by{' '}
            <span
              className={`font-medium ml-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {event.host_name}
            </span>
          </div>
          <div
            className={`flex items-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <ClockIcon
              className={`w-4 h-4 mr-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
            />
            {formattedDate}, {formattedTime}
          </div>
          <div
            className={`flex items-center text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <MapPinIcon
              className={`w-4 h-4 mr-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
            />
            {event.location}
          </div>
        </div>

        <div
          className={`flex items-center justify-between pt-4 border-t ${
            darkMode ? 'border-slate-700' : 'border-slate-100'
          }`}
        >
          <div
            className={`flex items-center text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            <UsersIcon className="w-4 h-4 mr-2 text-indigo-500" />
            {currentPlayers}/{event.total_players} players
          </div>
          <button
            onClick={() => onMoreInfo(event)}
            className={`text-sm font-semibold transition-colors ${
              darkMode
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            More Info
          </button>
        </div>
      </div>
    </div>
  )
}
