'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { gradeActivity, mediaAssets } from '@/data/curriculum'
import { curriculumMediaUrl, resolveVideoUrl, videoCompletionMet } from './lessonVideo'
import type {
  ActivitySubmission,
  CurriculumActivity,
  CurriculumIsland,
  QuizResponse,
} from '@/data/curriculum'
import { Button } from './Button'
import { Panel, ActivityCard } from './Panel'
import { Badge } from './Badge'
import { HudProfile, HudStat } from './Hud'
import { ProgressMeter } from './ProgressMeter'
import { BottomNav } from './BottomNav'
import { StarIcon, MapIcon, PlayIcon, BookIcon, QuizIcon, UserIcon, BoxIcon } from './icons'

/* ------------------------------------------------------------------ */
/* Screen contract — 22 named states                                   */
/* ------------------------------------------------------------------ */

export type AppScreen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'enroll'
  | 'mission'
  | 'avatar'
  | 'dashboard'
  | 'island'
  | 'lessonReading'
  | 'lessonVideo'
  | 'ventSim'
  | 'quiz'
  | 'quizFeedback'
  | 'quizMatch'
  | 'quizDrag'
  | 'quizFill'
  | 'caseVignette'
  | 'quest'
  | 'activityComplete'
  | 'islandComplete'
  | 'finalExamIntro'
  | 'finalExamQuestion'
  | 'examResults'
  | 'courseComplete'
  | 'profile'
  | 'settings'
  | 'researcher'
  | 'offline'
  | 'accessDenied'

export const APP_SCREENS: AppScreen[] = [
  'welcome',
  'login',
  'register',
  'enroll',
  'mission',
  'avatar',
  'dashboard',
  'island',
  'lessonReading',
  'lessonVideo',
  'ventSim',
  'quiz',
  'quizFeedback',
  'quizMatch',
  'quizDrag',
  'quizFill',
  'caseVignette',
  'quest',
  'activityComplete',
  'islandComplete',
  'finalExamIntro',
  'finalExamQuestion',
  'examResults',
  'courseComplete',
  'profile',
  'settings',
  'researcher',
  'offline',
  'accessDenied',
]

/* ------------------------------------------------------------------ */
/* Curriculum projection                                               */
/* ------------------------------------------------------------------ */

type ActivityType =
  | 'reading'
  | 'video'
  | 'quiz'
  | 'sim'
  | 'matching'
  | 'ordering'
  | 'fill'
  | 'case'
  | 'quest'

type Activity = {
  id: string
  title: string
  type: ActivityType
  points: number
  minutes: number
  blurb: string
  available: boolean
  record: CurriculumActivity
}

type Island = {
  id: string
  name: string
  tagline: string
  activities: Activity[]
  finalExam: CurriculumActivity
}

function projectActivity(record: CurriculumActivity): Activity {
  let type: ActivityType
  if (record.type === 'vent_lab') type = 'sim'
  else if (record.type === 'case_vignette') type = 'case'
  else if (record.type === 'pending') type = 'quiz'
  else if (record.type !== 'quiz') type = record.type
  else {
    const interaction = record.content?.questions[0]?.interaction
    type =
      interaction === 'matching'
        ? 'matching'
        : interaction === 'drag_drop'
          ? 'ordering'
          : interaction === 'fill_blank'
            ? 'fill'
            : 'quiz'
  }

  return {
    id: record.activityId,
    title: record.title,
    type,
    points: record.peepPointsValue,
    minutes: record.estimatedMinutes,
    blurb: record.description ?? record.title,
    available: record.contentStatus === 'ready' && record.content !== null,
    record,
  }
}

function projectIsland(record: CurriculumIsland): Island {
  const finalExam = record.activities.find((activity) => !activity.countsTowardProgress)
  if (!finalExam) throw new Error(`${record.id} is missing its final exam slot`)

  return {
    id: record.id,
    name: record.name,
    tagline: record.description ?? record.name,
    activities: record.activities
      .filter((activity) => activity.countsTowardProgress)
      .map(projectActivity),
    finalExam,
  }
}

const ISLAND_SPOTS = [
  { left: '51%', top: '84%', tooltip: 'above' },
  { left: '60%', top: '64%', tooltip: 'above' },
  { left: '47%', top: '42%', tooltip: 'above' },
  { left: '21%', top: '29%', tooltip: 'right' },
  { left: '79%', top: '30%', tooltip: 'left' },
  { left: '55%', top: '12%', tooltip: 'below' },
] as const

const AVATARS = [
  { id: 'nova', label: 'Nova', role: 'Night-shift navigator' },
  { id: 'rex', label: 'Rex', role: 'Rapid-response scout' },
  { id: 'io', label: 'Io', role: 'Orbital intensivist' },
]

const RESEARCH_ROWS = [
  { island: 'Lake Mucosa', enrolled: 42, completion: 78, avgScore: 84, medianMin: 52 },
  { island: 'Interlobar Divides', enrolled: 36, completion: 64, avgScore: 79, medianMin: 47 },
  { island: 'Valley of Pulmonara', enrolled: 29, completion: 55, avgScore: 81, medianMin: 44 },
  { island: 'Bronchial Bluffs', enrolled: 24, completion: 46, avgScore: 76, medianMin: 39 },
  { island: 'Mount Pneumora', enrolled: 17, completion: 35, avgScore: 74, medianMin: 41 },
  { island: 'Alveolar Highlands', enrolled: 11, completion: 27, avgScore: 72, medianMin: 33 },
]

/* ------------------------------------------------------------------ */
/* Small local icons (kept in-file; icon set is intentionally minimal) */
/* ------------------------------------------------------------------ */

type IconProps = { className?: string }

function lineIcon(props: IconProps, paths: ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className ?? 'size-5'}
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}

const BackIcon = (p: IconProps) => lineIcon(p, <path d="M15 18l-6-6 6-6" />)
const LockIcon = (p: IconProps) =>
  lineIcon(
    p,
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  )
const CheckIcon = (p: IconProps) => lineIcon(p, <path d="m4 12.5 5 5L20 6.5" />)
const DownloadIcon = (p: IconProps) =>
  lineIcon(
    p,
    <>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M4 21h16" />
    </>
  )
const WifiOffIcon = (p: IconProps) =>
  lineIcon(
    p,
    <>
      <path d="m2 2 20 20" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M5 12.9a10 10 0 0 1 3.6-2.3" />
      <path d="M12 20h.01" />
    </>
  )
const ShieldIcon = (p: IconProps) =>
  lineIcon(
    p,
    <>
      <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  )
const WaveIcon = (p: IconProps) => lineIcon(p, <path d="M2 12h3l2-7 3 14 3-10 2 3h7" />)

const activityIcon: Record<ActivityType, (p: IconProps) => ReactNode> = {
  reading: BookIcon,
  video: PlayIcon,
  quiz: QuizIcon,
  sim: WaveIcon,
  matching: QuizIcon,
  ordering: QuizIcon,
  fill: QuizIcon,
  case: StarIcon,
  quest: UserIcon,
}

function MissionCrawl() {
  const crawlRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)
  const [playing, setPlaying] = useState(true)
  const [canAnimate, setCanAnimate] = useState(true)

  useEffect(() => {
    const animation = crawlRef.current?.getAnimations()[0]
    const progress = progressRef.current

    if (!animation || !progress) {
      const timer = window.setTimeout(() => {
        setCanAnimate(false)
        setPlaying(false)
      }, 0)
      return () => window.clearTimeout(timer)
    }

    const syncProgress = () => {
      const duration = Number(animation.effect?.getTiming().duration) || 1
      const percent = Math.min(100, (Number(animation.currentTime) / duration) * 100)
      progress.value = String(percent)
      progress.setAttribute('aria-valuetext', `${Math.round(percent)}%`)
    }

    animation.onfinish = () => setPlaying(false)
    syncProgress()
    const timer = window.setInterval(syncProgress, 100)

    return () => {
      animation.onfinish = null
      window.clearInterval(timer)
    }
  }, [])

  function togglePlayback() {
    const animation = crawlRef.current?.getAnimations()[0]
    if (!animation) return

    if (animation.playState === 'running') {
      animation.pause()
      setPlaying(false)
      return
    }

    const duration = Number(animation.effect?.getTiming().duration) || 1
    if (Number(animation.currentTime) >= duration) animation.currentTime = 0
    animation.play()
    setPlaying(true)
  }

  function seek(event: ChangeEvent<HTMLInputElement>) {
    const animation = crawlRef.current?.getAnimations()[0]
    if (!animation) return

    const duration = Number(animation.effect?.getTiming().duration) || 1
    animation.currentTime = (Number(event.currentTarget.value) / 100) * duration
    if (playing) animation.play()
    else animation.pause()
  }

  function restart() {
    const animation = crawlRef.current?.getAnimations()[0]
    if (!animation) return
    animation.currentTime = 0
    animation.play()
    setPlaying(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="mission-crawl-stage">
        <div ref={crawlRef} className="mission-crawl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em]">
            Mission briefing
          </p>
          <h2 className="my-5 text-3xl font-black uppercase tracking-wide">Your orders, Nurse</h2>
          <p>
            Atelecta Prime is in respiratory distress. Across six islands you will master the RN IMV
            competency domains: airway and interfaces, alarms and troubleshooting, waveforms, blood
            gases, advanced modes, and weaning.
          </p>
          <ol className="my-7 flex flex-col gap-4 font-bold">
            <li>Complete every activity on an island to unlock its final exam.</li>
            <li>Pass the exam to chart a course to the next island.</li>
            <li>Earn PEEP points and keep your daily streak alive.</li>
          </ol>
          <p className="font-bold uppercase tracking-widest">The patient is waiting.</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-[var(--radius-panel)] border border-space-600 bg-space-950/90 px-3 py-3 shadow-[var(--shadow-panel)] backdrop-blur-sm">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!canAnimate}
          className="min-w-14 rounded-[var(--radius-chip)] bg-pastel-cream px-3 py-2 font-mono text-[10px] font-bold text-space-900 disabled:opacity-50"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
        <input
          ref={progressRef}
          type="range"
          min="0"
          max="100"
          step="0.1"
          defaultValue="0"
          onChange={seek}
          disabled={!canAnimate}
          aria-label="Mission crawl progress"
          aria-valuetext="0%"
          className="h-1 min-w-0 flex-1 cursor-pointer accent-ember-500 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={restart}
          disabled={!canAnimate}
          className="rounded-[var(--radius-chip)] border border-space-600 px-3 py-2 font-mono text-[10px] font-bold text-hull-200 disabled:opacity-50"
        >
          Restart
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared chrome                                                       */
/* ------------------------------------------------------------------ */

function ScreenShell({
  title,
  subtitle,
  onBack,
  headerRight,
  children,
  footer,
}: {
  title?: string
  subtitle?: string
  onBack?: () => void
  headerRight?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-8 pt-5">
      {(title || onBack) && (
        <header className="mb-4 flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ember-200 bg-pastel-cream text-space-900 shadow-[0_3px_0_#d87b01] hover:bg-ember-100"
            >
              <BackIcon className="size-5" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            {title && <h1 className="truncate text-lg font-extrabold text-white">{title}</h1>}
            {subtitle && <p className="truncate text-[11px] text-hull-300">{subtitle}</p>}
          </div>
          {headerRight}
        </header>
      )}
      <div className="flex flex-1 flex-col gap-4">{children}</div>
      {footer && <footer className="mt-6">{footer}</footer>}
    </div>
  )
}

function OutcomeShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md items-center px-5 py-8">
      <Panel className="flex w-full flex-col items-center gap-5 p-6 text-center">{children}</Panel>
    </div>
  )
}

