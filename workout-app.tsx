"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  RefreshCw,
  Dumbbell,
  Target,
  Check,
  Play,
  Zap,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
} from "lucide-react"

interface Exercise {
  id: string
  name: string
  category: string
  sets: number
  reps: string
  rest: string
  difficulty: "初級" | "中級" | "上級"
  equipment: string
  isCustom?: boolean
}

interface WorkoutSet {
  reps: number
  weight: number
  completed: boolean
}

interface WorkoutExercise {
  exercise: Exercise
  sets: WorkoutSet[]
  currentSet: number
}

interface WorkoutSession {
  id: string
  date: string
  exercises: WorkoutExercise[]
  duration: number
  completed: boolean
}

const defaultExercises: Exercise[] = [
  // 胸筋
  {
    id: "1",
    name: "腕立て伏せ",
    category: "胸筋",
    sets: 3,
    reps: "10-15回",
    rest: "60秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    id: "2",
    name: "ベンチプレス",
    category: "胸筋",
    sets: 4,
    reps: "8-12回",
    rest: "90秒",
    difficulty: "中級",
    equipment: "バーベル",
  },
  {
    id: "3",
    name: "ダンベルフライ",
    category: "胸筋",
    sets: 3,
    reps: "12-15回",
    rest: "60秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    id: "4",
    name: "インクラインプッシュアップ",
    category: "胸筋",
    sets: 3,
    reps: "12-20回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "自重",
  },

  // 背筋
  {
    id: "5",
    name: "懸垂",
    category: "背筋",
    sets: 3,
    reps: "5-10回",
    rest: "90秒",
    difficulty: "上級",
    equipment: "懸垂バー",
  },
  {
    id: "6",
    name: "ラットプルダウン",
    category: "背筋",
    sets: 4,
    reps: "10-12回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "マシン",
  },
  {
    id: "7",
    name: "ベントオーバーロー",
    category: "背筋",
    sets: 4,
    reps: "8-12回",
    rest: "90秒",
    difficulty: "中級",
    equipment: "バーベル",
  },
  {
    id: "8",
    name: "シーテッドロー",
    category: "背筋",
    sets: 3,
    reps: "12-15回",
    rest: "60秒",
    difficulty: "初級",
    equipment: "マシン",
  },

  // 脚
  {
    id: "9",
    name: "スクワット",
    category: "脚",
    sets: 4,
    reps: "12-20回",
    rest: "90秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    id: "10",
    name: "ランジ",
    category: "脚",
    sets: 3,
    reps: "10-15回/脚",
    rest: "60秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    id: "11",
    name: "デッドリフト",
    category: "脚",
    sets: 4,
    reps: "6-10回",
    rest: "120秒",
    difficulty: "上級",
    equipment: "バーベル",
  },
  {
    id: "12",
    name: "レッグプレス",
    category: "脚",
    sets: 4,
    reps: "15-20回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "マシン",
  },
  {
    id: "13",
    name: "カーフレイズ",
    category: "脚",
    sets: 3,
    reps: "15-25回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "自重",
  },

  // 肩
  {
    id: "14",
    name: "ショルダープレス",
    category: "肩",
    sets: 3,
    reps: "10-12回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    id: "15",
    name: "サイドレイズ",
    category: "肩",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    id: "16",
    name: "フロントレイズ",
    category: "肩",
    sets: 3,
    reps: "10-12回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    id: "17",
    name: "リアデルトフライ",
    category: "肩",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },

  // 腕
  {
    id: "18",
    name: "バイセップカール",
    category: "腕",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    id: "19",
    name: "トライセップエクステンション",
    category: "腕",
    sets: 3,
    reps: "10-12回",
    rest: "60秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    id: "20",
    name: "ハンマーカール",
    category: "腕",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    id: "21",
    name: "ディップス",
    category: "腕",
    sets: 3,
    reps: "8-15回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "自重",
  },

  // 腹筋
  {
    id: "22",
    name: "プランク",
    category: "腹筋",
    sets: 3,
    reps: "30-60秒",
    rest: "45秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    id: "23",
    name: "クランチ",
    category: "腹筋",
    sets: 3,
    reps: "15-25回",
    rest: "30秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    id: "24",
    name: "レッグレイズ",
    category: "腹筋",
    sets: 3,
    reps: "10-15回",
    rest: "45秒",
    difficulty: "中級",
    equipment: "自重",
  },
  {
    id: "25",
    name: "バイシクルクランチ",
    category: "腹筋",
    sets: 3,
    reps: "20-30回",
    rest: "45秒",
    difficulty: "中級",
    equipment: "自重",
  },
  {
    id: "26",
    name: "マウンテンクライマー",
    category: "腹筋",
    sets: 3,
    reps: "20-30回",
    rest: "60秒",
    difficulty: "中級",
    equipment: "自重",
  },
]

