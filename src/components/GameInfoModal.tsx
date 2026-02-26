import { useState } from 'react'
import {
  ClockIcon,
  InfoIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Event } from '../types'

type Props = {
  event: Event
  attendeeCount: number
  darkMode: boolean
  onClose: () => void
  onJoined: () => void
}

export function GameInfoModal({ event, attendeeCount, darkMode, onClose, onJoined }: Props) {
  const [showJoinEmail, setShowJoinEmail] = useState(false)
  const [joinEmail, setJoinEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPlayers = attendeeCount + 1
  const scheduledDate = new Date(event.scheduled_at)
  const formattedDateTime = `${scheduledDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })} at ${scheduledDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })}`

  const handleJoin = async () => {
    if (!joinEmail) return
    setIsSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase
      .from('attendees')
      .insert({ event_id: event.id, email: joinEmail })

    setIsSubmitting(false)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      return
    }

    onJoined()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl transition-colors ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Image */}
        <div className="relative">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide bg-indigo-600 text-white shadow">
            {event.game_type}
          </span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
          >
            <XIcon className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <DetailCard darkMode={darkMode} icon={<UserIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />} label="Host" value={event.host_name} />
            <DetailCard darkMode={darkMode} icon={<UsersIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />} label="Players" value={`${currentPlayers}/${event.total_players}`} />
          </div>

          <DetailCard darkMode={darkMode} icon={<ClockIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />} label="Date & Time" value={formattedDateTime} />
          <DetailCard darkMode={darkMode} icon={<MapPinIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />} label="Location" value={event.location} />

          {event.notes && (
            <DetailCard darkMode={darkMode} icon={<InfoIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />} label="Notes" value={event.notes} muted />
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!showJoinEmail ? (
            <button
              onClick={() => setShowJoinEmail(true)}
              disabled={currentPlayers >= event.total_players}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentPlayers >= event.total_players ? 'Game Full' : 'Join Game'}
            </button>
          ) : (
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="joinEmail"
                  className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Your Email
                </label>
                <div className="relative">
                  <MailIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
                  />
                  <input
                    type="email"
                    id="joinEmail"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoFocus
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      darkMode
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                    }`}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowJoinEmail(false); setJoinEmail('') }}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-colors ${
                    darkMode
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!joinEmail || isSubmitting}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Confirm'}
                </button>
              </div>
            </div>
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
      className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
    >
      {icon}
      <div>
        <p
          className={`text-xs font-medium uppercase tracking-wide mb-0.5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}
        >
          {label}
        </p>
        <p
          className={`text-sm ${muted ? (darkMode ? 'text-slate-300' : 'text-slate-700') : `font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
