import { useEffect } from 'react'
import { CheckCircleIcon } from 'lucide-react'

type Props = {
  message: string
  subMessage?: string
  darkMode: boolean
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, subMessage, darkMode, onDismiss, duration = 4000 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div
        className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-xl border ${
          darkMode
            ? 'bg-slate-800 border-slate-700 shadow-black/40'
            : 'bg-white border-slate-200 shadow-slate-200/80'
        }`}
      >
        <CheckCircleIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {message}
          </p>
          {subMessage && (
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {subMessage}
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className={`text-xs font-medium flex-shrink-0 mt-0.5 ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} transition-colors`}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
