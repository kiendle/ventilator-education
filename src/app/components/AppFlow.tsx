'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { Button } from './Button'
import { Panel, ActivityCard } from './Panel'
import { Badge } from './Badge'
import { HudProfile, HudStat } from './Hud'
import { ProgressMeter } from './ProgressMeter'
import { BottomNav } from './BottomNav'
import { MediaFrame } from './MediaFrame'
import {
  FlameIcon,
  StarIcon,
  MapIcon,
  PlayIcon,
  BookIcon,
  QuizIcon,
  UserIcon,
  BoxIcon,
} from './icons'

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
/* Local synthetic data (no external fetches)                          */
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
}

type Island = {
  id: string
  name: string
  tagline: string
  activities: Activity[]
}

const ISLANDS: Island[] = [
  {
    id: 'lake-mucosa',
    name: 'Lake Mucosa',
    tagline: 'Airway anatomy, oxygenation and your first ventilator interface.',
    activities: [
      {
        id: 'lm-01',
        title: 'Airway Anatomy & Oxygenation',
        type: 'reading',
        points: 40,
        minutes: 12,
        blurb: 'Trace the airway from nares to alveoli and read the oxygenation cascade.',
      },
      {
        id: 'lm-02',
        title: 'Vent Interfaces of Lake Mucosa',
        type: 'video',
        points: 60,
        minutes: 18,
        blurb: 'Masks, ET tubes and trachs — match the interface to the patient.',
      },
      {
        id: 'lm-03',
        title: 'Lung Sounds Quiz',
        type: 'quiz',
        points: 80,
        minutes: 10,
        blurb: 'Identify crackles, wheezes and diminished sounds from the shoreline.',
      },
      {
        id: 'lm-05',
        title: 'Monitor Match',
        type: 'matching',
        points: 75,
        minutes: 10,
        blurb: 'Match ETCO₂ and transcutaneous monitoring findings.',
      },
      {
        id: 'lm-09',
        title: 'Alarm Response Order',
        type: 'ordering',
        points: 60,
        minutes: 8,
        blurb: 'Put the bedside alarm response in a safe sequence.',
      },
      {
        id: 'lm-06',
        title: 'Minute Ventilation Check',
        type: 'fill',
        points: 50,
        minutes: 6,
        blurb: 'Calculate minute ventilation from tidal volume and rate.',
      },
      {
        id: 'lm-07',
        title: 'Clinical SBAR: Rising Pressures',
        type: 'case',
        points: 100,
        minutes: 14,
        blurb: 'Assess a deteriorating patient and deliver a focused handoff.',
      },
      {
        id: 'lm-08',
        title: 'BVM Skills Quest',
        type: 'quest',
        points: 120,
        minutes: 15,
        blurb: 'Complete supervised bag-mask ventilation practice.',
      },
      {
        id: 'lm-04',
        title: 'Ventilator Lab: First Settings',
        type: 'sim',
        points: 120,
        minutes: 15,
        blurb: 'Dial in FiO₂, PEEP and rate for a simulated pediatric patient.',
      },
    ],
  },
  {
    id: 'interlobar-divides',
    name: 'Interlobar Divides',
    tagline: 'Alarms, troubleshooting and congenital heart considerations.',
    activities: [
      {
        id: 'id-01',
        title: 'Vent Alarms 101',
        type: 'video',
        points: 60,
        minutes: 14,
        blurb: 'High pressure, low pressure — respond before the second chime.',
      },
      {
        id: 'id-02',
        title: 'CCDH Considerations',
        type: 'reading',
        points: 50,
        minutes: 16,
        blurb: 'Ventilating the single-ventricle patient across the divides.',
      },
      {
        id: 'id-03',
        title: 'Alarm Response Drill',
        type: 'quiz',
        points: 90,
        minutes: 12,
        blurb: 'Timed scenarios across the ridge.',
      },
    ],
  },
  {
    id: 'valley-of-pulmonara',
    name: 'Valley of Pulmonara',
    tagline: 'Airway malacia, vent waveforms and loop reading.',
    activities: [
      {
        id: 'vp-01',
        title: 'Tracheobronchomalacia Rounds',
        type: 'reading',
        points: 50,
        minutes: 15,
        blurb: 'Nurse-led care for collapsible airways.',
      },
      {
        id: 'vp-02',
        title: 'Vent Lab: Loops',
        type: 'sim',
        points: 120,
        minutes: 20,
        blurb: 'Read pressure-volume loops and fix the beak.',
      },
    ],
  },
  {
    id: 'bronchial-bluffs',
    name: 'Bronchial Bluffs',
    tagline: 'Blood gases, chest imaging and bagging technique.',
    activities: [
      {
        id: 'bb-01',
        title: 'Act on the Gas',
        type: 'quiz',
        points: 100,
        minutes: 12,
        blurb: 'ABG in, action out — interpret and respond.',
      },
      {
        id: 'bb-02',
        title: 'Chest X-Ray Reading',
        type: 'video',
        points: 70,
        minutes: 16,
        blurb: 'Tube position, opacities and air leaks from the cliffs.',
      },
    ],
  },
  {
    id: 'mount-pneumora',
    name: 'Mount Pneumora',
    tagline: 'APRV, HFOV and high-altitude escalation.',
    activities: [
      {
        id: 'mp-01',
        title: 'APRV Ascent',
        type: 'reading',
        points: 60,
        minutes: 18,
        blurb: 'Release ventilation without losing recruitment.',
      },
      {
        id: 'mp-02',
        title: 'HFOV Summit Drill',
        type: 'sim',
        points: 140,
        minutes: 22,
        blurb: 'Amplitude, frequency and mean airway pressure at altitude.',
      },
    ],
  },
  {
    id: 'alveolar-highlands',
    name: 'Alveolar Highlands',
    tagline: 'Weaning, extubation readiness and the final ridge.',
    activities: [
      {
        id: 'ah-01',
        title: 'Extubation Readiness Trial',
        type: 'quiz',
        points: 110,
        minutes: 14,
        blurb: 'ERT criteria before you pull the tube.',
      },
      {
        id: 'ah-02',
        title: 'Weaning the Highlands',
        type: 'video',
        points: 80,
        minutes: 15,
        blurb: 'Pressure support trials and CPAP ladders.',
      },
    ],
  },
]

