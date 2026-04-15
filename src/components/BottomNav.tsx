import { PlusCircleIcon, SearchIcon, SettingsIcon } from "lucide-react";

type Tab = "find" | "host" | "settings";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  darkMode: boolean;
};

export function BottomNav({ activeTab, onTabChange, darkMode }: Props) {
  const tabs: { id: Tab; label: string; Icon: typeof SearchIcon }[] = [
    { id: "find", label: "Find", Icon: SearchIcon },
    { id: "host", label: "Host", Icon: PlusCircleIcon },
    { id: "settings", label: "Settings", Icon: SettingsIcon },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 px-6 py-2 flex justify-around items-center z-50 pb-safe transition-colors duration-300 ${
        darkMode
          ? "bg-ink-950/90 border-t border-ink-800/80 backdrop-blur-md"
          : "bg-white/90 border-t border-ink-100 backdrop-blur-md"
      }`}
    >
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-16 ${
            activeTab === id
              ? darkMode
                ? "text-primary-400"
                : "text-primary-500"
              : darkMode
                ? "text-ink-500 hover:text-ink-200"
                : "text-ink-400 hover:text-ink-700"
          }`}
        >
          <Icon size={22} strokeWidth={activeTab === id ? 2.2 : 1.8} />
          <span className="text-[11px] font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}