function EarnedPointsCount({ value }: { value: number }) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    if (value <= 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = reduceMotion ? 0 : 340
    const duration = reduceMotion ? 0 : 480
    const startedAt = performance.now() + delay
    let frame = 0

    const tick = (now: number) => {
      if (now < startedAt) {
        frame = requestAnimationFrame(tick)
        return
      }

      const progress = duration === 0 ? 1 : Math.min((now - startedAt) / duration, 1)
      setDisplayed(Math.round(value * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return displayed
}

function Field({
  label,
  hint,
  tone = 'space',
  children,
}: {
  label: string
  hint?: string
  tone?: 'space' | 'warm'
  children: ReactNode
}) {
  const warm = tone === 'warm'

  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-space-900">
        {label}
      </span>
      {children}
      {hint && (
        <span className={`mt-1.5 block text-[11px] ${warm ? 'text-ember-700' : 'text-space-600'}`}>
          {hint}
        </span>
      )}
    </label>
  )
}

function AuthShell({
  mode,
  onBack,
  onSwitch,
  children,
}: {
  mode: 'login' | 'register'
  onBack: () => void
  onSwitch: () => void
  children: ReactNode
}) {
  const signup = mode === 'register'

  return (
    <div className="relative z-10 min-h-dvh overflow-hidden px-5 py-5 sm:px-8 sm:py-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgb(95_225_218_/_0.13),transparent_24%),radial-gradient(circle_at_88%_76%,rgb(255_116_0_/_0.14),transparent_26%)]"
      />
      <div className="relative mx-auto grid min-h-[calc(100dvh-2.5rem)] max-w-5xl items-center gap-12 lg:grid-cols-[1fr_25rem]">
        <section className="hidden max-w-xl lg:block">
          <p className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.28em] text-aqua-300">
            GAMER-ICU · Flight academy
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] text-white">
            Ventilator skills
            <br />
            for the moments
            <br />
            <span className="text-warm">that matter.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-hull-300">
            Build pediatric ventilation confidence across six evidence-guided islands. Your mission
            record keeps every checkpoint in one place.
          </p>
          <div className="mt-8 flex gap-3 font-mono text-[10px] font-bold uppercase tracking-wider text-hull-300">
            <span className="rounded-full border border-aqua-400/40 bg-aqua-400/10 px-3 py-2">
              6 islands
            </span>
            <span className="rounded-full border border-ember-400/40 bg-ember-400/10 px-3 py-2">
              1 mission
            </span>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-md pt-16">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-white/15 bg-space-950/50 text-white backdrop-blur hover:bg-space-800"
          >
            <BackIcon className="size-5" />
          </button>

          <div className="relative rounded-[2rem] border border-ember-200/70 bg-warm px-6 pb-7 pt-24 text-space-950 shadow-[0_9px_0_#d87b01,0_22px_50px_rgb(2_13_24_/_0.38)] sm:px-8">
            <Image
              src="/auth-astronaut.png"
              alt=""
              width={159}
              height={183}
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 right-1 h-auto w-40 drop-shadow-[0_12px_14px_rgb(2_13_24_/_0.24)]"
            />

            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ember-700">
              Coughulus-81 crew manifest
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight text-space-950">
              {signup ? 'Join the mission' : 'Welcome back, explorer'}
            </h1>
            <p className="mt-2 text-sm leading-6 text-space-800">
              {signup
                ? 'Create your learner identity and prepare for launch.'
                : 'Sign in to continue from your latest checkpoint.'}
            </p>

            <div className="mt-7">{children}</div>

            <p className="mt-7 text-center text-xs text-space-800">
              {signup ? 'Already have a mission record?' : 'New to the crew?'}{' '}
              <button
                type="button"
                onClick={onSwitch}
                className="font-bold text-ember-700 underline decoration-2 underline-offset-4 hover:text-space-950"
              >
                {signup ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>

          <p className="mx-auto mt-6 max-w-sm text-center text-[11px] leading-5 text-hull-400">
            Account details stay separate from anonymized research exports.
          </p>
        </section>
      </div>
    </div>
  )
}

const inputClass =
  'w-full rounded-[var(--radius-button)] border-2 border-ember-200 bg-hull-50 px-4 py-3 text-sm text-space-950 shadow-[0_2px_0_#d87b01] placeholder:text-hull-500 [color-scheme:light] focus:border-space-900'

const authInputClass =
  'w-full rounded-[var(--radius-button)] border border-ember-600/60 bg-hull-50 px-4 py-3 text-sm text-space-950 shadow-[0_2px_0_rgb(167_76_0_/_0.25)] placeholder:text-hull-500 [color-scheme:light] focus:border-space-900'

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-panel)] border-2 border-ember-200 bg-pastel-cream px-4 py-3 text-left text-space-900 shadow-[0_4px_0_#d87b01]"
    >
      <span>
        <span className="block text-sm font-bold text-space-900">{label}</span>
        <span className="block text-[11px] text-space-600">{description}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-ember-500' : 'bg-pastel-lilac'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* AppFlow                                                             */
/* ------------------------------------------------------------------ */

export type AppFlowProps = {
  islands: CurriculumIsland[]
  initialScreen?: AppScreen
  showScreenPicker?: boolean
}

export function AppFlow({
  islands,
  initialScreen = 'welcome',
  showScreenPicker = false,
}: AppFlowProps) {
  const [screen, setScreen] = useState<AppScreen>(initialScreen)
  const [history, setHistory] = useState<AppScreen[]>([])
  const [slideDirection, setSlideDirection] = useState<'forward' | 'back' | null>(null)

  // Learner state
  const [displayName, setDisplayName] = useState('learner_nurse')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [points, setPoints] = useState(2450)
  const [streak] = useState(7)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const unlockedIslands = islands.length
  const [currentIslandIdx, setCurrentIslandIdx] = useState(0)
  const [dashboardView, setDashboardView] = useState<'map' | 'list'>('map')
  const dashboardGesture = useRef({ y: 0, listAtTop: true })
  const dashboardListRef = useRef<HTMLDivElement>(null)
  const [lastEarned, setLastEarned] = useState<{ title: string; points: number } | null>(null)
  const [passedIslands] = useState<Record<string, boolean>>({})
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)

  // Quiz state
  const [quizChoice, setQuizChoice] = useState<string | null>(null)
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0)
  const [quizResponses, setQuizResponses] = useState<Record<string, QuizResponse>>({})

  // Lesson-video playback state. Refs accumulate the watched timeline and
  // latch the completion gate; state only mirrors the latch for rendering.
  const [videoEnded, setVideoEnded] = useState(false)
  const [videoErrored, setVideoErrored] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoElementRef = useRef<HTMLVideoElement | null>(null)
  const videoSegmentsRef = useRef<Array<[number, number]>>([])
  const videoLastTimeRef = useRef(0)
  const videoGateLatchedRef = useRef(false)

  // Settings / role / connectivity
  const [soundOn, setSoundOn] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [online, setOnline] = useState(true)
  const [role, setRole] = useState<'learner' | 'researcher'>('learner')
  const [accessRequested, setAccessRequested] = useState(false)
  const [csvSaved, setCsvSaved] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [interactionValue, setInteractionValue] = useState('')
  const [interactionNote, setInteractionNote] = useState('')
  const [ventLabState, setVentLabState] = useState<Record<string, string | number | boolean>>({})

  const ISLANDS = useMemo(() => islands.map(projectIsland), [islands])
  if (ISLANDS.length === 0) throw new Error('AppFlow requires at least one curriculum island')

  const island = ISLANDS[currentIslandIdx] ?? ISLANDS[0]
  const selectedActivity = island.activities.find((activity) => activity.id === selectedActivityId)
  const activityFor = (...types: ActivityType[]) =>
    selectedActivity && types.includes(selectedActivity.type)
      ? selectedActivity
      : (island.activities.find(
          (activity) => types.includes(activity.type) && activity.available
        ) ??
        island.activities.find((activity) => types.includes(activity.type)) ??
        island.activities[0])
  const islandDone = island.activities.filter((activity) => completed[activity.id]).length
  const totalActivities = ISLANDS.reduce((total, item) => total + item.activities.length, 0)
  const totalDone = ISLANDS.reduce(
    (total, item) => total + item.activities.filter((activity) => completed[activity.id]).length,
    0
  )
  const allIslandsPassed = ISLANDS.every((item) => passedIslands[item.id])

  function go(next: AppScreen) {
    setSlideDirection('forward')
    setHistory((h) => [...h, screen])
    setScreen(next)
  }

  function back() {
    if (history.length === 0) {
      setSlideDirection('back')
      setScreen('dashboard')
      return
    }
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setSlideDirection('back')
    setScreen(prev)
  }

  function resetTo(s: AppScreen, direction: 'forward' | 'back' = 'forward') {
    setSlideDirection(direction)
    setHistory([])
    setScreen(s)
  }

  function submitCode(e: FormEvent) {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!/^[A-Z]{4,}-\d{2,}$/.test(trimmed)) {
      setCodeError('Code format looks off — expected something like GAMER-42.')
      return
    }
    setCodeError(null)
    go('mission')
  }

  function completeActivity(a: Activity, submission: ActivitySubmission) {
    const grade = gradeActivity(a.record, submission)
    if (grade.status === 'unavailable' || grade.status === 'pending_manual') {
      setInteractionNote(grade.reason ?? 'This activity requires instructor review.')
      return
    }
    if (grade.status === 'failed' && a.record.type !== 'quiz') {
      setInteractionNote(
        grade.items.find((item) => !item.correct)?.feedback ??
          grade.reason ??
          'Review and try again.'
      )
      return
    }
    if (!completed[a.id]) {
      setCompleted((current) => ({ ...current, [a.id]: true }))
      setPoints((current) => current + grade.pointsEarned)
    }
    setLastEarned({ title: a.title, points: grade.pointsEarned })
    go('activityComplete')
  }

  function openActivity(a: Activity) {
    if (!a.available) return
    setSelectedActivityId(a.id)
    setInteractionValue('')
    setInteractionNote('')
    setQuizChoice(null)
    setQuizQuestionIndex(0)
    setQuizResponses({})
    setVentLabState(
      a.record.type === 'vent_lab' && a.record.content
        ? {
            ...Object.fromEntries(
              a.record.content.controls.map((control) => [
                control.id,
                control.kind === 'select'
                  ? (control.options?.[0] ?? '')
                  : control.kind === 'number'
                    ? (control.min ?? 0)
                    : false,
              ])
            ),
            ...a.record.content.initialState,
          }
        : {}
    )
    videoSegmentsRef.current = []
    videoLastTimeRef.current = 0
    videoGateLatchedRef.current = false
    setVideoEnded(false)
    setVideoErrored(false)
    setVideoReady(false)
    if (a.record.type === 'quiz') go('quiz')
    else if (a.type === 'reading') go('lessonReading')
    else if (a.type === 'video') go('lessonVideo')
    else if (a.type === 'sim') go('ventSim')
    else if (a.type === 'case') go('caseVignette')
    else if (a.type === 'quest') go('quest')
  }

  function downloadCsv() {
    const header = 'island,enrolled,completion_pct,avg_score,median_minutes'
    const body = RESEARCH_ROWS.map(
      (r) =>
        `${r.island.replace(/,/g, ' ')},${r.enrolled},${r.completion},${r.avgScore},${r.medianMin}`
    ).join('\n')
    const url = URL.createObjectURL(new Blob([`${header}\n${body}\n`], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'gamer-icu-aggregate.csv'
    a.click()
    URL.revokeObjectURL(url)
    setCsvSaved(true)
  }

  const navActive = screen === 'profile' ? 'profile' : screen === 'settings' ? 'settings' : 'home'
  const showNav = screen === 'dashboard' || screen === 'profile' || screen === 'settings'

  /* ------------------------------ screens ------------------------------ */

  function renderScreen(): ReactNode {
    switch (screen) {
      case 'welcome':
        return (
          <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-8">
            <div className="flex flex-1 flex-col items-center justify-center pb-16">
              <div className="welcome-bubble">Welcome to GAMER-ICU!</div>
              <Image
                src="/welcome-astronaut.png"
                alt="Astronaut waving hello"
                width={809}
                height={1099}
                priority
                className="welcome-astronaut mt-7 h-auto w-48 drop-shadow-[0_20px_20px_rgb(2_13_24/0.32)] sm:w-56"
              />
            </div>
            <Button onClick={() => go('login')} className="w-full py-3 text-sm">
              Begin enrollment
            </Button>
          </div>
        )

      case 'login':
        return (
          <AuthShell mode="login" onBack={back} onSwitch={() => go('register')}>
            <form
              key="login"
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                go('enroll')
              }}
            >
              <Field label="Email" tone="warm">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className={authInputClass}
                  placeholder="nurse@example.org"
                />
              </Field>
              <Field label="Password" tone="warm">
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  className={authInputClass}
                  placeholder="At least 8 characters"
                />
              </Field>
              <Button type="submit" className="mt-2 w-full py-3 text-sm">
                Sign in &amp; launch
              </Button>
            </form>
          </AuthShell>
        )

      case 'register':
        return (
          <AuthShell mode="register" onBack={back} onSwitch={() => go('login')}>
            <form
              key="register"
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                go('enroll')
              }}
            >
              <Field label="Full name" tone="warm">
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  autoComplete="name"
                  required
                  className={authInputClass}
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" tone="warm">
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className={authInputClass}
                  placeholder="nurse@example.org"
                />
              </Field>
              <Field label="Password" hint="Use at least 8 characters." tone="warm">
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={authInputClass}
                  placeholder="Create a password"
                />
              </Field>
              <Button type="submit" className="mt-2 w-full py-3 text-sm">
                Create account &amp; launch
              </Button>
            </form>
          </AuthShell>
        )

      case 'enroll':
        return (
          <ScreenShell title="Enrollment" subtitle="Enter your study access code" onBack={back}>
            <Panel className="p-5">
              <form onSubmit={submitCode} className="flex flex-col gap-4" noValidate>
                <Field
                  label="Access code"
                  hint="Distributed by your site coordinator. Demo: GAMER-42"
                >
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      setCodeError(null)
                    }}
                    placeholder="GAMER-42"
                    autoComplete="off"
                    className={inputClass}
                    aria-invalid={codeError ? true : undefined}
                    aria-describedby={codeError ? 'code-error' : undefined}
                  />
                </Field>
                {codeError && (
                  <p
                    id="code-error"
                    role="alert"
                    className="rounded-[var(--radius-chip)] border border-signal-danger/50 bg-signal-danger/10 px-3 py-2 text-[12px] font-bold text-signal-danger"
                  >
                    {codeError}
                  </p>
                )}
                <Button type="submit" className="w-full py-3 text-sm">
                  Validate code
                </Button>
              </form>
            </Panel>
            <p className="text-center text-[11px] text-hull-400">
              No account, no email — your progress lives on this device only.
            </p>
          </ScreenShell>
        )

      case 'mission':
        return (
          <ScreenShell title="Mission briefing" subtitle="Curriculum objectives" onBack={back}>
            <MissionCrawl />
            <Button onClick={() => go('avatar')} className="w-full py-3 text-sm">
              Accept mission
            </Button>
          </ScreenShell>
        )

      case 'avatar':
        return (
          <ScreenShell
            title="Choose your operative"
            subtitle="This identity signs your local save"
            onBack={back}
          >
            <div className="grid grid-cols-1 gap-3">
              {AVATARS.map((a) => {
                const selected = avatar === a.id
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAvatar(a.id)}
                    aria-pressed={selected}
                    className={`raise flex items-center gap-4 rounded-[var(--radius-card)] border-2 p-4 text-left text-space-900 transition-colors ${
                      selected
                        ? 'border-ember-300 bg-pastel-peach shadow-[0_5px_0_#d87b01]'
                        : 'border-ember-200 bg-pastel-cream shadow-[0_4px_0_#d87b01] hover:bg-ember-100'
                    }`}
                  >
                    <span
                      className="grid size-12 shrink-0 place-items-center rounded-[var(--radius-icon)] border-2 border-nebula-200 bg-pastel-lilac text-sm font-extrabold text-space-900"
                      aria-hidden="true"
                    >
                      {a.label.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-extrabold text-space-900">{a.label}</span>
                      <span className="block text-[11px] text-space-600">{a.role}</span>
                    </span>
                    {selected && <CheckIcon className="size-5 text-ember-400" />}
                  </button>
                )
              })}
            </div>
            <Button
              disabled={!avatar}
              onClick={() => resetTo('dashboard')}
              className="w-full py-3 text-sm"
            >
              {avatar ? 'Touch down on Atelecta Prime' : 'Select an operative to continue'}
            </Button>
          </ScreenShell>
        )

      case 'dashboard':
        return (
          <div
            className="relative z-10 mx-auto h-dvh w-full max-w-md overflow-hidden bg-space-900 bg-[url('/background.png')] bg-cover bg-center"
            role="region"
            aria-label={`Learning dashboard, ${dashboardView} view`}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.currentTarget !== event.target) return
              if (event.key === 'ArrowDown' && dashboardView === 'map') setDashboardView('list')
              if (event.key === 'ArrowUp' && dashboardView === 'list') setDashboardView('map')
            }}
            onWheel={(event) => {
              if (Math.abs(event.deltaY) < 36) return
              if (dashboardView === 'map' && event.deltaY > 0) setDashboardView('list')
              if (
                dashboardView === 'list' &&
                event.deltaY < 0 &&
                (dashboardListRef.current?.scrollTop ?? 0) <= 0
              ) {
                setDashboardView('map')
              }
            }}
            onTouchStart={(event) => {
              dashboardGesture.current = {
                y: event.touches[0].clientY,
                listAtTop: (dashboardListRef.current?.scrollTop ?? 0) <= 0,
              }
            }}
            onTouchEnd={(event) => {
              const distance = event.changedTouches[0].clientY - dashboardGesture.current.y
              if (distance < -56 && dashboardView === 'map') setDashboardView('list')
              if (distance > 56 && dashboardView === 'list' && dashboardGesture.current.listAtTop) {
                setDashboardView('map')
              }
            }}
          >
            <div
              className="dashboard-map-view pointer-events-none absolute left-[49%] top-[48%] h-[68%] w-[87%] -translate-x-1/2 -translate-y-1/2"
              data-active={dashboardView === 'map'}
            >
              <Image
                src="/dashboard-island.png"
                alt=""
                fill
                priority
                sizes="(max-width: 28rem) 78vw, 21.84rem"
                className="object-contain"
              />
            </div>
            <h1 className="sr-only">Ventilator Education learning dashboard</h1>

            <header className="pointer-events-none absolute inset-x-0 top-0 z-20 px-5 pt-6">
              <div className="flex items-center justify-between gap-2">
                <HudStat icon="map" aria-label={`Islands unlocked: ${unlockedIslands} of 6`}>
                  {unlockedIslands}/6
                </HudStat>
                <HudStat icon="flame" aria-label={`Current streak: ${streak} days`}>
                  {streak}
                </HudStat>
                <HudStat icon="star" aria-label={`Total PEEP points: ${points}`}>
                  {points.toLocaleString()}
                </HudStat>
              </div>
            </header>

            <section
              className="dashboard-map-view absolute left-[49%] top-[48%] z-10 h-[68%] w-[87%] -translate-x-1/2 -translate-y-1/2"
              data-active={dashboardView === 'map'}
              aria-label="Learning landmarks"
              aria-hidden={dashboardView !== 'map'}
              inert={dashboardView !== 'map'}
            >
              {ISLANDS.map((place, idx) => {
                const spot = ISLAND_SPOTS[idx]
                const locked = idx >= unlockedIslands
                const passed = passedIslands[place.id]
                const done = place.activities.filter((activity) => completed[activity.id]).length
                const progress = Math.round((done / place.activities.length) * 100)
                const tooltipPosition =
                  spot.tooltip === 'above'
                    ? 'bottom-10 left-1/2 -translate-x-1/2'
                    : spot.tooltip === 'below'
                      ? 'left-1/2 top-10 -translate-x-1/2'
                      : spot.tooltip === 'left'
                        ? 'right-10 top-1/2 -translate-y-1/2'
                        : 'left-10 top-1/2 -translate-y-1/2'

                return (
                  <button
                    key={place.id}
                    type="button"
                    aria-disabled={locked}
                    aria-label={`${place.name}: ${locked ? 'locked' : `${progress}% complete`}`}
                    onClick={() => {
                      if (locked) return
                      setCurrentIslandIdx(idx)
                      go('island')
                    }}
                    style={{ left: spot.left, top: spot.top }}
                    className="group absolute size-9 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:z-30 hover:z-30"
                  >
                    <span
                      className={`relative grid size-9 place-items-center rounded-full border-2 font-mono text-[11px] font-extrabold shadow-[0_3px_0_rgb(2_13_24_/_0.35)] transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 ${
                        locked
                          ? 'border-hull-300 bg-space-900/80 text-hull-300'
                          : passed
                            ? 'border-pastel-cream bg-signal-success text-space-950'
                            : 'border-pastel-cream bg-ember-500 text-space-950'
                      }`}
                    >
                      <span
                        className={`absolute inset-[-6px] -z-10 rounded-full border-2 ${locked ? 'border-hull-300/35' : 'animate-pulse border-ember-300/70'}`}
                      />
                      {locked ? (
                        <LockIcon className="size-3.5" />
                      ) : passed ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        idx + 1
                      )}
                    </span>

                    <span
                      className={`pointer-events-none absolute w-48 scale-95 rounded-[var(--radius-panel)] border border-white/20 bg-space-950/95 p-3 text-left text-white opacity-0 shadow-[0_10px_28px_rgb(2_13_24_/_0.38)] backdrop-blur-md transition duration-200 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 ${tooltipPosition}`}
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="text-sm font-extrabold leading-tight">{place.name}</span>
                        <span className="font-mono text-[10px] font-bold text-ember-300">
                          {locked ? 'LOCKED' : `${progress}%`}
                        </span>
                      </span>
                      <span className="mt-1 block text-[10px] leading-relaxed text-hull-300">
                        {place.tagline}
                      </span>
                      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-space-700">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-ember-400 to-solar-300"
                          style={{ width: `${progress}%` }}
                        />
                      </span>
                      <span className="mt-1.5 block font-mono text-[9px] font-bold uppercase tracking-wider text-hull-300">
                        {locked
                          ? 'Complete the previous island'
                          : `${done} of ${place.activities.length} activities`}
                      </span>
                    </span>
                  </button>
                )
              })}
            </section>

            <button
              type="button"
              className="dashboard-map-view absolute bottom-24 left-1/2 z-20 grid size-7 -translate-x-1/2 place-items-center rounded-full border border-pastel-cream/70 bg-space-950/75 font-mono text-sm font-bold text-pastel-cream shadow-[0_3px_10px_rgb(2_13_24_/_0.3)] backdrop-blur-sm hover:scale-110"
              data-active={dashboardView === 'map'}
              aria-label="Show island list"
              aria-hidden={dashboardView !== 'map'}
              tabIndex={dashboardView === 'map' ? 0 : -1}
              onClick={() => setDashboardView('list')}
            >
              ↑
            </button>

            <section
              ref={dashboardListRef}
              className="dashboard-list-view absolute inset-x-0 bottom-24 top-20 z-10 overflow-y-auto overscroll-contain px-5 pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              data-active={dashboardView === 'list'}
              aria-label="Island modules"
              aria-hidden={dashboardView !== 'list'}
              inert={dashboardView !== 'list'}
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <h2 className="text-xl font-extrabold text-white">Your learning islands</h2>
                <button
                  type="button"
                  className="grid size-7 place-items-center rounded-full border border-pastel-cream/70 bg-space-950/75 font-mono text-sm font-bold text-pastel-cream shadow-[0_3px_10px_rgb(2_13_24_/_0.3)] backdrop-blur-sm transition-transform hover:scale-110"
                  aria-label="Show island map"
                  onClick={() => setDashboardView('map')}
                >
                  ↓
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {ISLANDS.map((place, idx) => {
                  const locked = idx >= unlockedIslands
                  const passed = passedIslands[place.id]
                  const done = place.activities.filter((activity) => completed[activity.id]).length
                  const progress = Math.round((done / place.activities.length) * 100)
                  const remaining = place.activities.length - done

                  return (
                    <button
                      key={place.id}
                      type="button"
                      aria-disabled={locked}
                      onClick={() => {
                        if (locked) return
                        setCurrentIslandIdx(idx)
                        go('island')
                      }}
                      className={`w-full rounded-[var(--radius-panel)] border-2 p-4 text-left shadow-[0_5px_0_rgb(2_13_24_/_0.28)] transition-[transform,box-shadow,background-color] duration-200 ${
                        locked
                          ? 'border-hull-400/50 bg-space-900/90 text-hull-300'
                          : passed
                            ? 'border-pastel-mint bg-pastel-mint text-space-950 hover:-translate-y-0.5 hover:bg-white'
                            : 'border-ember-200 bg-pastel-cream text-space-950 hover:-translate-y-0.5 hover:bg-white'
                      }`}
                    >
                      <span className="flex items-start gap-3">
                        <span
                          className={`grid size-10 shrink-0 place-items-center rounded-full border-2 ${
                            locked
                              ? 'border-hull-400/60 bg-space-800'
                              : passed
                                ? 'border-space-900 bg-signal-success'
                                : 'border-ember-500 bg-ember-300'
                          }`}
                        >
                          {locked ? (
                            <LockIcon className="size-4" />
                          ) : passed ? (
                            <CheckIcon className="size-5" />
                          ) : (
                            <MapIcon className="size-4" />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-start justify-between gap-3">
                            <span>
                              <span className="block font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">
                                Island {idx + 1}
                              </span>
                              <span className="mt-0.5 block text-base font-extrabold leading-tight">
                                {place.name}
                              </span>
                            </span>
                            <span className="shrink-0 font-mono text-xs font-extrabold">
                              {locked ? 'LOCKED' : `${progress}%`}
                            </span>
                          </span>

                          <span className="mt-2 block text-xs leading-relaxed opacity-75">
                            {place.tagline}
                          </span>

                          <span
                            className={`mt-3 block h-2.5 overflow-hidden rounded-full ring-1 ring-inset ${
                              locked
                                ? 'bg-space-700 ring-hull-300/30'
                                : 'bg-space-950/20 ring-space-950/15'
                            }`}
                          >
                            <span
                              className={`block h-full rounded-full ${
                                locked
                                  ? 'bg-hull-400'
                                  : 'bg-gradient-to-r from-ember-500 to-solar-300'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </span>

                          <span className="mt-2 flex justify-between font-mono text-[10px] font-bold uppercase tracking-wide opacity-70">
                            <span>
                              {locked
                                ? 'Complete previous island'
                                : `${done}/${place.activities.length} modules done`}
                            </span>
                            {!locked && <span>{remaining ? `${remaining} left` : 'Complete'}</span>}
                          </span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            {allIslandsPassed && (
              <Button
                variant="nebula"
                onClick={() => go('courseComplete')}
                className="absolute inset-x-5 bottom-24 z-20 py-3 text-sm"
              >
                View graduation certificate
              </Button>
            )}
          </div>
        )

      case 'island':
        return (
          <ScreenShell
            title={island.name}
            subtitle={`Island ${currentIslandIdx + 1} of ${ISLANDS.length}`}
            onBack={() => resetTo('dashboard', 'back')}
            headerRight={
              passedIslands[island.id] ? (
                <Badge tone="streak" icon={<CheckIcon className="size-3" />}>
                  cleared
                </Badge>
              ) : undefined
            }
          >
            <Panel variant="outline" className="p-4">
              <p className="text-sm leading-relaxed text-hull-200">{island.tagline}</p>
              <ProgressMeter
                label="Island progress"
                value={Math.round((islandDone / island.activities.length) * 100)}
                className="mt-4 rounded-[var(--radius-button)] bg-white/50 p-3 shadow-[inset_0_0_0_1px_rgb(2_13_24_/_0.12)] [&_[role=progressbar]]:h-4 [&_[role=progressbar]]:border-space-900/35 [&_[role=progressbar]]:bg-space-900/20 [&_[role=progressbar]]:shadow-inner"
              />
            </Panel>

            <div className="flex flex-col gap-3">
              {island.activities.map((a) => {
                const Icon = activityIcon[a.type]
                const isDone = !!completed[a.id]
                return (
                  <div
                    key={a.id}
                    role={a.available ? 'button' : undefined}
                    tabIndex={a.available ? 0 : -1}
                    onClick={a.available ? () => openActivity(a) : undefined}
                    onKeyDown={
                      a.available
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              openActivity(a)
                            }
                          }
                        : undefined
                    }
                    className={a.available ? 'cursor-pointer' : 'cursor-not-allowed'}
                    aria-disabled={!a.available}
                    aria-label={`${a.title}, ${a.type}, ${a.points} PEEP points${isDone ? ', completed' : ''}${a.available ? '' : `, ${a.record.contentStatus.replace('_', ' ')}`}`}
                  >
                    <ActivityCard
                      title={a.title}
                      points={a.points}
                      minutes={a.minutes}
                      completed={isDone}
                      unavailable={!a.available}
                      icon={<Icon className="size-4" />}
                    />
                    {!a.available && (
                      <p className="-mt-2 px-3 pb-1 font-mono text-[10px] font-bold uppercase tracking-wide text-space-700">
                        {a.record.contentStatus === 'needs_review'
                          ? 'Needs clinical review'
                          : 'Coming soon'}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-2">
              {islandDone === island.activities.length && !passedIslands[island.id] ? (
                island.finalExam.contentStatus === 'ready' && island.finalExam.content ? (
                  <Button onClick={() => go('finalExamIntro')} className="w-full py-3 text-sm">
                    Take the island final exam
                  </Button>
                ) : (
                  <Button disabled className="w-full py-3 text-sm">
                    Final exam coming soon
                  </Button>
                )
              ) : (
                <p className="text-center font-mono text-[10px] font-bold text-hull-400">
                  {passedIslands[island.id]
                    ? 'Exam cleared — the next island is charted.'
                    : `${island.activities.filter((activity) => !activity.available).length} activities are awaiting approved content; complete the available activities in the meantime.`}
                </p>
              )}
            </div>
          </ScreenShell>
        )

      case 'lessonReading': {
        const a = activityFor('reading')
        const content = a.record.type === 'reading' ? a.record.content : null
        if (!content) {
          return (
            <ScreenShell title={a.title} subtitle="Reading unavailable" onBack={back}>
              <Panel className="p-5 text-sm text-hull-200">
                This reading is not available in the approved catalog.
              </Panel>
            </ScreenShell>
          )
        }
        const readingMediaUrl = (media: { assetId: string; storageKey?: string | null }) => {
          const storageKey =
            media.storageKey ??
            mediaAssets.find((asset) => asset.assetId === media.assetId)?.storageKey ??
            null
          return storageKey ? curriculumMediaUrl(storageKey) : null
        }
        const question = content.confirmationQuestion
        const documentUrl = content.document ? readingMediaUrl(content.document) : null
        return (
          <ScreenShell title={a.title} subtitle={`Reading · ~${a.minutes} min`} onBack={back}>
            <Panel className="p-5">
              <Badge tone="reading" icon={<BookIcon className="size-3" />} className="mb-3">
                reading
              </Badge>
              {documentUrl ? (
                <object
                  data={documentUrl}
                  type="application/pdf"
                  aria-label={`${a.title} source document`}
                  className="h-[65vh] min-h-[32rem] w-full rounded-lg bg-white"
                >
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-ember-300 underline"
                  >
                    Open the exact source PDF
                  </a>
                </object>
              ) : content.blocks && content.blocks.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {content.blocks.map((block, index) =>
                    block.kind === 'text' ? (
                      <p
                        key={`${block.kind}-${index}`}
                        className="whitespace-pre-wrap text-sm leading-relaxed text-hull-200"
                      >
                        {block.text}
                      </p>
                    ) : readingMediaUrl(block.media) ? (
                      <img
                        key={`${block.kind}-${index}`}
                        src={readingMediaUrl(block.media) ?? ''}
                        alt={block.media.altText ?? ''}
                        className="max-h-[28rem] w-full rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : null
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-hull-200">
                  {content.body}
                </p>
              )}
            </Panel>
            <Panel className="p-5">
              <h2 className="text-sm font-bold leading-relaxed text-white">{question.prompt}</h2>
              <div className="mt-4 flex flex-col gap-2">
                {question.choices.map((choice) => (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={quizChoice === choice.id}
                    onClick={() => {
                      setQuizChoice(choice.id)
                      setInteractionNote('')
                    }}
                    className={`rounded-[var(--radius-button)] border px-4 py-3 text-left text-[13px] ${
                      quizChoice === choice.id
                        ? 'border-ember-400 bg-ember-500/15 text-white'
                        : 'border-space-600 bg-space-950/50 text-hull-200 hover:bg-space-700'
                    }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
              {interactionNote && (
                <p role="alert" className="mt-4 text-[12px] text-solar-400">
                  {interactionNote}
                </p>
              )}
            </Panel>
            <Button
              disabled={!quizChoice}
              onClick={() => completeActivity(a, { type: 'reading', choiceId: quizChoice ?? '' })}
              className="w-full py-3 text-sm"
            >
              Check understanding · up to {a.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'lessonVideo': {
        const a = activityFor('video')
        const content = a.record.type === 'video' ? a.record.content : null
        if (!content) {
          return (
            <ScreenShell title={a.title} subtitle="Video unavailable" onBack={back}>
              <Panel className="p-5 text-sm text-hull-200">
                This video is not available in the approved catalog.
              </Panel>
            </ScreenShell>
          )
        }
        const condition = content.completionCondition
        const videoUrl = resolveVideoUrl(content, mediaAssets)
        const duration =
          Number.isFinite(content.durationSeconds) && content.durationSeconds > 0
            ? content.durationSeconds
            : 0

        // Watched fraction = union of played timeline segments / duration.
        // Seeking backwards and replaying already-watched ranges never
        // increases it, so points can only be earned once per watch-through.
        const watchedFraction = () => {
          if (duration <= 0) return 0
          const segments = videoSegmentsRef.current
          if (segments.length === 0) return 0
          const sorted = [...segments].sort((x, y) => x[0] - y[0])
          let covered = 0
          let [segStart, segEnd] = sorted[0]
          for (const [s, e] of sorted.slice(1)) {
            if (s > segEnd) {
              covered += segEnd - segStart
              segStart = s
            }
            segEnd = Math.max(segEnd, e)
          }
          covered += segEnd - segStart
          return Math.min(1, covered / duration)
        }

        const latchVideoGate = (ended: boolean) => {
          if (videoGateLatchedRef.current) return
          if (videoCompletionMet(condition, ended, watchedFraction())) {
            videoGateLatchedRef.current = true
            setVideoReady(true)
          }
        }

        const handleTimeUpdate = () => {
          const el = videoElementRef.current
          if (!el) return
          const current = el.currentTime
          const previous = videoLastTimeRef.current
          videoLastTimeRef.current = current
          // Only accumulate natural forward playback; anything else is a seek.
          if (current > previous && current - previous <= 1.5) {
            videoSegmentsRef.current.push([previous, current])
          }
          latchVideoGate(false)
        }

        const handleEnded = () => {
          const el = videoElementRef.current
          if (el) {
            const end = duration > 0 ? duration : el.duration
            if (Number.isFinite(end) && end > videoLastTimeRef.current) {
              videoSegmentsRef.current.push([videoLastTimeRef.current, end])
              videoLastTimeRef.current = end
            }
          }
          setVideoEnded(true)
          latchVideoGate(true)
        }

        const requirement =
          condition.kind === 'ended'
            ? 'Watch to the end to complete this activity.'
            : `Watch at least ${Math.round(condition.watchedFraction * 100)}% to complete this activity.`

        return (
          <ScreenShell title={a.title} subtitle={`Video · ~${a.minutes} min`} onBack={back}>
            <Panel variant="outline" className="overflow-hidden">
              {videoUrl && !videoErrored ? (
                <video
                  ref={videoElementRef}
                  src={videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={content.media.altText ?? a.title}
                  className="aspect-video w-full bg-space-950"
                  onPlay={() => {
                    videoLastTimeRef.current = videoElementRef.current?.currentTime ?? 0
                  }}
                  onSeeked={() => {
                    videoLastTimeRef.current = videoElementRef.current?.currentTime ?? 0
                  }}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  onError={() => setVideoErrored(true)}
                />
              ) : (
                <div
                  role="status"
                  className="grid aspect-video place-items-center bg-space-950 px-6 text-center"
                >
                  <p className="max-w-xs text-[13px] leading-relaxed text-hull-200">
                    {videoUrl
                      ? 'This video could not be loaded. The local media file may be missing or corrupted — run `npm run media:local` against the extracted corpus and retry.'
                      : 'This video has no playable media file in the approved catalog.'}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="min-w-0 truncate font-mono text-[10px] font-bold text-hull-300">
                  {content.media.assetId} · {Math.ceil(content.durationSeconds / 60)} min
                </span>
                <Badge tone="video" icon={<PlayIcon className="size-3" />}>
                  video
                </Badge>
              </div>
            </Panel>
            <Panel className="p-4">
              <h2 className="mb-1 text-sm font-extrabold text-white">Source media</h2>
              <p className="text-[13px] leading-relaxed text-hull-300">
                {content.media.altText ?? a.blurb}
              </p>
              <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-wide text-solar-400">
                {requirement}
              </p>
              {interactionNote && (
                <p role="alert" className="mt-3 text-[12px] text-solar-400">
                  {interactionNote}
                </p>
              )}
            </Panel>
            <Button
              disabled={!videoReady}
              onClick={() =>
                completeActivity(a, {
                  type: 'video',
                  ended: videoEnded,
                  watchedFraction: watchedFraction(),
                })
              }
              className="w-full py-3 text-sm"
            >
              {videoReady ? `Complete activity · ${a.points} PEEP` : requirement}
            </Button>
          </ScreenShell>
        )
      }

      case 'ventSim': {
        const activity = activityFor('sim')
        const content = activity.record.type === 'vent_lab' ? activity.record.content : null
        return (
          <ScreenShell
            title={activity.title}
            subtitle={`Vent Lab · ~${activity.minutes} min`}
            onBack={back}
          >
            <Panel className="p-5">
              <Badge tone="quiz" icon={<WaveIcon className="size-3" />}>
                vent lab
              </Badge>
              {content ? (
                <>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-hull-200">
                    {content.objectives.map((objective) => (
                      <li key={objective}>{objective}</li>
                    ))}
                  </ul>
                  <div className="mt-4 grid gap-3">
                    {content.controls.map((control) => (
                      <div
                        key={control.id}
                        className="rounded-[var(--radius-chip)] border border-space-600 bg-space-950/50 p-3"
                      >
                        <label
                          className="block text-[12px] font-bold text-white"
                          htmlFor={control.id}
                        >
                          {control.label}
                        </label>
                        {control.kind === 'number' ? (
                          <input
                            id={control.id}
                            type="number"
                            min={control.min}
                            max={control.max}
                            value={String(ventLabState[control.id] ?? '')}
                            onChange={(event) =>
                              setVentLabState((current) => ({
                                ...current,
                                [control.id]: Number(event.target.value),
                              }))
                            }
                            className={`${inputClass} mt-2`}
                          />
                        ) : control.kind === 'select' ? (
                          <select
                            id={control.id}
                            value={String(ventLabState[control.id] ?? '')}
                            onChange={(event) =>
                              setVentLabState((current) => ({
                                ...current,
                                [control.id]: event.target.value,
                              }))
                            }
                            className={`${inputClass} mt-2`}
                          >
                            {control.options?.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        ) : control.kind === 'toggle' ? (
                          <input
                            id={control.id}
                            type="checkbox"
                            checked={Boolean(ventLabState[control.id])}
                            onChange={(event) =>
                              setVentLabState((current) => ({
                                ...current,
                                [control.id]: event.target.checked,
                              }))
                            }
                            className="mt-3 size-5 accent-ember-500"
                          />
                        ) : (
                          <button
                            id={control.id}
                            type="button"
                            aria-pressed={Boolean(ventLabState[control.id])}
                            onClick={() =>
                              setVentLabState((current) => ({ ...current, [control.id]: true }))
                            }
                            className="mt-2 rounded-[var(--radius-button)] border border-space-600 px-3 py-2 text-xs text-white"
                          >
                            {ventLabState[control.id] ? 'Applied' : 'Apply'}
                          </button>
                        )}
                        {(control.unit ||
                          control.min !== undefined ||
                          control.max !== undefined) && (
                          <span className="mt-2 block font-mono text-[10px] text-hull-400">
                            {[control.min, control.max]
                              .filter((value) => value !== undefined)
                              .join('–')}
                            {control.unit ? ` ${control.unit}` : ''}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm text-hull-200">
                  The approved simulation payload is unavailable.
                </p>
              )}
            </Panel>
            <Button
              disabled={!content}
              onClick={() =>
                completeActivity(activity, {
                  type: 'vent_lab',
                  state: ventLabState,
                })
              }
              className="w-full py-3 text-sm"
            >
              Complete practice · {activity.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'quiz': {
        const a =
          selectedActivity?.record.type === 'quiz'
            ? selectedActivity
            : (island.activities.find(
                (activity) => activity.record.type === 'quiz' && activity.available
              ) ?? activityFor('quiz', 'matching', 'ordering', 'fill'))
        const questions =
          a.record.type === 'quiz' && a.record.content ? a.record.content.questions : []
        const question = questions[quizQuestionIndex]
        if (!question) {
          return (
            <ScreenShell title={a.title} subtitle="Quiz unavailable" onBack={back}>
              <Panel className="p-5 text-sm text-hull-200">
                No approved question is available for this activity.
              </Panel>
            </ScreenShell>
          )
        }

        const response = quizResponses[question.id]
        const leftIds =
          question.interaction === 'matching'
            ? Array.from(new Set(question.answer.pairs.map((pair) => pair.leftChoiceId)))
            : []
        const rightIds =
          question.interaction === 'matching'
            ? Array.from(new Set(question.answer.pairs.map((pair) => pair.rightChoiceId)))
            : []
        const choiceText = (choiceId: string) =>
          question.choices.find((choice) => choice.id === choiceId)?.text ?? choiceId
        const mediaStorageKey = (media: { assetId: string; storageKey?: string | null }) =>
          media.storageKey ??
          mediaAssets.find((asset) => asset.assetId === media.assetId)?.storageKey ??
          null
        const mediaUrl = (media: { assetId: string; storageKey?: string | null }) => {
          const storageKey = mediaStorageKey(media)
          return storageKey ? curriculumMediaUrl(storageKey) : null
        }
        const promptMediaStorageKey = question.promptMedia
          ? mediaStorageKey(question.promptMedia)
          : null
        const answered =
          (question.interaction === 'mcq' &&
            response?.interaction === 'mcq' &&
            response.choiceIds.length > 0) ||
          (question.interaction === 'fill_blank' &&
            response?.interaction === 'fill_blank' &&
            response.value.trim().length > 0) ||
          (question.interaction === 'drag_drop' &&
            response?.interaction === 'drag_drop' &&
            Object.keys(response.placements).length === question.choices.length) ||
          (question.interaction === 'matching' &&
            response?.interaction === 'matching' &&
            response.pairs.length === leftIds.length)
        const saveResponse = (nextResponse: QuizResponse) =>
          setQuizResponses((current) => ({ ...current, [question.id]: nextResponse }))

        return (
          <ScreenShell
            title={a.title}
            subtitle={`Question ${quizQuestionIndex + 1} of ${questions.length} · ${question.interaction.replace('_', ' ')}`}
            onBack={back}
          >
            <ProgressMeter
              label="Quiz progress"
              value={Math.round((quizQuestionIndex / questions.length) * 100)}
            />
            <Panel className="p-5">
              <Badge tone="quiz" icon={<QuizIcon className="size-3" />} className="mb-3">
                checkpoint quiz
              </Badge>
              {question.promptBlocks ? (
                <div className="mt-4 flex flex-col gap-3">
                  {question.promptBlocks.map((block, index) =>
                    block.kind === 'text' ? (
                      <p
                        key={`${block.kind}-${index}`}
                        className="text-sm font-bold leading-relaxed text-white"
                      >
                        {block.text}
                      </p>
                    ) : mediaUrl(block.media) ? (
                      <img
                        key={`${block.kind}-${index}`}
                        src={mediaUrl(block.media) ?? ''}
                        alt={block.media.altText ?? ''}
                        className="max-h-80 w-full rounded-lg object-contain"
                      />
                    ) : null
                  )}
                </div>
              ) : (
                <>
                  {promptMediaStorageKey &&
                    (question.promptMedia?.mimeType?.startsWith('audio/') ||
                    /\.(?:mp3|wav|ogg)$/i.test(promptMediaStorageKey) ? (
                      <audio
                        className="mt-4 w-full"
                        controls
                        src={mediaUrl(question.promptMedia!) ?? ''}
                      />
                    ) : (
                      <img
                        className="mt-4 max-h-80 w-full rounded-lg object-contain"
                        src={mediaUrl(question.promptMedia!) ?? ''}
                        alt={question.promptMedia?.altText ?? ''}
                      />
                    ))}
                  <h2 className="text-sm font-bold leading-relaxed text-white">
                    {question.prompt}
                  </h2>
                </>
              )}

              {question.interaction === 'mcq' && (
                <div className="mt-4 flex flex-col gap-2">
                  {question.choices.map((choice) => {
                    const selected =
                      response?.interaction === 'mcq' && response.choiceIds.includes(choice.id)
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          const choiceIds =
                            response?.interaction === 'mcq' ? response.choiceIds : []
                          saveResponse({
                            interaction: 'mcq',
                            choiceIds: choiceIds.includes(choice.id)
                              ? choiceIds.filter((choiceId) => choiceId !== choice.id)
                              : [...choiceIds, choice.id],
                          })
                        }}
                        aria-pressed={selected}
                        className={`rounded-[var(--radius-button)] border px-4 py-3 text-left text-[13px] ${
                          selected
                            ? 'border-ember-400 bg-ember-500/15 text-white'
                            : 'border-space-600 bg-space-950/50 text-hull-200 hover:bg-space-700'
                        }`}
                      >
                        {choice.media && mediaUrl(choice.media) && (
                          <img
                            className="mb-2 max-h-48 w-full rounded-lg object-contain"
                            src={mediaUrl(choice.media) ?? ''}
                            alt={choice.media.altText ?? ''}
                          />
                        )}
                        {choice.text}
                      </button>
                    )
                  })}
                </div>
              )}

              {question.interaction === 'fill_blank' && (
                <Field label="Your answer">
                  <input
                    className={inputClass}
                    value={response?.interaction === 'fill_blank' ? response.value : ''}
                    onChange={(event) =>
                      saveResponse({ interaction: 'fill_blank', value: event.target.value })
                    }
                  />
                </Field>
              )}

              {question.interaction === 'drag_drop' && (
                <div className="mt-4 flex flex-col gap-3">
                  {question.choices.map((choice) => (
                    <Field key={choice.id} label={choice.text}>
                      <select
                        className={inputClass}
                        value={
                          response?.interaction === 'drag_drop'
                            ? (response.placements[choice.id] ?? '')
                            : ''
                        }
                        onChange={(event) =>
                          saveResponse({
                            interaction: 'drag_drop',
                            placements: {
                              ...(response?.interaction === 'drag_drop' ? response.placements : {}),
                              [choice.id]: event.target.value,
                            },
                          })
                        }
                      >
                        <option value="">Choose target</option>
                        {question.targets.map((target) => (
                          <option key={target.id} value={target.id}>
                            {target.text}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ))}
                </div>
              )}

              {question.interaction === 'matching' && (
                <div className="mt-4 flex flex-col gap-3">
                  {leftIds.map((leftChoiceId) => (
                    <Field key={leftChoiceId} label={choiceText(leftChoiceId)}>
                      <select
                        className={inputClass}
                        value={
                          response?.interaction === 'matching'
                            ? (response.pairs.find((pair) => pair.leftChoiceId === leftChoiceId)
                                ?.rightChoiceId ?? '')
                            : ''
                        }
                        onChange={(event) => {
                          const pairs =
                            response?.interaction === 'matching'
                              ? response.pairs.filter((pair) => pair.leftChoiceId !== leftChoiceId)
                              : []
                          if (event.target.value) {
                            pairs.push({ leftChoiceId, rightChoiceId: event.target.value })
                          }
                          saveResponse({ interaction: 'matching', pairs })
                        }}
                      >
                        <option value="">Choose match</option>
                        {rightIds.map((rightChoiceId) => (
                          <option key={rightChoiceId} value={rightChoiceId}>
                            {choiceText(rightChoiceId)}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ))}
                </div>
              )}
            </Panel>
            <Button
              disabled={!answered}
              onClick={() => {
                if (quizQuestionIndex + 1 < questions.length) {
                  setQuizQuestionIndex((index) => index + 1)
                } else {
                  go('quizFeedback')
                }
              }}
              className="w-full py-3 text-sm"
            >
              {quizQuestionIndex + 1 === questions.length ? 'Score quiz' : 'Next question'}
            </Button>
          </ScreenShell>
        )
      }

      case 'quizFeedback': {
        const a =
          selectedActivity?.record.type === 'quiz'
            ? selectedActivity
            : (island.activities.find(
                (activity) => activity.record.type === 'quiz' && activity.available
              ) ?? activityFor('quiz', 'matching', 'ordering', 'fill'))
        const grade =
          a.record.type === 'quiz'
            ? gradeActivity(a.record, { type: 'quiz', answers: quizResponses })
            : null
        const passed = grade?.status === 'passed'
        return (
          <ScreenShell title="Quiz results" subtitle={a.title} onBack={back}>
            <Panel className={`p-5 ${passed ? '' : 'border-signal-danger/60'}`}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`grid size-10 place-items-center rounded-full ${passed ? 'bg-signal-success/20 text-signal-success' : 'bg-signal-danger/20 text-signal-danger'}`}
                  aria-hidden="true"
                >
                  {passed ? <CheckIcon className="size-5" /> : <QuizIcon className="size-5" />}
                </span>
                <h2 className="text-base font-extrabold text-white">
                  {grade
                    ? `${grade.correctCount} of ${grade.totalCount} correct`
                    : 'Unable to score'}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-hull-200">
                {grade
                  ? `${grade.pointsEarned} of ${grade.maxPoints} PEEP points earned.`
                  : 'The selected activity is not an approved quiz.'}
              </p>
              {grade?.items.map(
                (item) =>
                  item.feedback && (
                    <p key={item.itemId} className="mt-3 text-[12px] leading-relaxed text-hull-300">
                      {item.feedback}
                    </p>
                  )
              )}
            </Panel>
            <Button
              disabled={!grade}
              onClick={() => completeActivity(a, { type: 'quiz', answers: quizResponses })}
              className="w-full py-3 text-sm"
            >
              Continue · collect {grade?.pointsEarned ?? 0} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'quizMatch': {
        const activity = activityFor('matching')
        const question =
          activity.record.type === 'quiz'
            ? activity.record.content?.questions.find((item) => item.interaction === 'matching')
            : undefined
        return (
          <ScreenShell title={activity.title} subtitle="Matching activity" onBack={back}>
            <Panel className="p-5">
              <h2 className="text-sm font-bold leading-relaxed text-white">
                {question?.prompt ?? 'The approved matching prompt is unavailable.'}
              </h2>
              {question && (
                <ul className="mt-4 space-y-2 text-[13px] text-hull-200">
                  {question.choices.map((choice) => (
                    <li
                      key={choice.id}
                      className="rounded-[var(--radius-chip)] border border-space-600 px-3 py-2"
                    >
                      {choice.text}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Button disabled className="w-full py-3 text-sm">
              Interactive matching coming soon
            </Button>
          </ScreenShell>
        )
      }

      case 'quizDrag': {
        const activity = activityFor('ordering')
        const question =
          activity.record.type === 'quiz'
            ? activity.record.content?.questions.find((item) => item.interaction === 'drag_drop')
            : undefined
        return (
          <ScreenShell title={activity.title} subtitle="Drag-and-drop activity" onBack={back}>
            <Panel className="p-5">
              <h2 className="text-sm font-bold leading-relaxed text-white">
                {question?.prompt ?? 'The approved drag-and-drop prompt is unavailable.'}
              </h2>
              {question && (
                <>
                  <div className="mt-4 flex flex-col gap-2">
                    {question.choices.map((choice) => (
                      <div
                        key={choice.id}
                        className="rounded-[var(--radius-chip)] border border-space-600 px-3 py-2 text-[13px] text-hull-200"
                      >
                        {choice.text}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-wide text-hull-400">
                    Targets: {question.targets.map((target) => target.text).join(' · ')}
                  </p>
                </>
              )}
            </Panel>
            <Button disabled className="w-full py-3 text-sm">
              Interactive sorting coming soon
            </Button>
          </ScreenShell>
        )
      }

      case 'quizFill': {
        const activity = activityFor('fill')
        const question =
          activity.record.type === 'quiz'
            ? activity.record.content?.questions.find((item) => item.interaction === 'fill_blank')
            : undefined
        return (
          <ScreenShell title={activity.title} subtitle="Fill in the blank" onBack={back}>
            <Panel className="p-5">
              <p className="text-sm leading-relaxed text-hull-200">
                {question?.prompt ?? 'The approved fill-in prompt is unavailable.'}
              </p>
              <Field label="Your answer">
                <input
                  className={inputClass}
                  value={interactionValue}
                  onChange={(event) => setInteractionValue(event.target.value)}
                />
              </Field>
            </Panel>
            <Button disabled className="w-full py-3 text-sm">
              Interactive grading coming soon
            </Button>
          </ScreenShell>
        )
      }

      case 'caseVignette': {
        const activity = activityFor('case')
        const content = activity.record.type === 'case_vignette' ? activity.record.content : null
        return (
          <ScreenShell title={activity.title} subtitle="Clinical case · SBAR" onBack={back}>
            <Panel className="p-5">
              <p className="text-sm leading-relaxed text-hull-200">
                {content?.scenario ?? 'The approved case payload is unavailable.'}
              </p>
              {content && (
                <>
                  <div className="mt-4 flex flex-col gap-2">
                    {content.decisions.map((decision) => (
                      <button
                        key={decision.id}
                        type="button"
                        aria-pressed={interactionValue === decision.id}
                        onClick={() => setInteractionValue(decision.id)}
                        className={`rounded-[var(--radius-button)] border px-3 py-3 text-left text-[13px] ${
                          interactionValue === decision.id
                            ? 'border-ember-400 bg-ember-500/15 text-white'
                            : 'border-space-600 text-hull-200'
                        }`}
                      >
                        {decision.text}
                      </button>
                    ))}
                  </div>
                  <Field label={content.sbar.prompt}>
                    <textarea
                      className={`${inputClass} mt-3 min-h-24 resize-y`}
                      value={interactionNote}
                      onChange={(event) => setInteractionNote(event.target.value)}
                    />
                  </Field>
                </>
              )}
            </Panel>
            <Button
              disabled={!content || !interactionValue || !interactionNote.trim()}
              onClick={() =>
                completeActivity(activity, {
                  type: 'case_vignette',
                  decisionIds: [interactionValue],
                  sbar: interactionNote,
                })
              }
              className="w-full py-3 text-sm"
            >
              Submit case · {activity.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'quest': {
        const activity = activityFor('quest')
        const content = activity.record.type === 'quest' ? activity.record.content : null
        return (
          <ScreenShell title={activity.title} subtitle="Supervised real-world quest" onBack={back}>
            <Panel className="p-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-hull-200">
                {content?.instructions ?? 'The approved quest payload is unavailable.'}
              </p>
              {content && (
                <div className="mt-4 rounded-[var(--radius-chip)] border border-space-600 bg-space-950/50 p-3">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wide text-ember-300">
                    Supervisor
                  </span>
                  <span className="mt-1 block text-sm text-white">{content.supervisorRole}</span>
                  <span className="mt-2 block text-[11px] text-hull-400">
                    Validation: {content.offlineValidation.method.replaceAll('_', ' ')}
                  </span>
                  <label className="mt-4 flex items-start gap-3 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={interactionValue === 'confirmed'}
                      onChange={(event) =>
                        setInteractionValue(event.target.checked ? 'confirmed' : '')
                      }
                      className="mt-0.5 size-5 shrink-0 accent-ember-500"
                    />
                    I completed this quest with the named supervisor.
                  </label>
                </div>
              )}
            </Panel>
            <Button
              disabled={!content || interactionValue !== 'confirmed'}
              onClick={() =>
                completeActivity(activity, {
                  type: 'quest',
                  evidence: { supervisorConfirmed: true },
                })
              }
              className="w-full py-3 text-sm"
            >
              Record completion · {activity.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'activityComplete':
        return (
          <OutcomeShell>
            <div className="completion-mark" aria-hidden="true">
              <span className="completion-orbit" />
              <span className="completion-check">
                <CheckIcon className="size-12" />
              </span>
              <span className="completion-spark completion-spark-one">✦</span>
              <span className="completion-spark completion-spark-two">✦</span>
              <span className="completion-spark completion-spark-three">✦</span>
            </div>
            <div className="completion-copy">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-ember-700">
                Checkpoint cleared
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-space-950">Activity complete</h1>
              <p className="mt-3 rounded-full border-2 border-aqua-400/50 bg-pastel-mint px-4 py-2 text-sm font-bold text-space-900">
                {lastEarned?.title ?? 'Checkpoint'}
              </p>
            </div>
            <Badge
              tone="points"
              icon={<StarIcon className="size-3" />}
              className="completion-reward px-4 py-2 text-sm"
              aria-label={`+${lastEarned?.points ?? 0} PEEP points`}
            >
              <span aria-hidden="true">
                +<EarnedPointsCount value={lastEarned?.points ?? 0} /> PEEP points
              </span>
            </Badge>
            <ProgressMeter
              label="Island progress"
              value={Math.round((islandDone / island.activities.length) * 100)}
              className="completion-progress w-full rounded-[var(--radius-panel)] border-2 border-aqua-400/50 bg-pastel-mint p-3 shadow-[0_4px_0_#5faea8]"
            />
            <div className="completion-actions flex w-full flex-col gap-2">
              {islandDone === island.activities.length && !passedIslands[island.id] ? (
                island.finalExam.contentStatus === 'ready' && island.finalExam.content ? (
                  <Button onClick={() => go('finalExamIntro')} className="w-full py-3 text-sm">
                    Island cleared — take the final exam
                  </Button>
                ) : (
                  <Button disabled className="w-full py-3 text-sm">
                    Final exam coming soon
                  </Button>
                )
              ) : (
                <Button onClick={() => resetTo('island', 'back')} className="w-full py-3 text-sm">
                  Back to {island.name}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => resetTo('dashboard', 'back')}
                className="w-full"
              >
                Return to planet map
              </Button>
            </div>
          </OutcomeShell>
        )

      case 'finalExamIntro':
      case 'finalExamQuestion':
      case 'examResults':
        return (
          <ScreenShell
            title={`${island.name} final exam`}
            subtitle="Assessment unavailable"
            onBack={back}
          >
            <Panel className="p-5">
              <Badge tone="neutral" className="mb-3">
                coming soon
              </Badge>
              <h2 className="text-base font-extrabold text-white">{island.finalExam.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-hull-200">
                The source corpus does not contain an approved final-exam question bank for this
                island. No synthetic questions or points will be used.
              </p>
            </Panel>
            <Button
              variant="secondary"
              onClick={() => resetTo('island', 'back')}
              className="w-full"
            >
              Return to {island.name}
            </Button>
          </ScreenShell>
        )

      case 'islandComplete':
        return (
          <OutcomeShell>
            <Badge tone="neutral">assessment pending</Badge>
            <h1 className="text-3xl font-extrabold leading-tight text-white">{island.name}</h1>
            <p className="max-w-xs text-sm leading-relaxed text-hull-300">
              Island completion cannot be recorded until its approved final exam is available.
            </p>
            <Button onClick={() => resetTo('dashboard', 'back')} className="w-full py-3 text-sm">
              Return to planet map
            </Button>
          </OutcomeShell>
        )

      case 'courseComplete':
        return (
          <OutcomeShell>
            <Badge tone="neutral">course completion pending</Badge>
            <h1 className="text-3xl font-extrabold leading-tight text-white">
              Final assessments unavailable
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-hull-300">
              Graduation remains locked until all six approved final-exam banks are supplied and
              passed.
            </p>
            <Button onClick={() => resetTo('dashboard', 'back')} className="w-full py-3 text-sm">
              Back to the planet
            </Button>
          </OutcomeShell>
        )

      case 'profile':
        return (
          <ScreenShell title="Profile" subtitle="Local identity & record">
            <HudProfile username={displayName} streakDays={streak} points={points} />
            <Panel className="p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Activities', value: `${totalDone}/${totalActivities}` },
                  { label: 'Islands cleared', value: `${Object.keys(passedIslands).length}/6` },
                  { label: 'Exams passed', value: String(Object.keys(passedIslands).length) },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-[var(--radius-chip)] border border-space-600 bg-space-950/50 px-2 py-3"
                  >
                    <span className="block text-lg font-extrabold text-white">{s.value}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-hull-400">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel className="p-4">
              <Field label="Display name">
                <div className="flex gap-2">
                  <input
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value)
                      setProfileSaved(false)
                    }}
                    className={inputClass}
                    maxLength={24}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => setProfileSaved(true)}
                    disabled={displayName.trim().length === 0}
                  >
                    Save
                  </Button>
                </div>
              </Field>
              {profileSaved && (
                <p
                  role="status"
                  className="mt-2 font-mono text-[11px] font-bold text-signal-success"
                >
                  Saved locally — no data leaves this device.
                </p>
              )}
            </Panel>
            <Panel variant="outline" className="flex items-center gap-3 p-4">
              <UserIcon className="size-5 shrink-0 text-nebula-300" />
              <p className="text-[12px] leading-relaxed text-hull-300">
                Operative:{' '}
                <span className="font-bold text-hull-100">
                  {AVATARS.find((a) => a.id === avatar)?.label ?? 'Unassigned'}
                </span>
                . Progress is stored in this browser only and can be exported via your site
                coordinator.
              </p>
            </Panel>
          </ScreenShell>
        )

      case 'settings':
        return (
          <ScreenShell title="Settings" subtitle="Device-local preferences">
            <div className="flex flex-col gap-2">
              <ToggleRow
                label="Sound effects"
                description="Chimes on completion and streak milestones"
                checked={soundOn}
                onChange={setSoundOn}
              />
              <ToggleRow
                label="Reduce motion"
                description="Calmer transitions across the planet map"
                checked={reduceMotion}
                onChange={setReduceMotion}
              />
              <ToggleRow
                label="Offline mode"
                description="Simulate a lost connection; packaged content keeps working"
                checked={!online}
                onChange={(v) => {
                  setOnline(!v)
                  if (v) go('offline')
                }}
              />
            </div>
            <Panel className="p-4">
              <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-wider text-hull-300">
                Study role
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['learner', 'researcher'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={`rounded-[var(--radius-button)] border px-3 py-2.5 font-mono text-[11px] font-bold capitalize ${
                      role === r
                        ? 'border-nebula-400 bg-nebula-500/20 text-nebula-200'
                        : 'border-space-600 bg-space-950/50 text-hull-300 hover:bg-space-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <Button
                variant="nebula"
                className="mt-3 w-full"
                onClick={() => go(role === 'researcher' ? 'researcher' : 'accessDenied')}
              >
                <BoxIcon className="size-4" />
                Open researcher console
              </Button>
            </Panel>
            <p className="text-center font-mono text-[10px] text-hull-500">
              GAMER-ICU · local-first build · no telemetry
            </p>
          </ScreenShell>
        )

      case 'researcher':
        return (
          <ScreenShell
            title="Researcher console"
            subtitle="Aggregate-only view · k≥5 suppression applied"
            onBack={() => resetTo('settings', 'back')}
            headerRight={
              <Badge tone="reading" icon={<ShieldIcon className="size-3" />}>
                no PII
              </Badge>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Participants', value: '48' },
                { label: 'Avg completion', value: '51%' },
                { label: 'Avg exam score', value: '78' },
                { label: 'Suppressed cells', value: '2' },
              ].map((m) => (
                <Panel key={m.label} className="p-3 text-center">
                  <span className="block text-xl font-extrabold text-white">{m.value}</span>
                  <span className="block font-mono text-[9px] uppercase tracking-wider text-hull-400">
                    {m.label}
                  </span>
                </Panel>
              ))}
            </div>
            <Panel className="overflow-hidden p-0">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-space-600 bg-space-950/60 font-mono text-[9px] uppercase tracking-wider text-hull-400">
                    <th className="px-3 py-2.5">Island</th>
                    <th className="px-2 py-2.5 text-right">n</th>
                    <th className="px-2 py-2.5 text-right">Done</th>
                    <th className="px-2 py-2.5 text-right">Avg</th>
                    <th className="px-3 py-2.5 text-right">Med min</th>
                  </tr>
                </thead>
                <tbody>
                  {RESEARCH_ROWS.map((r) => (
                    <tr key={r.island} className="border-b border-space-600/50 last:border-0">
                      <td className="px-3 py-2.5 font-bold text-hull-100">{r.island}</td>
                      <td className="px-2 py-2.5 text-right font-mono text-hull-300">
                        {r.enrolled < 5 ? '—' : r.enrolled}
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono text-hull-300">
                        {r.completion}%
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono text-hull-300">
                        {r.avgScore}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-hull-300">
                        {r.medianMin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <div className="flex flex-col gap-2">
              <Button variant="nebula" onClick={downloadCsv} className="w-full">
                <DownloadIcon className="size-4" />
                Download aggregate CSV
              </Button>
              {csvSaved && (
                <p
                  role="status"
                  className="text-center font-mono text-[11px] font-bold text-signal-success"
                >
                  Aggregate export generated — contains no participant identifiers.
                </p>
              )}
            </div>
          </ScreenShell>
        )

      case 'offline':
        return (
          <OutcomeShell>
            <span
              className="grid size-20 place-items-center rounded-full bg-space-800 text-hull-300"
              aria-hidden="true"
            >
              <WifiOffIcon className="size-10" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">You are offline</h1>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-hull-300">
                No connection detected. Packaged lessons, quizzes and your saved progress keep
                working — anything new will sync when you are back.
              </p>
            </div>
            <Panel variant="outline" className="w-full p-4 text-left">
              <p className="font-mono text-[11px] leading-relaxed text-hull-300">
                Cached: 6 islands · 17 activities · all exam banks. Nothing to download.
              </p>
            </Panel>
            <div className="flex w-full flex-col gap-2">
              <Button
                onClick={() => {
                  setOnline(true)
                  resetTo('dashboard')
                }}
                className="w-full py-3 text-sm"
              >
                Retry connection
              </Button>
              <Button variant="secondary" onClick={() => resetTo('dashboard')} className="w-full">
                Keep learning offline
              </Button>
            </div>
          </OutcomeShell>
        )

      case 'accessDenied':
        return (
          <OutcomeShell>
            <span
              className="grid size-20 place-items-center rounded-full bg-signal-danger/15 text-signal-danger"
              aria-hidden="true"
            >
              <LockIcon className="size-10" />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Access denied</h1>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-hull-300">
                The researcher console requires a researcher or administrator role. Your current
                role is <span className="font-bold text-hull-100">{role}</span>. This attempt has
                been recorded in the local audit log.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2">
              <Button
                variant="nebula"
                disabled={accessRequested}
                onClick={() => setAccessRequested(true)}
                className="w-full"
              >
                {accessRequested ? 'Request sent to site coordinator' : 'Request researcher access'}
              </Button>
              {accessRequested && (
                <p role="status" className="font-mono text-[11px] font-bold text-signal-success">
                  Access request queued locally.
                </p>
              )}
              <Button
                variant="secondary"
                onClick={() => resetTo('settings', 'back')}
                className="w-full"
              >
                Back to settings
              </Button>
            </div>
          </OutcomeShell>
        )
    }
  }

  return (
    <main
      className={`relative min-h-dvh overflow-x-hidden bg-space-900 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat text-hull-100 ${
        screen === 'island'
          ? 'h-dvh overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          : ''
      } ${screen === 'login' || screen === 'register' ? 'lg:bg-right' : ''}`}
    >
      {showScreenPicker && (
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center p-2">
          <label className="flex items-center gap-2 rounded-full border border-space-600 bg-space-950/95 px-3 py-1.5 font-mono text-[10px] font-bold text-hull-300 shadow-[var(--shadow-panel)]">
            screen
            <select
              value={screen}
              onChange={(e) => resetTo(e.target.value as AppScreen)}
              className="rounded-[var(--radius-chip)] border border-space-600 bg-space-800 px-2 py-1 font-mono text-[10px] font-bold text-hull-100"
              aria-label="Preview screen"
            >
              {APP_SCREENS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div
        key={screen}
        className={
          slideDirection === 'forward'
            ? 'page-slide-forward'
            : slideDirection === 'back'
              ? 'page-slide-back'
              : undefined
        }
      >
        {renderScreen()}
      </div>
      {showNav && (
        <div className="fixed inset-x-0 bottom-5 z-20">
          <BottomNav
            activeId={navActive}
            onNavigate={(id) => {
              const nextScreen =
                id === 'home' ? 'dashboard' : id === 'profile' ? 'profile' : 'settings'
              const movingBack =
                (nextScreen === 'dashboard' && screen !== 'dashboard') ||
                (nextScreen === 'profile' && screen === 'settings')
              resetTo(nextScreen, movingBack ? 'back' : 'forward')
            }}
          />
        </div>
      )}
    </main>
  )
}
