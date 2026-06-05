import { formatWeekLabel } from '../utils/dates'
import { useLang } from '../i18n/LangContext'
import UserMenu from './UserMenu'
import KidSelector from './KidSelector'

export default function Header({
  weekStart, weekOffset,
  onPrevWeek, onNextWeek, onToday,
  parentMode, onToggleParent,
  saveStatus,
  kids, selectedKidId, onSelectKid,
}) {
  const { lang, switchLang, t } = useLang()

  return (
    <header className="flex flex-col gap-1 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md mx-2 mt-2">

      {/* Row 1: title + controls */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl shrink-0">🍽️</span>
        <h1 className="font-fredoka text-lg text-orange-600 leading-tight flex-1 min-w-0 truncate">
          {t.title}
        </h1>

        <span className={`font-nunito text-xs transition-opacity duration-500
          ${saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
          {saveStatus === 'saving' && <span className="text-gray-400">⏳</span>}
          {saveStatus === 'saved'  && <span className="text-green-500">✓</span>}
        </span>

        <UserMenu />

        <div className="flex rounded-xl overflow-hidden border-2 border-purple-200 shadow-sm shrink-0">
          {['en', 'he'].map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`px-2 py-0.5 font-nunito font-bold text-xs transition-colors
                ${lang === l ? 'bg-purple-500 text-white' : 'bg-white text-purple-500 hover:bg-purple-50'}`}
            >
              {l === 'en' ? 'EN' : 'עב'}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleParent}
          className={`flex items-center gap-1 px-2 py-1 rounded-xl font-nunito font-bold text-xs transition-all shadow shrink-0
            ${parentMode ? 'bg-purple-500 text-white' : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'}`}
        >
          <span>{parentMode ? '🔓' : '👨‍👩‍👧'}</span>
          <span className="hidden sm:inline">{parentMode ? t.exitParent : t.parent}</span>
        </button>
      </div>

      {/* Row 2: week navigation */}
      <div className="flex items-center justify-center gap-1.5">
        <button onClick={onPrevWeek}
          className="px-2 py-0.5 rounded-lg hover:bg-orange-100 text-orange-400 hover:text-orange-600 font-nunito font-bold text-xs transition-colors">
          {t.prevWeek}
        </button>

        <span className="font-nunito text-xs font-bold text-orange-500">
          {formatWeekLabel(weekStart, t.locale)}
        </span>

        <button onClick={onNextWeek}
          className="px-2 py-0.5 rounded-lg hover:bg-orange-100 text-orange-400 hover:text-orange-600 font-nunito font-bold text-xs transition-colors">
          {t.nextWeek}
        </button>

        {weekOffset !== 0 && (
          <button onClick={onToday}
            className="px-2 py-0.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 font-nunito font-bold text-xs transition-colors">
            {t.today}
          </button>
        )}
      </div>

      {/* Row 3: kid selector (only when kids exist) */}
      {kids && kids.length > 0 && (
        <div className="flex items-center justify-center">
          <KidSelector kids={kids} selectedKidId={selectedKidId} onSelect={onSelectKid} />
        </div>
      )}

    </header>
  )
}
