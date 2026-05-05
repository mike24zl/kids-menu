import { useAuth } from '../hooks/useAuth'
import { useLang } from '../i18n/LangContext'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { t } = useLang()

  if (!user) return null

  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="flex items-center gap-2">
      {avatar && (
        <img
          src={avatar}
          alt=""
          referrerPolicy="no-referrer"
          className="w-8 h-8 rounded-full border-2 border-orange-300 shrink-0"
        />
      )}
      <button
        onClick={signOut}
        className="px-2.5 py-1.5 rounded-xl font-nunito font-bold text-sm bg-white text-gray-600 border-2 border-gray-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all"
      >
        <span className="hidden sm:inline">{t.signOut}</span>
        <span className="sm:hidden">✕</span>
      </button>
    </div>
  )
}