const categoryColors = {
  胸筋: "bg-red-600 text-white",
  背筋: "bg-blue-600 text-white",
  脚: "bg-green-600 text-white",
  肩: "bg-yellow-600 text-black",
  腕: "bg-purple-600 text-white",
  腹筋: "bg-orange-600 text-white",
}

const difficultyColors = {
  初級: "bg-green-600 text-white",
  中級: "bg-yellow-600 text-black",
  上級: "bg-red-600 text-white",
}

export default function WorkoutApp() {
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null)
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSession[]>([])
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>(defaultExercises)

  // WORKOUT GENERATOR states
  const [generatedWorkout, setGeneratedWorkout] = useState<Exercise[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [focusArea, setFocusArea] = useState<string>("全身バランス")

  // Calendar states
  const [calendarView, setCalendarView] = useState<"week" | "month">("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Exercise management states
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    category: "胸筋",
    sets: 3,
    reps: "",
    rest: "",
    difficulty: "初級" as "初級" | "中級" | "上級",
    equipment: "",
  })

  // Load data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory))
    }

    const savedExercises = localStorage.getItem("customExercises")
    if (savedExercises) {
      const customExercises = JSON.parse(savedExercises)
      setExercises([...defaultExercises, ...customExercises])
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (workoutHistory.length > 0) {
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory))
    }
  }, [workoutHistory])

  useEffect(() => {
    const customExercises = exercises.filter((ex) => ex.isCustom)
    if (customExercises.length > 0) {
      localStorage.setItem("customExercises", JSON.stringify(customExercises))
    }
  }, [exercises])

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => prev - 1)
      }, 1000)
    } else if (restTimer === 0) {
      setIsResting(false)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  const startWorkout = (workoutExercises?: Exercise[]) => {
    const exercisesToUse = workoutExercises || []
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      exercises: exercisesToUse.map((exercise) => ({
        exercise,
        sets: Array(exercise.sets)
          .fill(null)
          .map(() => ({
            reps: 0,
            weight: 0,
            completed: false,
          })),
        currentSet: 0,
      })),
      duration: 0,
      completed: false,
    }
    setCurrentSession(session)
    setSessionStartTime(new Date())
  }

  const addExerciseToSession = (exercise: Exercise) => {
    if (!currentSession) return

    const newExercise: WorkoutExercise = {
      exercise,
      sets: Array(exercise.sets)
        .fill(null)
        .map(() => ({
          reps: 0,
          weight: 0,
          completed: false,
        })),
      currentSet: 0,
    }

    setCurrentSession({
      ...currentSession,
      exercises: [...currentSession.exercises, newExercise],
    })
  }

  const completeSet = (exerciseIndex: number, setIndex: number, reps: number, weight: number) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession }
    updatedSession.exercises[exerciseIndex].sets[setIndex] = {
      reps,
      weight,
      completed: true,
    }

    if (setIndex < updatedSession.exercises[exerciseIndex].sets.length - 1) {
      updatedSession.exercises[exerciseIndex].currentSet = setIndex + 1
    }

    setCurrentSession(updatedSession)

    const restTime = Number.parseInt(updatedSession.exercises[exerciseIndex].exercise.rest)
    setRestTimer(restTime)
    setIsResting(true)
  }

  const finishWorkout = () => {
    if (!currentSession || !sessionStartTime) return

    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60)
    const completedSession = {
      ...currentSession,
      duration,
      completed: true,
    }

    setWorkoutHistory((prev) => [completedSession, ...prev])
    setCurrentSession(null)
    setSessionStartTime(null)
    setIsResting(false)
    setRestTimer(0)
  }

  const generateWorkout = () => {
    setIsGenerating(true)

    const newWorkout: Exercise[] = []

    if (focusArea === "全身バランス") {
      const categories = ["胸筋", "背筋", "脚", "肩", "腕", "腹筋"]
      categories.forEach((category) => {
        const categoryExercises = exercises.filter((ex) => ex.category === category)
        if (categoryExercises.length > 0) {
          const randomExercise = categoryExercises[Math.floor(Math.random() * categoryExercises.length)]
          newWorkout.push(randomExercise)
        }
      })
    } else {
      const focusExercises = exercises.filter((ex) => ex.category === focusArea)
      const shuffledFocus = [...focusExercises].sort(() => Math.random() - 0.5)
      const selectedCount = Math.min(6, focusExercises.length)
      newWorkout.push(...shuffledFocus.slice(0, selectedCount))
    }

    for (let i = newWorkout.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newWorkout[i], newWorkout[j]] = [newWorkout[j], newWorkout[i]]
    }

    setTimeout(() => {
      setGeneratedWorkout(newWorkout)
      setIsGenerating(false)
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const deleteWorkoutSession = (sessionId: string) => {
    setWorkoutHistory((prev) => prev.filter((session) => session.id !== sessionId))
  }

  const clearAllHistory = () => {
    setWorkoutHistory([])
    localStorage.removeItem("workoutHistory")
  }

  const removeExerciseFromSession = (exerciseIndex: number) => {
    if (!currentSession) return

    const updatedSession = { ...currentSession }
    updatedSession.exercises.splice(exerciseIndex, 1)
    setCurrentSession(updatedSession)
  }

  // Exercise management functions
  const resetExerciseForm = () => {
    setExerciseForm({
      name: "",
      category: "胸筋",
      sets: 3,
      reps: "",
      rest: "",
      difficulty: "初級",
      equipment: "",
    })
  }

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim()) return

    const newExercise: Exercise = {
      id: Date.now().toString(),
      ...exerciseForm,
      isCustom: true,
    }

    setExercises((prev) => [...prev, newExercise])
    setIsAddExerciseOpen(false)
    resetExerciseForm()
  }

  const handleEditExercise = () => {
    if (!editingExercise || !exerciseForm.name.trim()) return

    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === editingExercise.id
          ? {
              ...ex,
              ...exerciseForm,
            }
          : ex,
      ),
    )

    setEditingExercise(null)
    resetExerciseForm()
  }

  const handleDeleteExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId))
  }

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise(exercise)
    setExerciseForm({
      name: exercise.name,
      category: exercise.category,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.rest,
      difficulty: exercise.difficulty,
      equipment: exercise.equipment,
    })
  }

  // Calendar helper functions
  const getWorkoutDates = () => {
    return workoutHistory.map((session) => new Date(session.date))
  }

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)

    const startDay = startDate.getDay()
    const startDiff = startDate.getDate() - startDay + (startDay === 0 ? -6 : 1)
    startDate.setDate(startDiff)

    const endDay = endDate.getDay()
    const endDiff = endDate.getDate() + (endDay === 0 ? 0 : 7 - endDay)
    endDate.setDate(endDiff)

    const dates = []
    const current = new Date(startDate)
    while (current <= endDate) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  const hasWorkoutOnDate = (date: Date) => {
    return workoutHistory.some((session) => {
      const sessionDate = new Date(session.date)
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      )
    })
  }

  const getWorkoutCountOnDate = (date: Date) => {
    return workoutHistory.filter((session) => {
      const sessionDate = new Date(session.date)
      return (
        sessionDate.getFullYear() === date.getFullYear() &&
        sessionDate.getMonth() === date.getMonth() &&
        sessionDate.getDate() === date.getDate()
      )
    }).length
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-2 sm:p-4 text-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="text-2xl sm:text-4xl">💪</div>
            <h1 className="text-2xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
              MUSCLE TRACKER
            </h1>
            <div className="text-2xl sm:text-4xl">🔥</div>
          </div>
          <p className="text-sm sm:text-xl text-gray-300 font-semibold px-2">
            限界を記録し、成長を実感せよ！最強のトレーニング記録アプリ
          </p>
        </div>

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-8 bg-gray-800 border border-gray-600 h-auto">
            <TabsTrigger
              value="workout"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-red-600 p-2 sm:p-3"
            >
              🏋️ <span className="hidden sm:inline">ワークアウト</span>
            </TabsTrigger>
            <TabsTrigger
              value="generator"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-orange-600 p-2 sm:p-3"
            >
              ⚡ <span className="hidden sm:inline">ジェネレーター</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-blue-600 p-2 sm:p-3"
            >
              📊 <span className="hidden sm:inline">履歴</span>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-green-600 p-2 sm:p-3"
            >
              📈 <span className="hidden sm:inline">統計</span>
            </TabsTrigger>
          </TabsList>

          {/* ワークアウト記録タブ */}
          <TabsContent value="workout">
            {!currentSession ? (
              <div className="text-center py-8 sm:py-16">
                <div className="text-4xl sm:text-8xl mb-4 sm:mb-6">🏋️</div>
                <h2 className="text-xl sm:text-3xl font-black mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  今日も限界を超えろ！
                </h2>
                <div className="space-y-3 sm:space-y-4 px-2">
                  <Button
                    onClick={() => startWorkout()}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 sm:hover:scale-110"
                  >
                    <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    フリーワークアウト開始
                  </Button>
                  {generatedWorkout.length > 0 && (
                    <Button
                      onClick={() => startWorkout(generatedWorkout)}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 sm:hover:scale-110"
                    >
                      <Target className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                      生成メニューで開始
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Rest Timer */}
                {isResting && (
                  <Card className="bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="text-xl sm:text-2xl font-black text-red-400 mb-2">🔥 REST TIME</h3>
                      <div className="text-4xl sm:text-6xl font-black text-white mb-4">{formatTime(restTimer)}</div>
                      <Button
                        onClick={() => {
                          setIsResting(false)
                          setRestTimer(0)
                        }}
                        className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                      >
                        休憩終了
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Current Workout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                    💪 現在のワークアウト
                  </h2>
                  <Button
                    onClick={finishWorkout}
                    className="bg-green-600 hover:bg-green-700 font-bold w-full sm:w-auto"
                  >
                    <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    ワークアウト完了
                  </Button>
                </div>

                {/* Add Exercise - 部位別表示 */}
                <Card className="bg-gray-800 border border-gray-600">
                  <CardHeader className="p-3 sm:p-6">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white font-black text-lg sm:text-xl">💪 種目を追加</CardTitle>
                      <Dialog
                        open={isAddExerciseOpen}
                        onOpenChange={(open) => {
                          setIsAddExerciseOpen(open)
                          if (open) {
                            resetExerciseForm()
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">新規追加</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md mx-2 sm:mx-auto">
                          <DialogHeader>
                            <DialogTitle className="text-white">新しい種目を追加</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">種目名</Label>
                              <Input
                                id="name"
                                value={exerciseForm.name}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">部位</Label>
                              <Select
                                value={exerciseForm.category}
                                onValueChange={(value) => setExerciseForm({ ...exerciseForm, category: value })}
                              >
                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600">
                                  {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((cat) => (
                                    <SelectItem key={cat} value={cat} className="text-white">
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="sets">セット数</Label>
                                <Input
                                  id="sets"
                                  type="number"
                                  value={exerciseForm.sets}
                                  onChange={(e) =>
                                    setExerciseForm({ ...exerciseForm, sets: Number.parseInt(e.target.value) || 1 })
                                  }
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reps">回数</Label>
                                <Input
                                  id="reps"
                                  value={exerciseForm.reps}
                                  onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                                  placeholder="10-15回"
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="rest">休憩時間</Label>
                                <Input
                                  id="rest"
                                  value={exerciseForm.rest}
                                  onChange={(e) => setExerciseForm({ ...exerciseForm, rest: e.target.value })}
                                  placeholder="60秒"
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div>
                                <Label htmlFor="difficulty">難易度</Label>
                                <Select
                                  value={exerciseForm.difficulty}
                                  onValueChange={(value: "初級" | "中級" | "上級") =>
                                    setExerciseForm({ ...exerciseForm, difficulty: value })
                                  }
                                >
                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-gray-700 border-gray-600">
                                    {["初級", "中級", "上級"].map((diff) => (
                                      <SelectItem key={diff} value={diff} className="text-white">
                                        {diff}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="equipment">器具</Label>
                              <Input
                                id="equipment"
                                value={exerciseForm.equipment}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, equipment: e.target.value })}
                                placeholder="ダンベル"
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <Button onClick={handleAddExercise} className="w-full bg-green-600 hover:bg-green-700">
                              追加
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <Tabs defaultValue="胸筋" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 bg-gray-700 h-auto">
                        {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((category) => (
                          <TabsTrigger
                            key={category}
                            value={category}
                            className="font-bold text-xs sm:text-sm data-[state=active]:bg-red-600 p-1 sm:p-2"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((category) => (
                        <TabsContent key={category} value={category}>
                          <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            {exercises
                              .filter((exercise) => exercise.category === category)
                              .map((exercise, index) => (
                                <div key={exercise.id} className="relative">
                                  <Button
                                    onClick={() => addExerciseToSession(exercise)}
                                    variant="outline"
                                    className="text-left p-3 sm:p-4 h-auto border-gray-600 hover:bg-gray-700 hover:border-red-500 transition-all duration-300 w-full"
                                  >
                                    <div className="w-full">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-red-400 text-sm sm:text-lg">{exercise.name}</div>
                                        <div className="flex gap-1 sm:gap-2">
                                          <Badge
                                            className={difficultyColors[exercise.difficulty] + " font-bold text-xs"}
                                          >
                                            {exercise.difficulty}
                                          </Badge>
                                          {exercise.isCustom && (
                                            <Badge className="bg-purple-600 text-white font-bold text-xs">
                                              カスタム
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-xs sm:text-sm text-gray-300 space-y-1">
                                        <div>🏋️ {exercise.equipment}</div>
                                        <div>
                                          📊 {exercise.sets}セット × {exercise.reps}
                                        </div>
                                        <div>⏱️ 休憩: {exercise.rest}</div>
                                      </div>
                                    </div>
                                  </Button>
                                  {exercise.isCustom && (
                                    <div className="absolute top-2 right-2 flex gap-1">
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 w-6 p-0 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white bg-transparent"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              openEditDialog(exercise)
                                            }}
                                          >
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-md mx-2 sm:mx-auto">
                                          <DialogHeader>
                                            <DialogTitle className="text-white">種目を編集</DialogTitle>
                                          </DialogHeader>
                                          <div className="space-y-4">
                                            <div>
                                              <Label htmlFor="edit-name">種目名</Label>
                                              <Input
                                                id="edit-name"
                                                value={exerciseForm.name}
                                                onChange={(e) =>
                                                  setExerciseForm({ ...exerciseForm, name: e.target.value })
                                                }
                                                className="bg-gray-700 border-gray-600 text-white"
                                              />
                                            </div>
                                            <div>
                                              <Label htmlFor="edit-category">部位</Label>
                                              <Select
                                                value={exerciseForm.category}
                                                onValueChange={(value) =>
                                                  setExerciseForm({ ...exerciseForm, category: value })
                                                }
                                              >
                                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                  {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((cat) => (
                                                    <SelectItem key={cat} value={cat} className="text-white">
                                                      {cat}
                                                    </SelectItem>
                                                  ))}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <Label htmlFor="edit-sets">セット数</Label>
                                                <Input
                                                  id="edit-sets"
                                                  type="number"
                                                  value={exerciseForm.sets}
                                                  onChange={(e) =>
                                                    setExerciseForm({
                                                      ...exerciseForm,
                                                      sets: Number.parseInt(e.target.value) || 1,
                                                    })
                                                  }
                                                  className="bg-gray-700 border-gray-600 text-white"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-reps">回数</Label>
                                                <Input
                                                  id="edit-reps"
                                                  value={exerciseForm.reps}
                                                  onChange={(e) =>
                                                    setExerciseForm({ ...exerciseForm, reps: e.target.value })
                                                  }
                                                  className="bg-gray-700 border-gray-600 text-white"
                                                />
                                              </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                              <div>
                                                <Label htmlFor="edit-rest">休憩時間</Label>
                                                <Input
                                                  id="edit-rest"
                                                  value={exerciseForm.rest}
                                                  onChange={(e) =>
                                                    setExerciseForm({ ...exerciseForm, rest: e.target.value })
                                                  }
                                                  className="bg-gray-700 border-gray-600 text-white"
                                                />
                                              </div>
                                              <div>
                                                <Label htmlFor="edit-difficulty">難易度</Label>
                                                <Select
                                                  value={exerciseForm.difficulty}
                                                  onValueChange={(value: "初級" | "中級" | "上級") =>
                                                    setExerciseForm({ ...exerciseForm, difficulty: value })
                                                  }
                                                >
                                                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                                    <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent className="bg-gray-700 border-gray-600">
                                                    {["初級", "中級", "上級"].map((diff) => (
                                                      <SelectItem key={diff} value={diff} className="text-white">
                                                        {diff}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                            </div>
                                            <div>
                                              <Label htmlFor="edit-equipment">器具</Label>
                                              <Input
                                                id="edit-equipment"
                                                value={exerciseForm.equipment}
                                                onChange={(e) =>
                                                  setExerciseForm({ ...exerciseForm, equipment: e.target.value })
                                                }
                                                className="bg-gray-700 border-gray-600 text-white"
                                              />
                                            </div>
                                            <Button
                                              onClick={handleEditExercise}
                                              className="w-full bg-blue-600 hover:bg-blue-700"
                                            >
                                              更新
                                            </Button>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDeleteExercise(exercise.id)
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Exercise List */}
                <div className="space-y-3 sm:space-y-4">
                  {currentSession.exercises.map((workoutExercise, exerciseIndex) => (
                    <Card key={exerciseIndex} className="bg-gray-800 border border-gray-600">
                      <CardHeader className="p-3 sm:p-6">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-white font-black text-sm sm:text-lg">
                            {workoutExercise.exercise.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Badge
                              className={
                                categoryColors[workoutExercise.exercise.category as keyof typeof categoryColors] +
                                " font-bold text-xs"
                              }
                            >
                              {workoutExercise.exercise.category}
                            </Badge>
                            <Button
                              onClick={() => removeExerciseFromSession(exerciseIndex)}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-6 w-6 p-0"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0">
                        <div className="space-y-2 sm:space-y-3">
                          {workoutExercise.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className={`p-3 sm:p-4 rounded-lg border-2 ${
                                set.completed
                                  ? "bg-green-900/30 border-green-500"
                                  : setIndex === workoutExercise.currentSet
                                    ? "bg-red-900/30 border-red-500"
                                    : "bg-gray-700 border-gray-600"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <span className="font-bold text-white text-sm sm:text-base">セット {setIndex + 1}</span>
                                {set.completed ? (
                                  <div className="text-green-400 font-bold text-sm sm:text-base">
                                    ✅ {set.reps}回 × {set.weight}kg
                                  </div>
                                ) : setIndex === workoutExercise.currentSet ? (
                                  <div className="flex gap-2 w-full sm:w-auto">
                                    <Input
                                      type="number"
                                      placeholder="回数"
                                      className="w-16 sm:w-20 bg-gray-800 border-gray-600 text-white text-sm"
                                      id={`reps-${exerciseIndex}-${setIndex}`}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="重量"
                                      className="w-16 sm:w-20 bg-gray-800 border-gray-600 text-white text-sm"
                                      id={`weight-${exerciseIndex}-${setIndex}`}
                                    />
                                    <Button
                                      onClick={() => {
                                        const repsInput = document.getElementById(
                                          `reps-${exerciseIndex}-${setIndex}`,
                                        ) as HTMLInputElement
                                        const weightInput = document.getElementById(
                                          `weight-${exerciseIndex}-${setIndex}`,
                                        ) as HTMLInputElement
                                        const reps = Number.parseInt(repsInput.value) || 0
                                        const weight = Number.parseFloat(weightInput.value) || 0
                                        completeSet(exerciseIndex, setIndex, reps, weight)
                                      }}
                                      className="bg-red-600 hover:bg-red-700 px-2 sm:px-3"
                                      size="sm"
                                    >
                                      <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-sm">待機中</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ワークアウトジェネレータータブ */}
          <TabsContent value="generator">
            <div className="space-y-4 sm:space-y-8">
              <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-2xl">
                <h3 className="text-lg sm:text-2xl font-black text-center mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                  🎯 TARGET MUSCLE
                </h3>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-3">
                  {["全身バランス", "胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((area) => (
                    <Button
                      key={area}
                      variant={focusArea === area ? "default" : "outline"}
                      onClick={() => setFocusArea(area)}
                      className={`font-bold text-xs sm:text-lg px-3 sm:px-6 py-2 sm:py-3 transition-all duration-300 ${
                        focusArea === area
                          ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-lg transform scale-105"
                          : "border-2 border-gray-500 text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-orange-600 hover:text-white hover:border-transparent hover:scale-105"
                      }`}
                    >
                      {area === "全身バランス" ? "💥 " + area : area}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-center mb-4 sm:mb-8">
                <Button
                  onClick={generateWorkout}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 sm:hover:scale-110 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />🔥 GENERATING...
                    </>
                  ) : (
                    <>
                      <Dumbbell className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />💪 {focusArea}で限界突破！
                    </>
                  )}
                </Button>
              </div>

              {generatedWorkout.length > 0 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl border border-red-500/30 shadow-xl">
                    <h3 className="font-black text-lg sm:text-xl text-red-400 mb-3 flex items-center gap-2">
                      🔥 {focusArea}メニュー
                    </h3>
                    <p className="text-gray-300 font-medium mb-4 text-sm sm:text-base">
                      {focusArea === "全身バランス"
                        ? "💥 全身を完全燃焼！各部位から最強の種目を厳選したバランス型メニューだ！"
                        : `🎯 ${focusArea}を徹底的に追い込む！メイン部位を限界まで鍛え上げる最強メニューだ！`}
                    </p>
                    <Button
                      onClick={() => startWorkout(generatedWorkout)}
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-bold"
                    >
                      <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      このメニューでワークアウト開始
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedWorkout.map((exercise, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 hover:border-red-500 hover:scale-105"
                      >
                        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg sm:text-xl font-black text-white">{exercise.name}</CardTitle>
                            <Badge
                              className={
                                categoryColors[exercise.category as keyof typeof categoryColors] + " font-bold text-xs"
                              }
                            >
                              {exercise.category}
                            </Badge>
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <Badge
                              variant="outline"
                              className={difficultyColors[exercise.difficulty] + " font-bold border-2 text-xs"}
                            >
                              {exercise.difficulty}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-2 border-gray-500 text-gray-300 font-bold text-xs"
                            >
                              {exercise.equipment}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 p-3 sm:p-6">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-semibold text-sm">セット数:</span>
                              <span className="font-black text-white text-sm">{exercise.sets}セット</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-semibold text-sm">回数:</span>
                              <span className="font-black text-white text-sm">{exercise.reps}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-semibold text-sm">休憩:</span>
                              <span className="font-black text-white text-sm">{exercise.rest}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* 履歴タブ */}
          <TabsContent value="history">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  📊 ワークアウト履歴
                </h2>
                {workoutHistory.length > 0 && (
                  <Button
                    onClick={clearAllHistory}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold bg-transparent w-full sm:w-auto"
                  >
                    🗑️ 全履歴削除
                  </Button>
                )}
              </div>

              {workoutHistory.length === 0 ? (
                <div className="text-center py-8 sm:py-16">
                  <div className="text-4xl sm:text-8xl mb-4 sm:mb-6">📊</div>
                  <p className="text-gray-400 text-lg sm:text-2xl font-bold">まだ記録がありません</p>
                  <p className="text-gray-500 text-sm sm:text-lg">ワークアウトを開始して記録を作りましょう！</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {workoutHistory.map((session) => (
                    <Card key={session.id} className="bg-gray-800 border border-gray-600">
                      <CardHeader className="p-3 sm:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <CardTitle className="text-white font-black text-sm sm:text-lg">
                            {new Date(session.date).toLocaleDateString("ja-JP")}{" "}
                            {new Date(session.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-blue-600 text-white font-bold text-xs">{session.duration}分</Badge>
                            <Badge className="bg-green-600 text-white font-bold text-xs">
                              {session.exercises.length}種目
                            </Badge>
                            <Button
                              onClick={() => deleteWorkoutSession(session.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-6 w-6 p-0"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0">
                        <div className="space-y-2">
                          {session.exercises.map((workoutExercise, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-3 bg-gray-700 rounded gap-2"
                            >
                              <div>
                                <span className="text-white font-semibold text-sm sm:text-base">
                                  {workoutExercise.exercise.name}
                                </span>
                                <span className="text-gray-400 ml-2 text-xs sm:text-sm">
                                  ({workoutExercise.exercise.category})
                                </span>
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="text-gray-300 font-bold text-xs sm:text-sm">
                                  {workoutExercise.sets.filter((set) => set.completed).length}/
                                  {workoutExercise.sets.length}セット完了
                                </div>
                                <div className="text-xs text-gray-400">
                                  {workoutExercise.sets
                                    .filter((set) => set.completed)
                                    .map((set, i) => `${set.reps}×${set.weight}kg`)
                                    .join(", ")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* 統計タブ */}
          <TabsContent value="stats">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                📈 トレーニング統計
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-500/30">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-4xl mb-2">🔥</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mb-2">{workoutHistory.length}</div>
                    <div className="text-red-400 font-bold text-sm sm:text-base">総ワークアウト数</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-4xl mb-2">⏱️</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mb-2">
                      {workoutHistory.reduce((total, session) => total + session.duration, 0)}
                    </div>
                    <div className="text-blue-400 font-bold text-sm sm:text-base">総トレーニング時間（分）</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30">
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-4xl mb-2">💪</div>
                    <div className="text-2xl sm:text-3xl font-black text-white mb-2">
                      {workoutHistory.reduce(
                        (total, session) =>
                          total +
                          session.exercises.reduce(
                            (exerciseTotal, exercise) =>
                              exerciseTotal + exercise.sets.filter((set) => set.completed).length,
                            0,
                          ),
                        0,
                      )}
                    </div>
                    <div className="text-green-400 font-bold text-sm sm:text-base">総完了セット数</div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar View */}
              <Card className="bg-gray-800 border border-gray-600">
                <CardHeader className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <CardTitle className="text-white font-black text-lg sm:text-xl">
                      📅 ワークアウトカレンダー
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => setCalendarView("week")}
                        variant={calendarView === "week" ? "default" : "outline"}
                        className={`flex-1 sm:flex-none ${calendarView === "week" ? "bg-red-600 hover:bg-red-700" : ""}`}
                        size="sm"
                      >
                        週表示
                      </Button>
                      <Button
                        onClick={() => setCalendarView("month")}
                        variant={calendarView === "month" ? "default" : "outline"}
                        className={`flex-1 sm:flex-none ${calendarView === "month" ? "bg-red-600 hover:bg-red-700" : ""}`}
                        size="sm"
                      >
                        月表示
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="mb-4 flex justify-between items-center">
                    <Button
                      onClick={() => {
                        const newDate = new Date(currentDate)
                        if (calendarView === "week") {
                          newDate.setDate(newDate.getDate() - 7)
                        } else {
                          newDate.setMonth(newDate.getMonth() - 1)
                        }
                        setCurrentDate(newDate)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <h3 className="text-lg sm:text-xl font-bold text-white text-center">
                      {calendarView === "month"
                        ? `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`
                        : `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月 第${Math.ceil(
                            currentDate.getDate() / 7,
                          )}週`}
                    </h3>
                    <Button
                      onClick={() => {
                        const newDate = new Date(currentDate)
                        if (calendarView === "week") {
                          newDate.setDate(newDate.getDate() + 7)
                        } else {
                          newDate.setMonth(newDate.getMonth() + 1)
                        }
                        setCurrentDate(newDate)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {calendarView === "week" ? (
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                        <div key={day} className="text-center font-bold text-gray-400 p-1 sm:p-2 text-xs sm:text-sm">
                          {day}
                        </div>
                      ))}
                      {getWeekDates(currentDate).map((date, index) => (
                        <div
                          key={index}
                          className={`p-2 sm:p-4 border rounded-lg text-center ${
                            hasWorkoutOnDate(date) ? "bg-red-600/30 border-red-500" : "bg-gray-700 border-gray-600"
                          }`}
                        >
                          <div className="text-white font-bold text-xs sm:text-sm">{date.getDate()}</div>
                          {hasWorkoutOnDate(date) && (
                            <div className="text-xs text-red-400 mt-1">🔥 {getWorkoutCountOnDate(date)}回</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1">
                      {["月", "火", "水", "木", "金", "土", "日"].map((day) => (
                        <div key={day} className="text-center font-bold text-gray-400 p-1 sm:p-2 text-xs sm:text-sm">
                          {day}
                        </div>
                      ))}
                      {getMonthDates(currentDate).map((date, index) => (
                        <div
                          key={index}
                          className={`p-1 sm:p-2 border rounded text-center ${
                            date.getMonth() !== currentDate.getMonth()
                              ? "bg-gray-900 border-gray-800 text-gray-600"
                              : hasWorkoutOnDate(date)
                                ? "bg-red-600/30 border-red-500"
                                : "bg-gray-700 border-gray-600"
                          }`}
                        >
                          <div className="text-xs sm:text-sm font-bold">{date.getDate()}</div>
                          {hasWorkoutOnDate(date) && (
                            <div className="text-xs text-red-400">🔥{getWorkoutCountOnDate(date)}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {workoutHistory.length === 0 && (
                <div className="text-center py-8 sm:py-16">
                  <div className="text-4xl sm:text-8xl mb-4 sm:mb-6">📈</div>
                  <p className="text-gray-400 text-lg sm:text-2xl font-bold">統計データがありません</p>
                  <p className="text-gray-500 text-sm sm:text-lg">ワークアウトを記録して統計を確認しましょう！</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
