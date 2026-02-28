import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { DicesIcon, MoonIcon, PlusCircleIcon, SunIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { BottomNav } from '../components/BottomNav'
import { GameCard } from '../components/GameCard'
import { GameInfoModal } from '../components/GameInfoModal'
import { CreateEventForm } from '../components/CreateEventForm'
import type { Event } from '../types'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const [activeTab, setActiveTab] = useState<'find' | 'host' | 'settings'>('find')
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') !== 'false'
  })
  const [events, setEvents] = useState<Event[]>([])
  const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
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
  }

  return (
    <main
      className={`min-h-screen w-full relative overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-slate-900' : 'bg-slate-50'
      }`}
    >
      {/* Background grid pattern */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${darkMode ? 'opacity-[0.05]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${darkMode ? '#818cf8' : '#4f46e5'} 1px, transparent 1px),
            linear-gradient(to bottom, ${darkMode ? '#818cf8' : '#4f46e5'} 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Decorative dice */}
      {[
        { top: 'top-20', left: 'left-[10%]', rotate: 'rotate-12', opacity: 'opacity-60', size: 48 },
        { top: 'top-32', left: 'right-[15%]', rotate: '-rotate-12', opacity: 'opacity-50', size: 32 },
        { top: 'bottom-32', left: 'left-[20%]', rotate: 'rotate-45', opacity: 'opacity-40', size: 40 },
        { top: 'bottom-24', left: 'right-[12%]', rotate: '-rotate-6', opacity: 'opacity-50', size: 36 },
      ].map((d, i) => (
        <div
          key={i}
          className={`absolute ${d.top} ${d.left} ${d.rotate} ${d.opacity} pointer-events-none transition-colors duration-300 ${darkMode ? 'text-indigo-400' : 'text-indigo-200'}`}
        >
          <DicesIcon size={d.size} strokeWidth={1.5} />
        </div>
      ))}

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
              ? 'bg-slate-800 border-slate-700 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]'
              : 'bg-white border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]'
          }`}
        >
          <div className="flex items-center justify-center px-6 py-4 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <DicesIcon className="text-white" size={24} />
              </div>
              <span
                className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-slate-800'
                }`}
              >
                Tabletop
              </span>
            </div>
          </div>
        </nav>

        {/* Find Tab */}
        {activeTab === 'find' && (
          <section className="px-6 py-8 flex-1">
            <div className="max-w-7xl mx-auto">
              <h2
                className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Nearby Games
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center py-16 text-center rounded-2xl border-2 border-dashed ${
                    darkMode ? 'border-slate-700' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50'
                    }`}
                  >
                    <DicesIcon
                      className={`w-8 h-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                  >
                    No games nearby yet
                  </h3>
                  <p
                    className={`text-sm mb-5 max-w-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    Be the first to bring people together! <br />
                    Host a game night in your area.
                  </p>
                  <button
                    onClick={() => setActiveTab('host')}
                    className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    Host a Game
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                    darkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
                  }`}
                >
                  <PlusCircleIcon
                    className={`w-10 h-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
                  />
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                >
                  Host a Game Night
                </h2>
                <p
                  className={`max-w-md mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Ready to bring people together? Create an event, set the game,
                  and invite players from your community.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  Create Event
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
              className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              Settings
            </h2>
            <div
              className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? (
                    <MoonIcon className="w-5 h-5 text-indigo-400" />
                  ) : (
                    <SunIcon className="w-5 h-5 text-slate-400" />
                  )}
                  <span
                    className={`font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}
                  >
                    Dark Mode
                  </span>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                    darkMode ? 'bg-indigo-600' : 'bg-slate-200'
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
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} darkMode={darkMode} />
    </main>
  )
}
