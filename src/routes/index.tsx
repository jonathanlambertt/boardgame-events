import { useState, useEffect, useRef } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { DicesIcon, MoonIcon, PlusCircleIcon, SunIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BottomNav } from '../components/BottomNav'
import { GameCard } from '../components/GameCard'
import { GameInfoModal } from '../components/GameInfoModal'
import { CreateEventForm } from '../components/CreateEventForm'
import { Toast } from '../components/Toast'
import { Logo } from '../components/Logo'
import type { Event } from '../types'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const [activeTab, setActiveTab] = useState<'find' | 'host' | 'settings'>('find')
  const [darkMode, setDarkMode] = useState(false)
  const darkModeInitialized = useRef(false)
  const [events, setEvents] = useState<Event[]>([])
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showJoinToast, setShowJoinToast] = useState(false)

  useEffect(() => {
    if (!darkModeInitialized.current) {
      darkModeInitialized.current = true
      setDarkMode(localStorage.getItem('darkMode') === 'true')
      return
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setIsLoading(true)

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('scheduled_at', { ascending: true })

    if (eventsData) {
      setEvents(eventsData)

      const { data: attendeesData } = await supabase
        .from('attendees')
        .select('event_id')

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

  function handleEventCreated(event: Event) {
    setEvents((prev) => [event, ...prev])
    setShowCreateForm(false)
    setActiveTab('find')
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

  return (
    <main
      className={`min-h-screen w-full relative overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-ink-950' : 'bg-white'
      }`}
    >

      {/* Game Info Modal */}
      {selectedEvent && (
        <GameInfoModal
          event={selectedEvent}
          attendeeCount={attendeeCounts[selectedEvent.id] ?? 0}
          darkMode={darkMode}
          onClose={() => setSelectedEvent(null)}
          onJoined={handleJoined}
        />
      )}

      <div className="relative z-10 flex flex-col min-h-screen pt-18 pb-24">
        {/* Header */}
        <nav
          className={`fixed top-0 left-0 right-0 z-40 border-b transition-colors duration-300 ${
            darkMode
              ? 'bg-ink-950/90 border-ink-800/80 backdrop-blur-md'
              : 'bg-white/90 border-ink-100 backdrop-blur-md'
          }`}
        >
          <div className="flex items-center justify-center px-6 py-3.5 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <Logo size={30} />
              <span
                className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-ink-900'
                }`}
              >
                Tabletop
              </span>
            </div>
          </div>
        </nav>

        {/* Find Tab */}
        {activeTab === 'find' && (
          <section className="px-6 py-10 flex-1">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <h2
                  className={`font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] ${
                    darkMode ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  Nearby games
                </h2>
                <p
                  className={`mt-3 text-base ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}
                >
                  Find a table and join the fun.
                </p>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center py-24 text-center rounded-3xl border ${
                    darkMode ? 'border-ink-800 bg-ink-900/40' : 'border-ink-100 bg-ink-50'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                      darkMode ? 'bg-ink-800' : 'bg-white'
                    }`}
                  >
                    <DicesIcon
                      className={`w-8 h-8 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                    />
                  </div>
                  <h3
                    className={`font-display text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-ink-900'}`}
                  >
                    No games nearby yet
                  </h3>
                  <p
                    className={`text-sm mb-6 max-w-xs leading-relaxed ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}
                  >
                    Be the first to bring people together. Host a game night in your area.
                  </p>
                  <button
                    onClick={() => setActiveTab('host')}
                    className="px-6 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-full hover:bg-primary-600 transition-colors"
                  >
                    Host a game
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {events.map((event) => (
                    <GameCard
                      key={event.id}
                      event={event}
                      attendeeCount={attendeeCounts[event.id] ?? 0}
                      darkMode={darkMode}
                      onMoreInfo={setSelectedEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Host Tab */}
        {activeTab === 'host' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            {!showCreateForm ? (
              <>
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    darkMode ? 'bg-ink-800' : 'bg-ink-50'
                  }`}
                >
                  <PlusCircleIcon
                    className={`w-10 h-10 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`}
                  />
                </div>
                <h2
                  className={`font-display text-4xl font-semibold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-ink-900'}`}
                >
                  Host a game night
                </h2>
                <p
                  className={`max-w-sm mb-8 leading-relaxed ${darkMode ? 'text-ink-400' : 'text-ink-500'}`}
                >
                  Ready to bring people together? Create an event, set the game, and invite players from your community.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 transition-colors"
                >
                  Create event
                </button>
              </>
            ) : (
              <CreateEventForm
                darkMode={darkMode}
                onCancel={() => setShowCreateForm(false)}
                onCreated={handleEventCreated}
              />
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="flex-1 p-6 max-w-md mx-auto w-full">
            <h2
              className={`text-2xl font-extrabold tracking-tight mb-6 ${darkMode ? 'text-white' : 'text-ink-900'}`}
            >
              Settings
            </h2>
            <div
              className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-ink-800 border-ink-700' : 'bg-white border-ink-100 shadow-sm'}`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <MoonIcon className="w-5 h-5 text-primary-400" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-ink-400" />
                  )}
                  <span
                    className={`font-semibold ${darkMode ? 'text-ink-200' : 'text-ink-700'}`}
                  >
                    Dark Mode
                  </span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                    darkMode ? 'bg-primary-600' : 'bg-ink-200'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      darkMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Legal links */}
            <div className={`mt-6 rounded-2xl border overflow-hidden ${darkMode ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-100'}`}>
              {[
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(({ label, to }, i, arr) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors ${
                    darkMode
                      ? 'text-ink-300 hover:bg-ink-800'
                      : 'text-ink-700 hover:bg-ink-50'
                  } ${i < arr.length - 1 ? `border-b ${darkMode ? 'border-ink-800' : 'border-ink-100'}` : ''}`}
                >
                  {label}
                  <span className={darkMode ? 'text-ink-500' : 'text-ink-400'}>›</span>
                </Link>
              ))}
            </div>

            <p className={`mt-8 text-center text-xs ${darkMode ? 'text-ink-500' : 'text-ink-400'}`}>
              © {new Date().getFullYear()} Tabletop. All rights reserved.
            </p>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />

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