const ISLAND_SPOTS = [
  { left: '51%', top: '84%', tooltip: 'above' },
  { left: '60%', top: '64%', tooltip: 'above' },
  { left: '47%', top: '42%', tooltip: 'above' },
  { left: '21%', top: '29%', tooltip: 'right' },
  { left: '79%', top: '30%', tooltip: 'left' },
  { left: '55%', top: '12%', tooltip: 'below' },
] as const

const QUIZ_QUESTION = {
  prompt:
    'You auscultate fine crackles at the bases that do not clear with suctioning, alongside rising plateau pressures. What is the most likely finding?',
  options: [
    { id: 'a', text: 'Mucus plug in the endotracheal tube', correct: false },
    { id: 'b', text: 'Pulmonary edema / fluid overload', correct: true },
    { id: 'c', text: 'Bronchospasm requiring albuterol', correct: false },
    { id: 'd', text: 'Normal variant — document and monitor', correct: false },
  ],
  rationale:
    'Fine crackles that persist after suctioning plus rising plateau pressures point to alveolar fluid — escalate to the provider and review fluid status and PEEP strategy.',
}

const EXAM_QUESTIONS = [
  {
    prompt: 'Your patient on AC/VC has a high-pressure alarm. First action?',
    options: [
      'Silence the alarm and re-chart',
      'Assess the patient, then the circuit, then the ventilator',
      'Increase the pressure limit',
      'Switch to HFOV immediately',
    ],
    answer: 1,
  },
  {
    prompt: 'pH 7.28 / pCO₂ 58 / HCO₃⁻ 26. Interpretation?',
    options: [
      'Respiratory alkalosis',
      'Metabolic acidosis',
      'Respiratory acidosis',
      'Compensated mixed disorder',
    ],
    answer: 2,
  },
  {
    prompt: 'Best evidence of extubation readiness?',
    options: [
      'FiO₂ 100% for 24 hours',
      'Passing an ERT with minimal support and stable gases',
      'Absence of secretions entirely',
      'Family request',
    ],
    answer: 1,
  },
]

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

const PASS_MARK = 2

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
  const crawlRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const [playing, setPlaying] = useState(true);
  const [canAnimate, setCanAnimate] = useState(true);

  useEffect(() => {
    const animation = crawlRef.current?.getAnimations()[0];
    const progress = progressRef.current;

    if (!animation || !progress) {
      setCanAnimate(false);
      setPlaying(false);
      return;
    }

    const syncProgress = () => {
      const duration = Number(animation.effect?.getTiming().duration) || 1;
      const percent = Math.min(100, (Number(animation.currentTime) / duration) * 100);
      progress.value = String(percent);
      progress.setAttribute("aria-valuetext", `${Math.round(percent)}%`);
    };

    animation.onfinish = () => setPlaying(false);
    syncProgress();
    const timer = window.setInterval(syncProgress, 100);

    return () => {
      animation.onfinish = null;
      window.clearInterval(timer);
    };
  }, []);

  function togglePlayback() {
    const animation = crawlRef.current?.getAnimations()[0];
    if (!animation) return;

    if (animation.playState === "running") {
      animation.pause();
      setPlaying(false);
      return;
    }

    const duration = Number(animation.effect?.getTiming().duration) || 1;
    if (Number(animation.currentTime) >= duration) animation.currentTime = 0;
    animation.play();
    setPlaying(true);
  }

  function seek(event: ChangeEvent<HTMLInputElement>) {
    const animation = crawlRef.current?.getAnimations()[0];
    if (!animation) return;

    const duration = Number(animation.effect?.getTiming().duration) || 1;
    animation.currentTime = (Number(event.currentTarget.value) / 100) * duration;
    if (playing) animation.play();
    else animation.pause();
  }

  function restart() {
    const animation = crawlRef.current?.getAnimations()[0];
    if (!animation) return;
    animation.currentTime = 0;
    animation.play();
    setPlaying(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="mission-crawl-stage">
        <div ref={crawlRef} className="mission-crawl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.28em]">Mission briefing</p>
          <h2 className="my-5 text-3xl font-black uppercase tracking-wide">Your orders, Nurse</h2>
          <p>
            Atelecta Prime is in respiratory distress. Across six islands you will master the RN
            IMV competency domains: airway and interfaces, alarms and troubleshooting, waveforms,
            blood gases, advanced modes, and weaning.
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
          {playing ? "Pause" : "Play"}
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
  );
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
  initialScreen?: AppScreen
  showScreenPicker?: boolean
}

