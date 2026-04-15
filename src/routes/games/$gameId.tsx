import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, CalendarIcon, MapPinIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { GameInfoModal } from '../../components/GameInfoModal'
import { Toast } from '../../components/Toast'
import type { Event } from '../../types'

export const Route = createFileRoute('/games/$gameId')({ component: GamePage })

function GamePage() {
  const { gameId } = Route.useParams()
  const [darkMode, setDarkMode] = useState(false)
  const darkModeInitialized = useRef(false)
  const [events, setEvents] = useState<Event[]>([])
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showJoinToast, setShowJoinToast] = useState(false)

  useEffect(() => {
    if (!darkModeInitialized.current) {
      darkModeInitialized.current = true
      setDarkMode(localStorage.getItem('darkMode') === 'true')
    }
  }, [])

  useEffect(() => {
    fetchSessions()
  }, [gameId])

  async function fetchSessions() {
    setIsLoading(true)

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .eq('title', gameId)
      .order('scheduled_at', { ascending: true })

    if (eventsData && eventsData.length > 0) {
      setEvents(eventsData)

      const { data: attendeesData } = await supabase
        .from('attendees')
        .select('event_id')
        .in('event_id', eventsData.map((e) => e.id))

      if (attendeesData) {
        const counts: Record<string, number> = {}
        for (const row of attendeesData) {
          counts[row.event_id] = (counts[row.event_id] ?? 0) + 1
        }
        setAttendeeCounts(counts)
      }
    }

    setIsLoading(false)
  }

  function handleJoined() {
    if (selectedEvent) {
      setAttendeeCounts((prev) => ({
        ...prev,
        [selectedEvent.id]: (prev[selectedEvent.id] ?? 0) + 1,
      }))
    }
    setShowJoinToast(true)
  }

  const firstEvent = events[0]
  const totalSpotsLeft = events.reduce((acc, e) => {
    const players = (attendeeCounts[e.id] ?? 0) + 1
    return acc + Math.max(0, e.total_players - players)
  }, 0)

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-ink-900' : 'bg-ink-50'
      }`}
    >
      {/* Modal */}
      {selectedEvent && (
        <GameInfoModal
          event={selectedEvent}
          attendeeCount={attendeeCounts[selectedEvent.id] ?? 0}
          darkMode={darkMode}
          onClose={() => setSelectedEvent(null)}
          onJoined={handleJoined}
        />
      )}

      {/* Hero */}
      <div className="relative h-72">
        {firstEvent ? (
          <img
            src={firstEvent.image_url}
            alt={gameId}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${darkMode ? 'bg-ink-800' : 'bg-ink-200'}`} />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />

        {/* Back button */}
        <Link
          to="/"
          className="absolute top-5 left-5 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center backdrop-blur-sm transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-white" />
        </Link>

        {/* Title area */}
        {firstEvent && (
          <div className="absolute bottom-5 left-5 right-5">
            <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-full bg-primary-600 text-white mb-2.5">
              {firstEvent.game_type}
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
              {gameId}
            </h1>
            {!isLoading && (
              <p className="mt-1.5 text-sm text-white/75">
                {events.length} session{events.length !== 1 ? 's' : ''} ·{' '}
                {totalSpotsLeft > 0
                  ? `${totalSpotsLeft} spot${totalSpotsLeft === 1 ? '' : 's'} available`
                  : 'all sessions full'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Sessions list */}
      <div className="max-w-2xl mx-auto px-5 py-6 pb-12 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <p className={`text-center py-16 ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}>
            No sessions found for this game.
          </p>
        ) : (
          events.map((event) => (
            <SessionRow
              key={event.id}
              event={event}
              attendeeCount={attendeeCounts[event.id] ?? 0}
              darkMode={darkMode}
              onSelect={setSelectedEvent}
            />
          ))
        )}
      </div>

      {showJoinToast && (
        <Toast
          message="You're in!"
          subMessage="Check your email for event details."
          darkMode={darkMode}
          onDismiss={() => setShowJoinToast(false)}
        />
      )}
    </main>
  )
}

function SessionRow({
  event,
  attendeeCount,
  darkMode,
  onSelect,
}: {
  event: Event
  attendeeCount: number
  darkMode: boolean
  onSelect: (event: Event) => void
}) {
  const currentPlayers = attendeeCount + 1
  const spotsLeft = event.total_players - currentPlayers
  const date = new Date(event.scheduled_at)

  const dayNum = date.toLocaleDateString('en-US', { day: 'numeric' })
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <button
      type="button"
      onClick={() => onSelect(event)}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.99] ${
        darkMode
          ? 'bg-ink-800 hover:bg-ink-750 border border-ink-700/80 hover:border-ink-600'
          : 'bg-white hover:bg-ink-50 border border-ink-100 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Date block */}
      <div
        className={`w-14 shrink-0 text-center rounded-xl py-2 ${
          darkMode ? 'bg-ink-700' : 'bg-ink-50'
        }`}
      >
        <div
          className={`text-[10px] font-extrabold uppercase tracking-wider ${
            darkMode ? 'text-primary-400' : 'text-primary-600'
          }`}
        >
          {month}
        </div>
        <div
          className={`text-2xl font-extrabold leading-tight ${
            darkMode ? 'text-white' : 'text-ink-900'
          }`}
        >
          {dayNum}
        </div>
        <div className={`text-[10px] font-semibold ${darkMode ? 'text-ink-400' : 'text-ink-400'}`}>
          {weekday}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-ink-900'}`}>
          Hosted by {event.host_name}
        </p>
        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            darkMode ? 'text-ink-400' : 'text-ink-500'
          }`}
        >
          <MapPinIcon className="w-3 h-3 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
        <div
          className={`flex items-center gap-1 mt-0.5 text-xs ${
            darkMode ? 'text-ink-400' : 'text-ink-500'
          }`}
        >
          <CalendarIcon className="w-3 h-3 shrink-0" />
          <span>{time}</span>
        </div>
      </div>

      {/* Spots badge */}
      <span
        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold ${
          spotsLeft <= 0
            ? darkMode
              ? 'bg-ink-700 text-ink-400'
              : 'bg-ink-100 text-ink-400'
            : spotsLeft <= 2
              ? 'bg-amber-500 text-white'
              : 'bg-primary-600 text-white'
        }`}
      >
        {spotsLeft <= 0 ? 'Full' : `${spotsLeft} left`}
      </span>
    </button>
  )
}
