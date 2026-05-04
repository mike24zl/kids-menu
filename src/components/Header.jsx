import { formatWeekLabel } from '../utils/dates'
import { useLang } from '../i18n/LangContext'
import UserMenu from './UserMenu'

export default function Header({ weekStart, parentMode, onToggleParent, onSave, isDirty, saving }) {
  const { lang, switchLang, t } = useLang()

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white/60 backdrop-blur-sm rounded-2xl shadow-md mx-2 mt-2">
      <div className="flex items-center gap-2">
        <span className="text-4xl">🍽️</span>
        <div>
          <h1 className="font-fredoka text-2xl md:text-3xl text-orange-600 leading-tight">
            {t.title}
          </h1>
          <p className="font-nunito text-sm font-bold text-orange-400">
            {formatWeekLabel(weekStart, t.locale)}
          </p>
          <span className="font-nunito text-xs text-gray-400">v{__APP_VERSION__}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <UserMenu />

        {/* Language toggle */}
        <div className="flex rounded-xl overflow-hidden border-2 border-purple-200 shadow-sm">
          {['en', 'he'].map(l => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`px-3 py-1.5 font-nunito font-bold text-sm transition-colors
                ${lang === l
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-purple-500 hover:bg-purple-50'
                }`}
            >
              {l === 'en' ? 'EN' : 'עב'}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          disabled={!isDirty || saving}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-nunito font-bold text-sm transition-all shadow
            ${isDirty && !saving
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-white text-gray-300 border-2 border-gray-200 cursor-not-allowed'
            }`}
        >
          <span className="text-base">{saving ? '⏳' : '💾'}</span>
          <span className="hidden sm:inline">{saving ? t.saving : t.save}</span>
        </button>

        {/* Parent toggle */}
        <button
          onClick={onToggleParent}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-nunito font-bold text-sm transition-all shadow
            ${parentMode
              ? 'bg-purple-500 text-white'
              : 'bg-white text-purple-600 border-2 border-purple-300 hover:bg-purple-50'
            }`}
        >
          <span className="text-xl">{parentMode ? '🔓' : '👨‍👩‍👧'}</span>
          <span className="hidden sm:inline">{parentMode ? t.exitParent : t.parent}</span>
        </button>
      </div>
    </header>
  )
}
