import { PlusCircleIcon, SearchIcon, SettingsIcon } from 'lucide-react'

type Tab = 'find' | 'host' | 'settings'

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  darkMode: boolean
}

export function BottomNav({ activeTab, onTabChange, darkMode }: Props) {
  const tabs: { id: Tab; label: string; Icon: typeof SearchIcon }[] = [
    { id: 'find', label: 'Find', Icon: SearchIcon },
    { id: 'host', label: 'Host', Icon: PlusCircleIcon },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon },
  ]

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 px-6 py-2 flex justify-around items-center z-50 pb-safe transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-800 border-t border-slate-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]'
          : 'bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'
      }`}
    >
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[64px] ${
            activeTab === id
              ? darkMode
                ? 'text-indigo-400 bg-indigo-500/20'
                : 'text-indigo-600 bg-indigo-50'
              : darkMode
                ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
