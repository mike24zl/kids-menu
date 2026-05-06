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
    <header className="flex flex-col gap-2 px-3 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md mx-2 mt-2">

      {/* Row 1: title full width */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-3xl">🍽️</span>
        <h1 className="font-fredoka text-2xl text-orange-600 leading-tight">
          {t.title}
        </h1>
      </div>

      {/* Row 2: buttons */}
      <div className="flex items-center justify-center gap-1.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <UserMenu />

          {/* Language toggle */}
          <div className="flex rounded-xl overflow-hidden border-2 border-purple-200 shadow-sm">
            {['en', 'he'].map(l => (
              <button
                key={l}
                onClick={() => switchLang(l)}
                className={`px-2.5 py-1 font-nunito font-bold text-sm transition-colors
                  ${lang === l
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-500 hover:bg-purple-50'
                  }`}
              >
                {l === 'en' ? 'EN' : 'עב'}
              </button>
            ))}
          </div>

          {/* Auto-save status */}
          <span className={`font-nunito text-xs transition-opacity duration-500 min-w-[4rem] text-center
            ${saveStatus === 'idle' ? 'opacity-0' : 'opacity-100'}`}>
            {saveStatus === 'saving' && <span className="text-gray-400">⏳ {t.saving}</span>}
            {saveStatus === 'saved'  && <span className="text-green-500">✓ {t.saved}</span>}
          </span>

          {/* Parent toggle */}
          <button
            onClick={onToggleParent}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-nunito font-bold text-sm transition-all shadow
              ${parentMode
                ? 'bg-purple-500 text-white'
                : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'
              }`}
          >
            <span>{parentMode ? '🔓' : '👨‍👩‍👧'}</span>
            <span className="hidden sm:inline">{parentMode ? t.exitParent : t.parent}</span>
          </button>
        </div>
      </div>

      {/* Row 3: week navigation */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={onPrevWeek}
          className="px-2.5 py-1 rounded-lg hover:bg-orange-100 text-orange-400 hover:text-orange-600 font-nunito font-bold text-xs transition-colors"
        >
          {t.prevWeek}
        </button>

        <span className="font-nunito text-sm font-bold text-orange-500">
          {formatWeekLabel(weekStart, t.locale)}
        </span>

        <button
          onClick={onNextWeek}
          className="px-2.5 py-1 rounded-lg hover:bg-orange-100 text-orange-400 hover:text-orange-600 font-nunito font-bold text-xs transition-colors"
        >
          {t.nextWeek}
        </button>

        {weekOffset !== 0 && (
          <button
            onClick={onToday}
            className="px-2.5 py-1 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-600 font-nunito font-bold text-xs transition-colors"
          >
            {t.today}
          </button>
        )}
      </div>

      {/* Row 4: kid selector (only when kids exist) */}
      {kids && kids.length > 0 && (
        <div className="flex items-center justify-center">
          <KidSelector
            kids={kids}
            selectedKidId={selectedKidId}
            onSelect={onSelectKid}
          />
        </div>
      )}

    </header>
  )
}
