import { useState } from 'react'
import { CheckCircle2, AlertCircle, X, BarChart3, FileAudio, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Sidebar from '@/components/Sidebar'
import { cn } from '@/lib/utils'

interface Metrics {
  intro: boolean
  usps: boolean
  simpleLanguage: boolean
  emotionalSensitivity: boolean
  empathy: boolean
  calmTone: boolean
  acknowledgment: boolean
  caringVsTransactional: boolean
  activeListening: boolean
  anxietyReduction: boolean
}

interface AudioSession {
  id: string
  filename: string
  date: string
  metrics: Metrics
}

// Constant audio sessions data
const audioSessions: AudioSession[] = [
  {
    id: '1',
    filename: 'consultation_001.mp3',
    date: '2024-01-15T10:30:00Z',
    metrics: {
      intro: true,
      usps: true,
      simpleLanguage: true,
      emotionalSensitivity: true,
      empathy: true,
      calmTone: true,
      acknowledgment: true,
      caringVsTransactional: true,
      activeListening: false,
      anxietyReduction: true,
    },
  },
  {
    id: '2',
    filename: 'consultation_002.mp3',
    date: '2024-01-16T14:20:00Z',
    metrics: {
      intro: true,
      usps: false,
      simpleLanguage: true,
      emotionalSensitivity: false,
      empathy: true,
      calmTone: true,
      acknowledgment: true,
      caringVsTransactional: false,
      activeListening: true,
      anxietyReduction: false,
    },
  },
  {
    id: '3',
    filename: 'consultation_003.mp3',
    date: '2024-01-17T09:15:00Z',
    metrics: {
      intro: true,
      usps: true,
      simpleLanguage: true,
      emotionalSensitivity: true,
      empathy: true,
      calmTone: true,
      acknowledgment: true,
      caringVsTransactional: true,
      activeListening: true,
      anxietyReduction: true,
    },
  },
  {
    id: '4',
    filename: 'consultation_004.mp3',
    date: '2024-01-18T11:45:00Z',
    metrics: {
      intro: true,
      usps: true,
      simpleLanguage: false,
      emotionalSensitivity: true,
      empathy: false,
      calmTone: true,
      acknowledgment: true,
      caringVsTransactional: true,
      activeListening: true,
      anxietyReduction: true,
    },
  },
  {
    id: '5',
    filename: 'consultation_005.mp3',
    date: '2024-01-19T16:00:00Z',
    metrics: {
      intro: true,
      usps: true,
      simpleLanguage: true,
      emotionalSensitivity: true,
      empathy: true,
      calmTone: false,
      acknowledgment: true,
      caringVsTransactional: true,
      activeListening: true,
      anxietyReduction: true,
    },
  },
]

const metricLabels = [
  { key: 'intro', label: 'Staff Introduction' },
  { key: 'usps', label: 'Brand USPs/Achievements' },
  { key: 'simpleLanguage', label: 'Simple Language' },
  { key: 'emotionalSensitivity', label: 'Emotional Sensitivity' },
  { key: 'empathy', label: 'Empathy & Reassurance' },
  { key: 'calmTone', label: 'Calm/Non-rushed Tone' },
  { key: 'acknowledgment', label: 'Emotional Nature Acknowledgment' },
  { key: 'caringVsTransactional', label: 'Caring vs Transactional' },
  { key: 'activeListening', label: 'Active Listening' },
  { key: 'anxietyReduction', label: 'Anxiety Reduction' },
] as const

export default function ConsultationQualityDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Calculate statistics for each metric across all consultations
  const calculateMetricStats = () => {
    const totalConsultations = audioSessions.length
    return metricLabels.map((metric) => {
      const passedCount = audioSessions.filter(
        (session) => session.metrics[metric.key as keyof Metrics]
      ).length
      const percentage = Math.round((passedCount / totalConsultations) * 100)
      return {
        ...metric,
        passedCount,
        totalCount: totalConsultations,
        percentage,
      }
    })
  }

  const metricStats = calculateMetricStats()

  const calculateQualityScore = (metrics: Metrics): number => {
    const totalMetrics = Object.keys(metrics).length
    const passedMetrics = Object.values(metrics).filter(Boolean).length
    return Math.round((passedMetrics / totalMetrics) * 100)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 70) return 'text-indigo-600 dark:text-indigo-400'
    if (score >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-emerald-500'
    if (score >= 70) return 'bg-indigo-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getMetricIcon = (percentage: number) => {
    if (percentage >= 80) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    }
    return <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header with Metrics Summary Button */}
            <div className="mb-6 flex items-center justify-between">
              <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Consultation Quality Dashboard
              </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor and analyze consultation quality metrics
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 rounded-md text-sm font-medium shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
              >
                <BarChart3 className="h-4 w-4 text-white" />
                <span className="text-black font-medium">Metrics Summary</span>
              </button>
            </div>

            {/* Summary Stats - Moved to Top */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                  <FileAudio className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {audioSessions.length}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Audio sessions analyzed
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Quality Score</CardTitle>
                  <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(
                      audioSessions.reduce(
                        (sum, session) => sum + calculateQualityScore(session.metrics),
                        0
                      ) / audioSessions.length
                    )}
                    %
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Across all consultations
                  </p>
                </CardContent>
              </Card>
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Metrics Tracked</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {metricLabels.length}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Quality indicators
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
              {metricStats.map((stat) => (
                <Card
                  key={stat.key}
                  className="hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {stat.label}
                    </CardTitle>
                    {getMetricIcon(stat.percentage)}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                          {stat.passedCount}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          out of {stat.totalCount}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all duration-300',
                            getScoreBgColor(stat.percentage)
                          )}
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <p className={cn('text-xs font-medium', getScoreColor(stat.percentage))}>
                        {stat.percentage}% pass rate
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Metrics Summary Drawer */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/50 dark:bg-slate-900/70 z-40 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <div
            className={cn(
              'fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out',
              isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Metrics Summary
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {audioSessions.length} consultation{audioSessions.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close metrics summary"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-purple-400 text-purple-500 hover:bg-purple-50 dark:border-purple-500 dark:text-purple-300 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {audioSessions.map((session) => {
                    const score = calculateQualityScore(session.metrics)
                    const passedCount = Object.values(session.metrics).filter(
                      Boolean
                    ).length
                    const totalCount = Object.keys(session.metrics).length

                    return (
                      <Card
                        key={session.id}
                        className="border-slate-200 dark:border-slate-700"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold flex items-center gap-2 mb-1">
                                <FileAudio className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <span className="truncate">
                                  {session.filename}
                                </span>
                              </CardTitle>
                              <CardDescription className="text-xs flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(session.date)}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          {/* Score Display */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                Quality Score
                              </span>
                              <span
                                className={cn(
                                  'text-sm font-bold',
                                  getScoreColor(score)
                                )}
                              >
                                {score}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                              <div
                                className={cn(
                                  'h-2 rounded-full transition-all duration-300',
                                  getScoreBgColor(score)
                                )}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {passedCount} of {totalCount} KPIs met
                            </p>
                          </div>

                          {/* Quick KPI Status */}
                          <div className="grid grid-cols-2 gap-2">
                            {metricLabels.slice(0, 6).map((metric) => {
                              const passed =
                                session.metrics[metric.key as keyof Metrics]
                              return (
                                <div
                                  key={metric.key}
                                  className="flex items-center gap-1.5 text-xs"
                                >
                                  {passed ? (
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  ) : (
                                    <AlertCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                  )}
                                  <span className="truncate text-slate-600 dark:text-slate-400">
                                    {metric.label.split(' ')[0]}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
