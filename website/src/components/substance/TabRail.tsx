'use client';

/**
 * TabRail — four-tab pill selector for substance detail pages.
 * Tabs crossfade at 400ms when clicked. Uses CSS classes for styling.
 */
export default function TabRail({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}) {
  return (
    <div className="flex gap-3 border-b border-[var(--paper-line)] pb-4">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(idx)}
          className={`px-4 py-2 rounded-full text-sm font-data transition-all ${
            activeTab === idx
              ? 'bg-[var(--teal)] text-white'
              : 'bg-[var(--paper-warm)] text-[var(--ink)] hover:bg-[var(--paper-deep)]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
