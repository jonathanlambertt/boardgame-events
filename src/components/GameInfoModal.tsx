import { useState } from 'react'
import {
  ArrowLeftIcon,
  ClockIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react'
import { joinEvent } from '../lib/joinEvent'
import type { Event } from '../types'

type Props = {
  event: Event
  attendeeCount: number
  darkMode: boolean
  onClose: () => void
  onJoined: () => void
}

type Step = 'details' | 'join'

export function GameInfoModal({ event, attendeeCount, darkMode, onClose, onJoined }: Props) {
  const [step, setStep] = useState<Step>('details')
  const [joinName, setJoinName] = useState('')
  const [joinEmail, setJoinEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPlayers = attendeeCount + 1
  const isFull = currentPlayers >= event.total_players
  const scheduledDate = new Date(event.scheduled_at)
  const formattedDateTime = `${scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })} at ${scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`
  const shortDateTime = `${scheduledDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })} · ${scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`

  const goToJoin = () => {
    setError(null)
    setStep('join')
  }

  const goBackToDetails = () => {
    setError(null)
    setStep('details')
  }

  const handleJoin = async () => {
    if (!joinName || !joinEmail) return
    setIsSubmitting(true)
    setError(null)

    try {
      await joinEvent({
        data: {
          eventId: event.id,
          eventTitle: event.title,
          eventLocation: event.location,
          eventDateTime: formattedDateTime,
          eventNotes: event.notes ?? undefined,
          hostName: event.host_name,
          hostEmail: event.host_email,
          joinerName: joinName,
          joinerEmail: joinEmail,
        },
      })
      onJoined()
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl transition-colors ${
          darkMode ? 'bg-ink-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {step === 'details' ? (
            <>
              {/* Hero Image */}
              <div className="relative">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide bg-primary-600 text-white shadow-md">
                  {event.game_type}
                </span>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors backdrop-blur-sm"
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="font-display text-2xl font-semibold text-white drop-shadow-md tracking-tight">
                    {event.title}
                  </h2>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <DetailCard
                    darkMode={darkMode}
                    icon={
                      <UserIcon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                      />
                    }
                    label="Host"
                    value={event.host_name}
                  />
                  <DetailCard
                    darkMode={darkMode}
                    icon={
                      <UsersIcon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                      />
                    }
                    label="Players"
                    value={`${currentPlayers}/${event.total_players}`}
                  />
                </div>

                <DetailCard
                  darkMode={darkMode}
                  icon={
                    <ClockIcon
                      className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                    />
                  }
                  label="Date & Time"
                  value={formattedDateTime}
                />
                <DetailCard
                  darkMode={darkMode}
                  icon={
                    <MapPinIcon
                      className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                    />
                  }
                  label="Location"
                  value={event.location}
                />

                {event.notes && (
                  <DetailCard
                    darkMode={darkMode}
                    icon={
                      <InfoIcon
                        className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                      />
                    }
                    label="Notes"
                    value={event.notes}
                    muted
                  />
                )}

                <button
                  onClick={goToJoin}
                  disabled={isFull}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
                >
                  {isFull ? 'Game Full' : 'Join Game'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Join header */}
              <div
                className={`flex items-center gap-3 px-5 py-4 border-b ${
                  darkMode ? 'border-ink-700' : 'border-ink-100'
                }`}
              >
                <button
                  onClick={goBackToDetails}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    darkMode
                      ? 'hover:bg-ink-700 text-ink-200'
                      : 'hover:bg-ink-100 text-ink-700'
                  }`}
                  aria-label="Back to details"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      darkMode ? 'text-ink-500' : 'text-ink-400'
                    }`}
                  >
                    Joining
                  </p>
                  <p
                    className={`font-display text-lg font-semibold truncate leading-tight ${
                      darkMode ? 'text-white' : 'text-ink-900'
                    }`}
                  >
                    {event.title}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    darkMode
                      ? 'hover:bg-ink-700 text-ink-400'
                      : 'hover:bg-ink-100 text-ink-500'
                  }`}
                  aria-label="Close"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Recap */}
              <div
                className={`mx-5 mt-5 p-4 rounded-2xl text-sm ${
                  darkMode ? 'bg-ink-700/50' : 'bg-ink-50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <ClockIcon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                  />
                  <span className={darkMode ? 'text-ink-200' : 'text-ink-800'}>
                    {shortDateTime}
                  </span>
                </div>
                <div className="flex items-start gap-2.5 mt-2">
                  <MapPinIcon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                  />
                  <span
                    className={`truncate ${darkMode ? 'text-ink-200' : 'text-ink-800'}`}
                  >
                    {event.location}
                  </span>
                </div>
              </div>

              {/* Form */}
              <div className="px-5 pt-5 pb-6 space-y-4">
                <div>
                  <label
                    htmlFor="joinName"
                    className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-ink-300' : 'text-ink-700'}`}
                  >
                    Your name
                  </label>
                  <div className="relative">
                    <UserIcon
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-ink-500' : 'text-ink-400'}`}
                    />
                    <input
                      type="text"
                      id="joinName"
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      placeholder="Jane Smith"
                      autoFocus
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-ink-700 border-ink-600 text-white placeholder:text-ink-500'
                          : 'bg-ink-50 border-ink-200 text-ink-900 placeholder:text-ink-400'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="joinEmail"
                    className={`block text-sm font-semibold mb-1.5 ${darkMode ? 'text-ink-300' : 'text-ink-700'}`}
                  >
                    Your email
                  </label>
                  <div className="relative">
                    <MailIcon
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-ink-500' : 'text-ink-400'}`}
                    />
                    <input
                      type="email"
                      id="joinEmail"
                      value={joinEmail}
                      onChange={(e) => setJoinEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        darkMode
                          ? 'bg-ink-700 border-ink-600 text-white placeholder:text-ink-500'
                          : 'bg-ink-50 border-ink-200 text-ink-900 placeholder:text-ink-400'
                      }`}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  onClick={handleJoin}
                  disabled={!joinName || !joinEmail || isSubmitting}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Confirm spot'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailCard({
  darkMode,
  icon,
  label,
  value,
  muted = false,
}: {
  darkMode: boolean
  icon: React.ReactNode
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-ink-700/50' : 'bg-ink-50'}`}
    >
      {icon}
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${darkMode ? 'text-ink-500' : 'text-ink-400'}`}
        >
          {label}
        </p>
        <p
          className={`text-sm ${muted ? (darkMode ? 'text-ink-300' : 'text-ink-700') : `font-bold ${darkMode ? 'text-white' : 'text-ink-900'}`}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
