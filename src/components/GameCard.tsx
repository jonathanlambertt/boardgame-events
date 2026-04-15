import type { Event } from '../types'

type Props = {
  event: Event
  attendeeCount: number
  darkMode: boolean
  onMoreInfo: (event: Event) => void
}

export function GameCard({ event, attendeeCount, darkMode, onMoreInfo }: Props) {
  const currentPlayers = attendeeCount + 1
  const spotsLeft = event.total_players - currentPlayers
  const date = new Date(event.scheduled_at)

  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.toLocaleDateString('en-US', { day: 'numeric' })
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  const spotsLabel =
    spotsLeft <= 0 ? 'Full' : `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left`

  return (
    <button
      type="button"
      onClick={() => onMoreInfo(event)}
      className="group text-left w-full cursor-pointer focus:outline-none"
    >
      <div className="relative overflow-hidden rounded-2xl aspect-[5/4]">
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none ${
            darkMode
              ? 'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
              : 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]'
          }`}
        />

        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-white/95 text-ink-800 backdrop-blur-sm">
          {event.game_type}
        </span>
      </div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-semibold text-[15px] leading-snug truncate ${
              darkMode ? 'text-white' : 'text-ink-900'
            }`}
          >
            {event.title}
          </h3>
          <span
            className={`shrink-0 text-[13px] font-medium ${
              spotsLeft <= 0
                ? darkMode
                  ? 'text-ink-500'
                  : 'text-ink-400'
                : spotsLeft <= 2
                  ? 'text-primary-500'
                  : darkMode
                    ? 'text-ink-300'
                    : 'text-ink-600'
            }`}
          >
            {spotsLabel}
          </span>
        </div>

        <p className={`mt-0.5 text-[14px] truncate ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}>
          {event.location}
        </p>

        <p className={`mt-0.5 text-[14px] ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}>
          {weekday}, {month} {day} · {time}
        </p>

        <p className={`mt-1.5 text-[14px] ${darkMode ? 'text-ink-200' : 'text-ink-900'}`}>
          <span className="font-semibold">{currentPlayers}/{event.total_players}</span>
          <span className={darkMode ? ' text-ink-400' : ' text-ink-500'}> players · hosted by {event.host_name}</span>
        </p>
      </div>
    </button>
  )
}
