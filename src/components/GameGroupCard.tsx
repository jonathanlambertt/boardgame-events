import { useNavigate } from '@tanstack/react-router'
import type { Event } from '../types'

type Props = {
  gameName: string
  events: Event[]
  attendeeCounts: Record<string, number>
  darkMode: boolean
  onSingleSession: (event: Event) => void
}

export function GameGroupCard({ gameName, events, attendeeCounts, darkMode, onSingleSession }: Props) {
  const navigate = useNavigate()
  const firstEvent = events[0]
  const sessionCount = events.length

  const totalSpotsLeft = events.reduce((acc, e) => {
    const players = (attendeeCounts[e.id] ?? 0) + 1
    return acc + Math.max(0, e.total_players - players)
  }, 0)

  const handleClick = () => {
    if (sessionCount === 1) {
      onSingleSession(firstEvent)
    } else {
      navigate({ to: '/games/$gameId', params: { gameId: gameName } })
    }
  }

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      {/* Stacked card effect */}
      <div className="relative">
        {sessionCount > 2 && (
          <div
            className={`absolute inset-x-2 top-1 bottom-0 rounded-2xl -rotate-3 ${
              darkMode ? 'bg-ink-700' : 'bg-ink-300'
            }`}
          />
        )}
        {sessionCount > 1 && (
          <div
            className={`absolute inset-x-1 top-0.5 bottom-0 rounded-2xl -rotate-1 ${
              darkMode ? 'bg-ink-600' : 'bg-ink-200'
            }`}
          />
        )}

        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl aspect-4/3">
          <img
            src={firstEvent.image_url}
            alt={gameName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Game type badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 text-ink-700 backdrop-blur-sm shadow-sm">
            {firstEvent.game_type}
          </span>

          {/* Sessions / spots badge */}
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-bold rounded-full shadow-sm ${
              sessionCount > 1
                ? 'bg-white/90 text-ink-800 backdrop-blur-sm'
                : totalSpotsLeft <= 0
                  ? 'bg-ink-900/70 text-white backdrop-blur-sm'
                  : totalSpotsLeft <= 2
                    ? 'bg-amber-500 text-white'
                    : 'bg-primary-600 text-white'
            }`}
          >
            {sessionCount > 1
              ? `${sessionCount} sessions`
              : totalSpotsLeft <= 0
                ? 'Full'
                : `${totalSpotsLeft} spot${totalSpotsLeft === 1 ? '' : 's'} left`}
          </span>
        </div>
      </div>

      {/* Info below */}
      <div className="pt-3 space-y-1.5">
        <h3 className={`font-bold text-[15px] leading-snug ${darkMode ? 'text-white' : 'text-ink-900'}`}>
          {gameName}
        </h3>

        {sessionCount > 1 ? (
          <p className={`text-sm font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            {totalSpotsLeft > 0
              ? `${totalSpotsLeft} total spots across ${sessionCount} sessions`
              : 'All sessions currently full'}
          </p>
        ) : (
          <>
            <p className={`text-sm ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}>
              {firstEvent.location}
            </p>
            <p className={`text-sm ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}>
              {new Date(firstEvent.scheduled_at).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}{' '}
              ·{' '}
              {new Date(firstEvent.scheduled_at).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
            <p className={`text-sm ${darkMode ? 'text-ink-300' : 'text-ink-600'}`}>
              Hosted by{' '}
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-ink-800'}`}>
                {firstEvent.host_name}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