export function AppFlow({ initialScreen = 'welcome', showScreenPicker = false }: AppFlowProps) {
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
  const [completed, setCompleted] = useState<Record<string, boolean>>({ 'lm-01': true })
  const [unlockedIslands, setUnlockedIslands] = useState(1)
  const [currentIslandIdx, setCurrentIslandIdx] = useState(0)
  const [dashboardView, setDashboardView] = useState<'map' | 'list'>('map')
  const dashboardGesture = useRef({ y: 0, listAtTop: true })
  const dashboardListRef = useRef<HTMLDivElement>(null)
  const [lastEarned, setLastEarned] = useState<{ title: string; points: number } | null>(null)
  const [passedIslands, setPassedIslands] = useState<Record<string, boolean>>({})

  // Quiz state
  const [quizChoice, setQuizChoice] = useState<string | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Vent sim state
  const [fio2, setFio2] = useState(60)
  const [peep, setPeep] = useState(8)
  const [rate, setRate] = useState(24)
  const [mode, setMode] = useState<'AC/VC' | 'AC/PC' | 'SIMV'>('AC/VC')

  // Exam state
  const [examIdx, setExamIdx] = useState(0)
  const [examAnswers, setExamAnswers] = useState<number[]>([])
  const [examChoice, setExamChoice] = useState<number | null>(null)

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

  const island = ISLANDS[currentIslandIdx]
  const islandDone = island.activities.filter((a) => completed[a.id]).length
  const totalActivities = ISLANDS.reduce((total, item) => total + item.activities.length, 0)
  const totalDone = ISLANDS.reduce(
    (total, item) => total + item.activities.filter((activity) => completed[activity.id]).length,
    0
  )

  const examScore = examAnswers.filter((a, i) => a === EXAM_QUESTIONS[i].answer).length
  const examPassed = examScore >= PASS_MARK
  const allIslandsPassed = ISLANDS.every((i) => passedIslands[i.id])

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

  function completeActivity(a: Activity) {
    if (!completed[a.id]) {
      setCompleted((c) => ({ ...c, [a.id]: true }))
      setPoints((p) => p + a.points)
    }
    setLastEarned({ title: a.title, points: a.points })
    go('activityComplete')
  }

  function openActivity(a: Activity) {
    setInteractionValue('')
    setInteractionNote('')
    if (a.type === 'reading') go('lessonReading')
    else if (a.type === 'video') go('lessonVideo')
    else if (a.type === 'sim') go('ventSim')
    else if (a.type === 'matching') go('quizMatch')
    else if (a.type === 'ordering') go('quizDrag')
    else if (a.type === 'fill') go('quizFill')
    else if (a.type === 'case') go('caseVignette')
    else if (a.type === 'quest') go('quest')
    else {
      setQuizChoice(null)
      setQuizSubmitted(false)
      go('quiz')
    }
  }

  function submitExamAnswer() {
    if (examChoice === null) return
    const next = [...examAnswers, examChoice]
    setExamAnswers(next)
    setExamChoice(null)
    if (examIdx + 1 < EXAM_QUESTIONS.length) {
      setExamIdx(examIdx + 1)
    } else {
      go('examResults')
    }
  }

  function finishExam() {
    if (examPassed) {
      setPassedIslands((p) => ({ ...p, [island.id]: true }))
      setUnlockedIslands((n) => Math.min(ISLANDS.length, Math.max(n, currentIslandIdx + 2)))
      setPoints((p) => p + 200)
      go('islandComplete')
    } else {
      setExamIdx(0)
      setExamAnswers([])
      resetTo('island')
    }
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
                            className={`mt-3 block h-2 overflow-hidden rounded-full ${
                              locked ? 'bg-space-700' : 'bg-white/70'
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
            subtitle={`Island ${currentIslandIdx + 1} of 6`}
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
                className="mt-3"
              />
            </Panel>

            <div className="flex flex-col gap-3">
              {island.activities.map((a) => {
                const Icon = activityIcon[a.type]
                const isDone = !!completed[a.id]
                return (
                  <div
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openActivity(a)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openActivity(a)
                      }
                    }}
                    className="cursor-pointer"
                    aria-label={`${a.title}, ${a.type}, ${a.points} PEEP points${isDone ? ', completed' : ''}`}
                  >
                    <ActivityCard
                      title={a.title}
                      points={a.points}
                      minutes={a.minutes}
                      completed={isDone}
                      icon={<Icon className="size-4" />}
                    />
                  </div>
                )
              })}
            </div>

            <div className="mt-2">
              {islandDone === island.activities.length && !passedIslands[island.id] ? (
                <Button onClick={() => go('finalExamIntro')} className="w-full py-3 text-sm">
                  Take the island final exam
                </Button>
              ) : (
                <p className="text-center font-mono text-[10px] font-bold text-hull-400">
                  {passedIslands[island.id]
                    ? 'Exam cleared — the next island is charted.'
                    : `Finish ${island.activities.length - islandDone} more ${island.activities.length - islandDone === 1 ? 'activity' : 'activities'} to unlock the final exam.`}
                </p>
              )}
            </div>
          </ScreenShell>
        )

      case 'lessonReading': {
        const a = island.activities.find((x) => x.type === 'reading')!
        return (
          <ScreenShell title={a.title} subtitle="Reading · ~12 min" onBack={back}>
            <Panel className="p-5">
              <Badge tone="reading" icon={<BookIcon className="size-3" />} className="mb-3">
                reading
              </Badge>
              <h2 className="mb-2 text-base font-extrabold text-white">The oxygenation cascade</h2>
              <MediaFrame
                src="/alveolar-comparison.svg"
                alt="Stylized comparison of open air-filled alveoli and alveoli collecting fluid"
                width={1200}
                height={675}
                className="mb-4"
              />
              <div className="flex flex-col gap-3 text-sm leading-relaxed text-hull-200">
                <p>
                  Oxygen moves from room air (FiO₂ 0.21) through the conducting airways to the
                  alveolar-capillary membrane. Each step — humidification, airway caliber, alveolar
                  recruitment, diffusion, perfusion — is a checkpoint where pediatric patients can
                  fail faster than adults.
                </p>
                <p>
                  <span className="font-bold text-ember-300">Clinical anchor:</span> mean airway
                  pressure, not PEEP alone, drives oxygenation. When saturations drift, think
                  recruitment before you think rate.
                </p>
                <p>
                  On this island you will connect airway anatomy to the interfaces that deliver
                  support — and learn why the smallest airways set the biggest constraints.
                </p>
              </div>
            </Panel>
            <Button onClick={() => completeActivity(a)} className="w-full py-3 text-sm">
              Mark as read · +{a.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'lessonVideo': {
        const a = island.activities.find((x) => x.type === 'video')!
        return (
          <ScreenShell title={a.title} subtitle="Video · ~18 min" onBack={back}>
            <Panel variant="outline" className="overflow-hidden">
              <div className="grid aspect-video place-items-center bg-space-950">
                <span
                  className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-nebula-400 to-nebula-600 text-white shadow-[var(--shadow-fab)]"
                  aria-hidden="true"
                >
                  <PlayIcon className="size-7" />
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-mono text-[10px] font-bold text-hull-300">
                  VENT-INTERFACES.MP4 · 18:04
                </span>
                <Badge tone="video" icon={<PlayIcon className="size-3" />}>
                  video
                </Badge>
              </div>
            </Panel>
            <Panel className="p-4">
              <h2 className="mb-1 text-sm font-extrabold text-white">What you will see</h2>
              <p className="text-[13px] leading-relaxed text-hull-300">
                Interface selection from nasal prongs to tracheostomy, leak compensation, and the
                two-point check before every position change. Packaged media plays fully offline.
              </p>
            </Panel>
            <Button onClick={() => completeActivity(a)} className="w-full py-3 text-sm">
              Finish watching · +{a.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'ventSim': {
        const a = island.activities.find((x) => x.type === 'sim')!
        const inRange = fio2 <= 80 && peep >= 5 && peep <= 10 && rate >= 18 && rate <= 28
        return (
          <ScreenShell
            title={a.title}
            subtitle="Simulation · orders: FiO₂ ≤ 80, PEEP 5–10, rate 18–28"
            onBack={back}
          >
            <Panel className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <Badge tone="quiz" icon={<WaveIcon className="size-3" />}>
                  vent lab
                </Badge>
                <span
                  className={`font-mono text-[10px] font-bold ${inRange ? 'text-signal-success' : 'text-solar-500'}`}
                >
                  {inRange ? 'WITHIN ORDERS' : 'OUTSIDE ORDERS'}
                </span>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {(['AC/VC', 'AC/PC', 'SIMV'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`rounded-[var(--radius-chip)] border px-2 py-2 font-mono text-[11px] font-bold ${
                      mode === m
                        ? 'border-ember-400 bg-ember-500/20 text-ember-300'
                        : 'border-space-600 bg-space-950/50 text-hull-300 hover:bg-space-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <Field label={`FiO₂ — ${fio2}%`}>
                <input
                  type="range"
                  min={21}
                  max={100}
                  value={fio2}
                  onChange={(e) => setFio2(Number(e.target.value))}
                  className="w-full accent-ember-500"
                  aria-label="FiO2 percent"
                />
              </Field>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {(
                  [
                    { label: 'PEEP', value: peep, set: setPeep, min: 0, max: 15, unit: 'cmH₂O' },
                    { label: 'Rate', value: rate, set: setRate, min: 8, max: 40, unit: 'b/min' },
                  ] as const
                ).map((ctl) => (
                  <div
                    key={ctl.label}
                    className="rounded-[var(--radius-panel)] border border-space-600 bg-space-950/50 p-3 text-center"
                  >
                    <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-hull-400">
                      {ctl.label}
                    </span>
                    <span className="my-1 block text-2xl font-extrabold text-white">
                      {ctl.value}
                      <span className="ml-1 text-[10px] font-normal text-hull-400">{ctl.unit}</span>
                    </span>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${ctl.label}`}
                        onClick={() => ctl.set(Math.max(ctl.min, ctl.value - 1))}
                        className="grid size-9 place-items-center rounded-[var(--radius-chip)] border border-space-600 bg-space-800 text-lg font-bold text-hull-100 hover:bg-space-700"
                      >
                        −
                      </button>
                      <button
                        type="button"
                        aria-label={`Increase ${ctl.label}`}
                        onClick={() => ctl.set(Math.min(ctl.max, ctl.value + 1))}
                        className="grid size-9 place-items-center rounded-[var(--radius-chip)] border border-space-600 bg-space-800 text-lg font-bold text-hull-100 hover:bg-space-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 rounded-[var(--radius-chip)] border border-space-600 bg-space-950/60 px-3 py-2 font-mono text-[11px] leading-relaxed text-hull-300">
                {mode} · FiO₂ {fio2}% · PEEP {peep} · RR {rate} —{' '}
                {inRange
                  ? 'SpO₂ trending 94%. Document and reassess in 30 minutes.'
                  : 'Simulated saturations drifting. Bring settings inside the ordered envelope.'}
              </p>
            </Panel>
            <Button onClick={() => completeActivity(a)} className="w-full py-3 text-sm">
              Apply settings & finish · +{a.points} PEEP
            </Button>
          </ScreenShell>
        )
      }

      case 'quiz': {
        const a = island.activities.find((x) => x.type === 'quiz')!
        return (
          <ScreenShell title={a.title} subtitle="Question 1 of 1 · checkpoint" onBack={back}>
            <Panel className="p-5">
              <Badge tone="quiz" icon={<QuizIcon className="size-3" />} className="mb-3">
                checkpoint quiz
              </Badge>
              <h2 className="text-sm font-bold leading-relaxed text-white">
                {QUIZ_QUESTION.prompt}
              </h2>
              <MediaFrame
                src="/alveolar-comparison.svg"
                alt="Stylized comparison of open air-filled alveoli and alveoli collecting fluid"
                width={1200}
                height={675}
                className="mt-4"
              />
              <div className="mt-4 flex flex-col gap-2">
                {QUIZ_QUESTION.options.map((opt) => {
                  const selected = quizChoice === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setQuizChoice(opt.id)}
                      aria-pressed={selected}
                      className={`flex items-center gap-3 rounded-[var(--radius-button)] border px-4 py-3 text-left text-[13px] ${
                        selected
                          ? 'border-ember-400 bg-ember-500/15 text-white'
                          : 'border-space-600 bg-space-950/50 text-hull-200 hover:bg-space-700'
                      }`}
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold ${
                          selected
                            ? 'border-ember-400 bg-ember-500 text-white'
                            : 'border-hull-500 text-hull-400'
                        }`}
                        aria-hidden="true"
                      >
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.text}
                    </button>
                  )
                })}
              </div>
            </Panel>
            <Button
              disabled={!quizChoice}
              onClick={() => {
                setQuizSubmitted(true)
                go('quizFeedback')
              }}
              className="w-full py-3 text-sm"
            >
              Submit answer
            </Button>
          </ScreenShell>
        )
      }

      case 'quizFeedback': {
        const a = island.activities.find((x) => x.type === 'quiz')!
        const chosen = QUIZ_QUESTION.options.find((o) => o.id === quizChoice)
        const correct = !!chosen?.correct
        return (
          <ScreenShell
            title="Feedback"
            subtitle={correct ? 'Checkpoint cleared' : 'Not quite'}
            onBack={back}
          >
            <Panel className={`p-5 ${correct ? '' : 'border-signal-danger/60'}`}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`grid size-10 place-items-center rounded-full ${
                    correct
                      ? 'bg-signal-success/20 text-signal-success'
                      : 'bg-signal-danger/20 text-signal-danger'
                  }`}
                  aria-hidden="true"
                >
                  {correct ? <CheckIcon className="size-5" /> : <QuizIcon className="size-5" />}
                </span>
                <h2 className="text-base font-extrabold text-white">
                  {correct ? 'Correct — nice assessment.' : 'Review the rationale below.'}
                </h2>
              </div>
              {chosen && (
                <p className="mb-2 font-mono text-[11px] text-hull-400">
                  You chose: <span className="text-hull-200">{chosen.text}</span>
                </p>
              )}
              <p className="text-sm leading-relaxed text-hull-200">{QUIZ_QUESTION.rationale}</p>
            </Panel>
            <Button
              onClick={() => {
                if (correct || quizSubmitted) completeActivity(a)
              }}
              className="w-full py-3 text-sm"
            >
              {correct ? `Collect +${a.points} PEEP` : 'Continue anyway'}
            </Button>
          </ScreenShell>
        )
      }

      case 'quizMatch': {
        const activity = island.activities.find((item) => item.type === 'matching')!
        const correct = interactionValue === 'ETCO2|TCOM'
        return (
          <ScreenShell title={activity.title} subtitle="Matching · monitoring" onBack={back}>
            <Panel className="p-5">
              <h2 className="text-sm font-bold text-white">
                Match each finding to its monitoring source.
              </h2>
              <div className="mt-4 flex flex-col gap-4">
                <Field label="Real-time waveform at end exhalation">
                  <select
                    className={inputClass}
                    value={interactionValue.split('|')[0] ?? ''}
                    onChange={(event) =>
                      setInteractionValue(
                        `${event.target.value}|${interactionValue.split('|')[1] ?? ''}`
                      )
                    }
                  >
                    <option value="">Choose monitor</option>
                    <option value="ETCO2">ETCO₂</option>
                    <option value="TCOM">TCOM</option>
                  </select>
                </Field>
                <Field label="Slow trend affected by skin perfusion">
                  <select
                    className={inputClass}
                    value={interactionValue.split('|')[1] ?? ''}
                    onChange={(event) =>
                      setInteractionValue(
                        `${interactionValue.split('|')[0] ?? ''}|${event.target.value}`
                      )
                    }
                  >
                    <option value="">Choose monitor</option>
                    <option value="ETCO2">ETCO₂</option>
                    <option value="TCOM">TCOM</option>
                  </select>
                </Field>
              </div>
              {interactionNote && (
                <p role="alert" className="mt-4 text-[12px] text-signal-danger">
                  {interactionNote}
                </p>
              )}
            </Panel>
            <Button
              className="w-full py-3 text-sm"
              onClick={() =>
                correct
                  ? completeActivity(activity)
                  : setInteractionNote('Review response speed and sampling method, then try again.')
              }
            >
              Check matches
            </Button>
          </ScreenShell>
        )
      }

      case 'quizDrag': {
        const activity = island.activities.find((item) => item.type === 'ordering')!
        const steps = ['Assess the patient', 'Inspect the circuit', 'Check the ventilator']
        const ordered = interactionValue ? interactionValue.split('|') : []
        const remaining = steps.filter((step) => !ordered.includes(step))
        return (
          <ScreenShell
            title={activity.title}
            subtitle="Tap-to-sort · accessible drag-and-drop"
            onBack={back}
          >
            <Panel className="p-5">
              <h2 className="text-sm font-bold text-white">
                Build the safest first-response sequence for a ventilator alarm.
              </h2>
              <ol className="mt-4 flex flex-col gap-2" aria-label="Selected response order">
                {ordered.map((step, index) => (
                  <li
                    key={step}
                    className="flex min-h-11 items-center gap-3 rounded-[var(--radius-button)] border border-ember-400/60 bg-ember-500/10 px-3 text-[13px] text-white"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-ember-500 font-mono text-[10px] font-bold">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div className="mt-4 flex flex-col gap-2" aria-label="Available response steps">
                {remaining.map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setInteractionValue([...ordered, step].join('|'))}
                    className="min-h-11 rounded-[var(--radius-button)] border border-space-600 bg-space-950/50 px-3 text-left text-[13px] text-hull-200 hover:border-ember-400"
                  >
                    Add: {step}
                  </button>
                ))}
              </div>
              {ordered.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setInteractionValue('')
                    setInteractionNote('')
                  }}
                  className="mt-4 font-mono text-[11px] font-bold text-hull-300 underline underline-offset-4"
                >
                  Reset order
                </button>
              )}
              {interactionNote && (
                <p role="alert" className="mt-4 text-[12px] text-signal-danger">
                  {interactionNote}
                </p>
              )}
            </Panel>
            <Button
              disabled={ordered.length !== steps.length}
              className="w-full py-3 text-sm"
              onClick={() =>
                interactionValue === steps.join('|')
                  ? completeActivity(activity)
                  : setInteractionNote(
                      'Start with the patient, then move outward through the system.'
                    )
              }
            >
              Check response order
            </Button>
          </ScreenShell>
        )
      }

      case 'quizFill': {
        const activity = island.activities.find((item) => item.type === 'fill')!
        return (
          <ScreenShell
            title={activity.title}
            subtitle="Fill in the blank · calculation"
            onBack={back}
          >
            <Panel className="p-5">
              <p className="text-sm leading-relaxed text-hull-200">
                Tidal volume is 120 mL and respiratory rate is 20 breaths/min.
              </p>
              <Field label="Minute ventilation in L/min" hint="Convert mL to L before multiplying.">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={interactionValue}
                  onChange={(event) => setInteractionValue(event.target.value)}
                  placeholder="0.0"
                />
              </Field>
              {interactionNote && (
                <p role="alert" className="mt-4 text-[12px] text-signal-danger">
                  {interactionNote}
                </p>
              )}
            </Panel>
            <Button
              className="w-full py-3 text-sm"
              onClick={() =>
                ['2.4', '2.40'].includes(interactionValue.trim())
                  ? completeActivity(activity)
                  : setInteractionNote('Multiply 0.12 L by 20 breaths/min.')
              }
            >
              Check calculation
            </Button>
          </ScreenShell>
        )
      }

      case 'caseVignette': {
        const activity = island.activities.find((item) => item.type === 'case')!
        return (
          <ScreenShell title={activity.title} subtitle="Clinical case · SBAR" onBack={back}>
            <Panel className="p-5">
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ['SpO₂', '86%'],
                  ['PIP', '38'],
                  ['Vt', '4 mL/kg'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[var(--radius-chip)] bg-space-950/60 p-2">
                    <span className="block text-lg font-extrabold text-white">{value}</span>
                    <span className="text-[10px] text-hull-400">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-hull-200">
                Oxygenation worsened and peak pressure rose after repositioning. What is your first
                action?
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {[
                  'Assess patient and circuit',
                  'Increase tidal volume',
                  'Silence alarm and leave',
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={interactionValue === option}
                    onClick={() => setInteractionValue(option)}
                    className={`rounded-[var(--radius-button)] border px-3 py-3 text-left text-[13px] ${interactionValue === option ? 'border-ember-400 bg-ember-500/15 text-white' : 'border-space-600 text-hull-200'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <Field label="SBAR recommendation">
                <textarea
                  className={`${inputClass} mt-3 min-h-24 resize-y`}
                  value={interactionNote}
                  onChange={(event) => setInteractionNote(event.target.value)}
                  placeholder="Situation, background, assessment, recommendation"
                />
              </Field>
            </Panel>
            <Button
              disabled={
                interactionValue !== 'Assess patient and circuit' || !interactionNote.trim()
              }
              className="w-full py-3 text-sm"
              onClick={() => completeActivity(activity)}
            >
              Submit handoff
            </Button>
          </ScreenShell>
        )
      }

      case 'quest': {
        const activity = island.activities.find((item) => item.type === 'quest')!
        const attested = interactionNote === 'attested'
        return (
          <ScreenShell title={activity.title} subtitle="Supervised real-world quest" onBack={back}>
            <Panel className="p-5">
              <h2 className="text-base font-extrabold text-white">
                Practice bag-mask ventilation with an RT.
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-hull-200">
                <li>Demonstrate positioning, seal, and a safe ventilation rate.</li>
                <li>Ask for direct feedback.</li>
                <li>Enter the supervisor confirmation code.</li>
              </ol>
              <Field label="Supervisor confirmation">
                <input
                  className={`${inputClass} mt-4`}
                  value={interactionValue}
                  onChange={(event) => setInteractionValue(event.target.value)}
                  placeholder="Enter provided code"
                />
              </Field>
              <button
                type="button"
                role="checkbox"
                aria-checked={attested}
                onClick={() => setInteractionNote(attested ? '' : 'attested')}
                className="mt-4 flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-button)] border border-space-600 px-3 text-left text-[13px] text-hull-200"
              >
                <span
                  className={`grid size-5 place-items-center rounded border ${attested ? 'border-ember-400 bg-ember-500 text-white' : 'border-hull-500'}`}
                >
                  {attested && <CheckIcon className="size-3" />}
                </span>
                I completed this skill with direct supervision.
              </button>
            </Panel>
            <Button
              disabled={!interactionValue.trim() || !attested}
              className="w-full py-3 text-sm"
              onClick={() => completeActivity(activity)}
            >
              Validate quest
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
                <Button onClick={() => go('finalExamIntro')} className="w-full py-3 text-sm">
                  Island cleared — take the final exam
                </Button>
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
        return (
          <ScreenShell
            title={`${island.name} final exam`}
            subtitle="Proctored checkpoint · 3 questions"
            onBack={back}
          >
            <Panel className="p-5">
              <h2 className="mb-2 text-base font-extrabold text-white">Before you begin</h2>
              <ul className="flex flex-col gap-2 text-sm text-hull-200">
                <li className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-ember-400" />
                  {EXAM_QUESTIONS.length} scenario questions drawn from this island.
                </li>
                <li className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-ember-400" />
                  Score at least {PASS_MARK}/{EXAM_QUESTIONS.length} to chart the next island.
                </li>
                <li className="flex gap-2">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-ember-400" />
                  Passing awards +200 PEEP bonus points.
                </li>
              </ul>
            </Panel>
            <Button
              onClick={() => {
                setExamIdx(0)
                setExamAnswers([])
                setExamChoice(null)
                go('finalExamQuestion')
              }}
              className="w-full py-3 text-sm"
            >
              Start exam
            </Button>
          </ScreenShell>
        )

      case 'finalExamQuestion': {
        const q = EXAM_QUESTIONS[examIdx]
        return (
          <ScreenShell
            title="Final exam"
            subtitle={`Question ${examIdx + 1} of ${EXAM_QUESTIONS.length}`}
            onBack={back}
          >
            <ProgressMeter
              label="Exam progress"
              value={Math.round((examIdx / EXAM_QUESTIONS.length) * 100)}
            />
            <Panel className="p-5">
              <h2 className="text-sm font-bold leading-relaxed text-white">{q.prompt}</h2>
              <div className="mt-4 flex flex-col gap-2">
                {q.options.map((opt, i) => {
                  const selected = examChoice === i
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExamChoice(i)}
                      aria-pressed={selected}
                      className={`rounded-[var(--radius-button)] border px-4 py-3 text-left text-[13px] ${
                        selected
                          ? 'border-ember-400 bg-ember-500/15 text-white'
                          : 'border-space-600 bg-space-950/50 text-hull-200 hover:bg-space-700'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </Panel>
            <Button
              disabled={examChoice === null}
              onClick={submitExamAnswer}
              className="w-full py-3 text-sm"
            >
              {examIdx + 1 === EXAM_QUESTIONS.length ? 'Submit exam' : 'Next question'}
            </Button>
          </ScreenShell>
        )
      }

      case 'examResults':
        return (
          <ScreenShell title="Exam results" subtitle={island.name}>
            <Panel className="items-center p-6 text-center">
              <span
                className={`mx-auto mb-3 grid size-16 place-items-center rounded-full ${
                  examPassed
                    ? 'bg-signal-success/15 text-signal-success'
                    : 'bg-signal-danger/15 text-signal-danger'
                }`}
                aria-hidden="true"
              >
                {examPassed ? <CheckIcon className="size-8" /> : <QuizIcon className="size-8" />}
              </span>
              <h1 className="text-xl font-extrabold text-white">
                {examPassed ? 'Island cleared' : 'Not yet, Nurse'}
              </h1>
              <p className="mt-1 text-sm text-hull-300">
                You scored {examScore} of {EXAM_QUESTIONS.length} — {PASS_MARK} needed to pass.
              </p>
              <div className="mx-auto mt-4 flex w-full max-w-56 justify-center gap-2">
                {EXAM_QUESTIONS.map((q, i) => (
                  <span
                    key={q.prompt}
                    className={`grid size-9 place-items-center rounded-[var(--radius-chip)] font-mono text-[11px] font-bold ${
                      examAnswers[i] === q.answer
                        ? 'bg-signal-success/20 text-signal-success'
                        : 'bg-signal-danger/20 text-signal-danger'
                    }`}
                    aria-label={`Question ${i + 1} ${examAnswers[i] === q.answer ? 'correct' : 'incorrect'}`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
            </Panel>
            <div className="flex flex-col gap-2">
              <Button onClick={finishExam} className="w-full py-3 text-sm">
                {examPassed ? 'Claim island & continue' : 'Review island & retry'}
              </Button>
              {!examPassed && (
                <Button
                  variant="secondary"
                  onClick={() => resetTo('dashboard', 'back')}
                  className="w-full"
                >
                  Return to planet map
                </Button>
              )}
            </div>
          </ScreenShell>
        )

      case 'islandComplete':
        return (
          <OutcomeShell>
            <Badge tone="quiz" icon={<MapIcon className="size-3" />}>
              island secured
            </Badge>
            <h1 className="text-3xl font-extrabold leading-tight text-white">
              {island.name}
              <br />
              <span className="text-ember-400">is behind you.</span>
            </h1>
            <p className="max-w-xs text-sm leading-relaxed text-hull-300">
              Exam passed, +200 PEEP banked.{' '}
              {currentIslandIdx + 1 < ISLANDS.length
                ? `${ISLANDS[currentIslandIdx + 1].name} is now charted on the planet map.`
                : 'Every island on Atelecta Prime is cleared.'}
            </p>
            <div className="flex w-full flex-col gap-2">
              {currentIslandIdx + 1 < ISLANDS.length ? (
                <Button
                  onClick={() => {
                    setCurrentIslandIdx((i) => Math.min(ISLANDS.length - 1, i + 1))
                    resetTo('island')
                  }}
                  className="w-full py-3 text-sm"
                >
                  Travel to {ISLANDS[currentIslandIdx + 1].name}
                </Button>
              ) : (
                <Button onClick={() => go('courseComplete')} className="w-full py-3 text-sm">
                  Finish the course
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

      case 'courseComplete':
        return (
          <OutcomeShell>
            <span
              className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-solar-400 to-ember-500 text-space-950 shadow-[var(--shadow-raise-ember)]"
              aria-hidden="true"
            >
              <StarIcon className="size-12" />
            </span>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-ember-300">
                GAMER-ICU graduate
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-white">{displayName}</h1>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-hull-300">
                All six islands cleared. Pediatric IMV competency domains complete — airway, alarms,
                waveforms, gases, advanced modes, and weaning.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge tone="points" icon={<StarIcon className="size-3" />}>
                {points.toLocaleString()} PEEP
              </Badge>
              <Badge tone="streak" icon={<FlameIcon className="size-3" />}>
                {streak}-day streak
              </Badge>
            </div>
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
