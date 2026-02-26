import { Fragment, useState } from 'react'
import {
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  Gamepad2Icon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { GAME_DATA, GAME_TITLES, LOCATIONS } from '../data/games'
import type { Event } from '../types'

type Props = {
  darkMode: boolean
  onCancel: () => void
  onCreated: (event: Event) => void
}

export function CreateEventForm({ darkMode, onCancel, onCreated }: Props) {
  const [formStep, setFormStep] = useState(1)
  const [hostName, setHostName] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [gameName, setGameName] = useState('')
  const [totalPlayers, setTotalPlayers] = useState('')
  const [gameLocation, setGameLocation] = useState('')
  const [gameNotes, setGameNotes] = useState('')
  const [gameTime, setGameTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    { step: 1, label: 'Game Details' },
    { step: 2, label: 'Location' },
    { step: 3, label: 'Schedule' },
  ]

  const step1Valid = !!gameName && !!totalPlayers && !!hostName && !!hostEmail
  const step2Valid = !!gameLocation
  const step3Valid = !!gameTime

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const gameData = GAME_DATA[gameName] ?? GAME_DATA['Other']

    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        title: gameName,
        host_name: hostName,
        host_email: hostEmail,
        location: gameLocation,
        scheduled_at: gameTime,
        total_players: parseInt(totalPlayers),
        notes: gameNotes || null,
        game_type: gameData.type,
        image_url: gameData.image,
      })
      .select()
      .single()

    setIsSubmitting(false)

    if (insertError || !data) {
      setError('Failed to create event. Please try again.')
      return
    }

    onCreated(data)
  }

  return (
    <div
      className={`w-full max-w-md text-left rounded-2xl border p-6 shadow-xl ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      <h2
        className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}
      >
        Create New Event
      </h2>

      {/* Step Indicator */}
      <div className="flex items-start mb-6">
        {steps.map(({ step, label }, idx) => (
          <Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors flex-shrink-0 ${
                  formStep >= step
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step}
              </div>
              <span
                className={`mt-1.5 text-xs whitespace-nowrap ${
                  formStep >= step
                    ? darkMode
                      ? 'text-indigo-400'
                      : 'text-indigo-600'
                    : darkMode
                      ? 'text-slate-500'
                      : 'text-slate-400'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`flex-1 h-1 mx-2 mt-4 rounded transition-colors ${
                  formStep > step
                    ? 'bg-indigo-600'
                    : darkMode
                      ? 'bg-slate-700'
                      : 'bg-slate-200'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Game Details */}
        {formStep === 1 && (
          <>
            <Field label="Host Name" darkMode={darkMode}>
              <InputWithIcon icon={<UserIcon className={iconClass(darkMode)} />}>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g., Alex M."
                  required
                  className={inputClass(darkMode)}
                />
              </InputWithIcon>
            </Field>

            <Field label="Host Email" darkMode={darkMode}>
              <InputWithIcon icon={<MailIcon className={iconClass(darkMode)} />}>
                <input
                  type="email"
                  value={hostEmail}
                  onChange={(e) => setHostEmail(e.target.value)}
                  placeholder="e.g., alex@example.com"
                  required
                  className={inputClass(darkMode)}
                />
              </InputWithIcon>
            </Field>

            <Field label="Game Name" darkMode={darkMode}>
              <InputWithIcon icon={<Gamepad2Icon className={iconClass(darkMode)} />} hasChevron>
                <select
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  required
                  className={`${inputClass(darkMode)} pr-10 appearance-none ${!gameName ? (darkMode ? 'text-slate-500' : 'text-slate-400') : ''}`}
                >
                  <option value="" disabled>Select a game</option>
                  {GAME_TITLES.map((title) => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Total Players" darkMode={darkMode}>
              <InputWithIcon icon={<UsersIcon className={iconClass(darkMode)} />}>
                <input
                  type="number"
                  value={totalPlayers}
                  onChange={(e) => setTotalPlayers(e.target.value)}
                  placeholder="e.g., 4"
                  min="2"
                  max="20"
                  required
                  className={inputClass(darkMode)}
                />
              </InputWithIcon>
            </Field>
          </>
        )}

        {/* Step 2: Location & Notes */}
        {formStep === 2 && (
          <>
            <Field label="Location" darkMode={darkMode}>
              <InputWithIcon icon={<MapPinIcon className={iconClass(darkMode)} />} hasChevron>
                <select
                  value={gameLocation}
                  onChange={(e) => setGameLocation(e.target.value)}
                  required
                  className={`${inputClass(darkMode)} pr-10 appearance-none ${!gameLocation ? (darkMode ? 'text-slate-500' : 'text-slate-400') : ''}`}
                >
                  <option value="" disabled>Select a location</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc.name} value={`${loc.name}, ${loc.city}`}>
                      {loc.name} — {loc.city}
                    </option>
                  ))}
                </select>
              </InputWithIcon>
            </Field>

            <Field label="Notes" darkMode={darkMode}>
              <textarea
                value={gameNotes}
                onChange={(e) => setGameNotes(e.target.value)}
                placeholder="Any additional details, house rules, or things players should know..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                  darkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </Field>
          </>
        )}

        {/* Step 3: Date & Time */}
        {formStep === 3 && (
          <>
            <Field label="Date" darkMode={darkMode}>
              <InputWithIcon icon={<CalendarIcon className={iconClass(darkMode)} />}>
                <input
                  type="date"
                  value={gameTime.split('T')[0] || ''}
                  onChange={(e) => {
                    const time = gameTime.split('T')[1] || '19:00'
                    setGameTime(`${e.target.value}T${time}`)
                  }}
                  required
                  className={`${inputClass(darkMode)} ${darkMode ? '[color-scheme:dark]' : ''}`}
                />
              </InputWithIcon>
            </Field>

            <Field label="Time" darkMode={darkMode}>
              <InputWithIcon icon={<ClockIcon className={iconClass(darkMode)} />}>
                <input
                  type="time"
                  value={gameTime.split('T')[1] || ''}
                  onChange={(e) => {
                    const date =
                      gameTime.split('T')[0] ||
                      new Date().toISOString().split('T')[0]
                    setGameTime(`${date}T${e.target.value}`)
                  }}
                  required
                  className={`${inputClass(darkMode)} ${darkMode ? '[color-scheme:dark]' : ''}`}
                />
              </InputWithIcon>
            </Field>

            {gameTime && (
              <div
                className={`p-4 rounded-xl ${darkMode ? 'bg-slate-700/50' : 'bg-indigo-50'}`}
              >
                <p
                  className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  Selected Date & Time:
                </p>
                <p
                  className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-indigo-600'}`}
                >
                  {new Date(gameTime).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {new Date(gameTime).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={formStep === 1 ? onCancel : () => setFormStep(formStep - 1)}
            className={`flex-1 px-4 py-3 font-semibold rounded-xl transition-colors ${
              darkMode
                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {formStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {formStep < 3 ? (
            <button
              type="button"
              onClick={() => setFormStep(formStep + 1)}
              disabled={
                (formStep === 1 && !step1Valid) ||
                (formStep === 2 && !step2Valid)
              }
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!step3Valid || isSubmitting}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

// Small helpers to reduce repetition in the form fields

function iconClass(darkMode: boolean) {
  return `absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`
}

function inputClass(darkMode: boolean) {
  return `w-full pl-10 pr-4 py-3 rounded-xl border transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
    darkMode
      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
  }`
}

function Field({
  label,
  darkMode,
  children,
}: {
  label: string
  darkMode: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function InputWithIcon({
  icon,
  hasChevron = false,
  children,
}: {
  icon: React.ReactNode
  hasChevron?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      {icon}
      {children}
      {hasChevron && (
        <ChevronRightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rotate-90 pointer-events-none text-slate-400" />
      )}
    </div>
  )
}
