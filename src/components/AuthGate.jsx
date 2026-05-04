import { useAuth } from '../hooks/useAuth'
import { useLang } from '../i18n/LangContext'

export default function AuthGate() {
  const { signInWithGoogle } = useAuth()
  const { t } = useLang()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-orange-50 to-amber-50 px-4" dir={t.dir}>
      <div className="text-center">
        <span className="text-8xl">🍽️</span>
        <h1 className="font-fredoka text-4xl text-orange-600 mt-4">{t.title}</h1>
        <p className="font-nunito text-gray-500 mt-2 max-w-xs">{t.signInPrompt}</p>
      </div>

      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-3 px-8 py-4 bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all font-nunito font-bold text-gray-700 text-lg"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-6 h-6"
        />
        {t.signInGoogle}
      </button>
    </div>
  )
}
