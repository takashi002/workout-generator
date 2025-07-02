"use client"

import type React from "react"

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
  GripVertical,
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
  order?: number
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
    order: 1,
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
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
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
    order: 7,
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
    order: 8,
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
    order: 9,
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
    order: 10,
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
    order: 11,
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
    order: 12,
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
    order: 13,
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
    order: 14,
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
    order: 15,
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
    order: 16,
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
    order: 17,
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
    order: 18,
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
    order: 19,
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
    order: 20,
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
    order: 21,
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
    order: 22,
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
    order: 23,
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
    order: 24,
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
    order: 25,
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
    order: 26,
  },
]

const categoryColors = {
  胸筋: "bg-red-500 text-white",
  背筋: "bg-blue-500 text-white",
  脚: "bg-green-500 text-white",
  肩: "bg-yellow-500 text-white",
  腕: "bg-purple-500 text-white",
  腹筋: "bg-orange-500 text-white",
}

const difficultyColors = {
  初級: "bg-emerald-500 text-white",
  中級: "bg-amber-500 text-white",
  上級: "bg-red-500 text-white",
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
    equipment: "",
  })

  // Drag and drop states
  const [draggedExercise, setDraggedExercise] = useState<Exercise | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Load data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("workoutHistory")
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory))
    }

    const savedExercises = localStorage.getItem("allExercises")
    if (savedExercises) {
      const loadedExercises = JSON.parse(savedExercises)
      setExercises(loadedExercises)
    } else {
      // 初回起動時にデフォルト種目を保存
      localStorage.setItem("allExercises", JSON.stringify(defaultExercises))
    }
  }, [])

  // Save data to localStorage
  useEffect(() => {
    if (workoutHistory.length > 0) {
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory))
    }
  }, [workoutHistory])

  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem("allExercises", JSON.stringify(exercises))
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
      equipment: "",
    })
  }

  const handleAddExercise = () => {
    if (!exerciseForm.name.trim()) return

    const maxOrder = Math.max(...exercises.map((ex) => ex.order || 0), 0)
    const newExercise: Exercise = {
      id: Date.now().toString(),
      ...exerciseForm,
      difficulty: "初級",
      isCustom: true,
      order: maxOrder + 1,
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
      equipment: exercise.equipment,
    })
  }

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, exercise: Exercise) => {
    setDraggedExercise(exercise)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetExercise: Exercise, category: string) => {
    e.preventDefault()
    if (!draggedExercise || draggedExercise.id === targetExercise.id) {
      setDraggedExercise(null)
      setDragOverIndex(null)
      return
    }

    const categoryExercises = exercises
      .filter((ex) => ex.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const draggedIndex = categoryExercises.findIndex((ex) => ex.id === draggedExercise.id)
    const targetIndex = categoryExercises.findIndex((ex) => ex.id === targetExercise.id)

    if (draggedIndex === -1 || targetIndex === -1) return

    // 同じカテゴリ内での並び替えのみ許可
    if (draggedExercise.category !== category) {
      setDraggedExercise(null)
      setDragOverIndex(null)
      return
    }

    const newCategoryExercises = [...categoryExercises]
    const [draggedItem] = newCategoryExercises.splice(draggedIndex, 1)
    newCategoryExercises.splice(targetIndex, 0, draggedItem)

    // 新しい順序を設定
    const updatedExercises = exercises.map((ex) => {
      if (ex.category === category) {
        const newIndex = newCategoryExercises.findIndex((newEx) => newEx.id === ex.id)
        return { ...ex, order: newIndex + 1 }
      }
      return ex
    })

    setExercises(updatedExercises)
    setDraggedExercise(null)
    setDragOverIndex(null)
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

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  // Get sorted exercises by category
  const getSortedExercisesByCategory = (category: string) => {
    return exercises
      .filter((exercise) => exercise.category === category)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 text-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <div className="text-2xl sm:text-4xl">💪</div>
            <h1 className="text-2xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">
              MUSCLE TRACKER
            </h1>
            <div className="text-2xl sm:text-4xl">🔥</div>
          </div>
          <p className="text-sm sm:text-xl text-gray-700 font-semibold px-2">
            限界を記録し、成長を実感せよ！最強のトレーニング記録アプリ
          </p>
        </div>

        <Tabs defaultValue="workout" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-8 bg-white border border-gray-200 h-auto shadow-lg rounded-xl">
            <TabsTrigger
              value="workout"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white p-2 sm:p-3 rounded-lg transition-all duration-300"
            >
              🏋️ <span className="hidden sm:inline">ワークアウト</span>
            </TabsTrigger>
            <TabsTrigger
              value="generator"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white p-2 sm:p-3 rounded-lg transition-all duration-300"
            >
              ⚡ <span className="hidden sm:inline">ジェネレーター</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white p-2 sm:p-3 rounded-lg transition-all duration-300"
            >
              📊 <span className="hidden sm:inline">履歴</span>
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="font-bold text-xs sm:text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white p-2 sm:p-3 rounded-lg transition-all duration-300"
            >
              📈 <span className="hidden sm:inline">統計</span>
            </TabsTrigger>
          </TabsList>

          {/* ワークアウト記録タブ */}
          <TabsContent value="workout">
            {!currentSession ? (
              <div className="text-center py-8 sm:py-16">
                <div className="text-4xl sm:text-8xl mb-4 sm:mb-6">🏋️</div>
                <h2 className="text-xl sm:text-3xl font-black mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                  今日も限界を超えろ！
                </h2>
                <div className="space-y-3 sm:space-y-4 px-2">
                  <Button
                    onClick={() => startWorkout()}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 sm:hover:scale-110"
                  >
                    <Zap className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6" />
                    フリーワークアウト開始
                  </Button>
                  {generatedWorkout.length > 0 && (
                    <Button
                      onClick={() => startWorkout(generatedWorkout)}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 sm:hover:scale-110"
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
                  <Card className="bg-gradient-to-r from-red-500 to-orange-500 border-0 shadow-xl">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-2">🔥 REST TIME</h3>
                      <div className="text-4xl sm:text-6xl font-black text-white mb-4">{formatTime(restTimer)}</div>
                      <Button
                        onClick={() => {
                          setIsResting(false)
                          setRestTimer(0)
                        }}
                        className="bg-white text-red-500 hover:bg-gray-100 font-bold w-full sm:w-auto"
                      >
                        休憩終了
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Current Workout */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                  <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                    💪 現在のワークアウト
                  </h2>
                  <Button
                    onClick={finishWorkout}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold w-full sm:w-auto shadow-lg"
                  >
                    <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    ワークアウト完了
                  </Button>
                </div>

                {/* Add Exercise - 部位別表示 */}
                <Card className="bg-white border border-gray-200 shadow-lg">
                  <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-gray-900 font-black text-lg sm:text-xl">💪 種目を追加</CardTitle>
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
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">新規追加</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-md mx-2 sm:mx-auto shadow-xl">
                          <DialogHeader>
                            <DialogTitle className="text-gray-900 font-bold">新しい種目を追加</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name" className="text-gray-700 font-semibold">
                                種目名
                              </Label>
                              <Input
                                id="name"
                                value={exerciseForm.name}
                                onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                className="bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="category" className="text-gray-700 font-semibold">
                                部位
                              </Label>
                              <Select
                                value={exerciseForm.category}
                                onValueChange={(value) => setExerciseForm({ ...exerciseForm, category: value })}
                              >
                                <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200">
                                  {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((cat) => (
                                    <SelectItem key={cat} value={cat} className="text-gray-900">
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="sets" className="text-gray-700 font-semibold">
                                  セット数
                                </Label>
                                <Input
                                  id="sets"
                                  type="number"
                                  value={exerciseForm.sets}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    if (value === "") {
                                      setExerciseForm({ ...exerciseForm, sets: "" as any })
                                    } else {
                                      const numValue = Number.parseInt(value)
                                      if (!isNaN(numValue) && numValue > 0) {
                                        setExerciseForm({ ...exerciseForm, sets: numValue })
                                      }
                                    }
                                  }}
                                  className="bg-gray-50 border-gray-300 text-gray-900"
                                />
                              </div>
                              <div>
                                <Label htmlFor="reps" className="text-gray-700 font-semibold">
                                  回数
                                </Label>
                                <Input
                                  id="reps"
                                  value={exerciseForm.reps}
                                  onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                                  placeholder="10-15回"
                                  className="bg-gray-50 border-gray-300 text-gray-900"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="rest" className="text-gray-700 font-semibold">
                                  休憩時間
                                </Label>
                                <Input
                                  id="rest"
                                  value={exerciseForm.rest}
                                  onChange={(e) => setExerciseForm({ ...exerciseForm, rest: e.target.value })}
                                  placeholder="60秒"
                                  className="bg-gray-50 border-gray-300 text-gray-900"
                                />
                              </div>
                              <div>
                                <Label htmlFor="equipment" className="text-gray-700 font-semibold">
                                  器具
                                </Label>
                                <Input
                                  id="equipment"
                                  value={exerciseForm.equipment}
                                  onChange={(e) => setExerciseForm({ ...exerciseForm, equipment: e.target.value })}
                                  placeholder="ダンベル"
                                  className="bg-gray-50 border-gray-300 text-gray-900"
                                />
                              </div>
                            </div>
                            <Button
                              onClick={handleAddExercise}
                              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                              追加
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 pt-0">
                    <Tabs defaultValue="胸筋" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-4 bg-gray-100 h-auto rounded-lg">
                        {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((category) => (
                          <TabsTrigger
                            key={category}
                            value={category}
                            className="font-bold text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white p-1 sm:p-2 rounded transition-all duration-300"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((category) => (
                        <TabsContent key={category} value={category}>
                          <div className="space-y-1 text-xs text-gray-500 mb-3">
                            💡 ドラッグ&ドロップで種目の順序を変更できます
                          </div>
                          <div className="grid grid-cols-1 gap-2 sm:gap-3">
                            {getSortedExercisesByCategory(category).map((exercise, index) => (
                              <div
                                key={exercise.id}
                                className={`relative transition-all duration-200 ${
                                  dragOverIndex === index ? "transform scale-105" : ""
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, exercise)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, exercise, category)}
                              >
                                <Button
                                  onClick={() => addExerciseToSession(exercise)}
                                  variant="outline"
                                  className={`text-left p-3 sm:p-4 h-auto bg-white border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 w-full shadow-sm hover:shadow-md cursor-pointer ${
                                    dragOverIndex === index ? "border-blue-500 bg-blue-50" : ""
                                  }`}
                                >
                                  <div className="w-full">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex items-center gap-2">
                                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                                        <div className="font-bold text-gray-900 text-base sm:text-xl">
                                          {exercise.name}
                                        </div>
                                      </div>
                                      <div className="flex gap-1 sm:gap-2">
                                        {exercise.isCustom && (
                                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-sm">
                                            カスタム
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-sm sm:text-base text-gray-600 space-y-1 ml-6">
                                      <div>🏋️ {exercise.equipment}</div>
                                      <div>
                                        📊 {exercise.sets}セット × {exercise.reps}
                                      </div>
                                      <div>⏱️ 休憩: {exercise.rest}</div>
                                    </div>
                                  </div>
                                </Button>
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 w-6 p-0 border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white bg-white shadow-sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          openEditDialog(exercise)
                                        }}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-md mx-2 sm:mx-auto shadow-xl">
                                      <DialogHeader>
                                        <DialogTitle className="text-gray-900 font-bold">種目を編集</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="edit-name" className="text-gray-700 font-semibold">
                                            種目名
                                          </Label>
                                          <Input
                                            id="edit-name"
                                            value={exerciseForm.name}
                                            onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                                            className="bg-gray-50 border-gray-300 text-gray-900"
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="edit-category" className="text-gray-700 font-semibold">
                                            部位
                                          </Label>
                                          <Select
                                            value={exerciseForm.category}
                                            onValueChange={(value) =>
                                              setExerciseForm({ ...exerciseForm, category: value })
                                            }
                                          >
                                            <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200">
                                              {["胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((cat) => (
                                                <SelectItem key={cat} value={cat} className="text-gray-900">
                                                  {cat}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <Label htmlFor="edit-sets" className="text-gray-700 font-semibold">
                                              セット数
                                            </Label>
                                            <Input
                                              id="edit-sets"
                                              type="number"
                                              value={exerciseForm.sets}
                                              onChange={(e) => {
                                                const value = e.target.value
                                                if (value === "") {
                                                  setExerciseForm({ ...exerciseForm, sets: "" as any })
                                                } else {
                                                  const numValue = Number.parseInt(value)
                                                  if (!isNaN(numValue) && numValue > 0) {
                                                    setExerciseForm({ ...exerciseForm, sets: numValue })
                                                  }
                                                }
                                              }}
                                              className="bg-gray-50 border-gray-300 text-gray-900"
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-reps" className="text-gray-700 font-semibold">
                                              回数
                                            </Label>
                                            <Input
                                              id="edit-reps"
                                              value={exerciseForm.reps}
                                              onChange={(e) =>
                                                setExerciseForm({ ...exerciseForm, reps: e.target.value })
                                              }
                                              className="bg-gray-50 border-gray-300 text-gray-900"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                          <div>
                                            <Label htmlFor="edit-rest" className="text-gray-700 font-semibold">
                                              休憩時間
                                            </Label>
                                            <Input
                                              id="edit-rest"
                                              value={exerciseForm.rest}
                                              onChange={(e) =>
                                                setExerciseForm({ ...exerciseForm, rest: e.target.value })
                                              }
                                              className="bg-gray-50 border-gray-300 text-gray-900"
                                            />
                                          </div>
                                          <div>
                                            <Label htmlFor="edit-equipment" className="text-gray-700 font-semibold">
                                              器具
                                            </Label>
                                            <Input
                                              id="edit-equipment"
                                              value={exerciseForm.equipment}
                                              onChange={(e) =>
                                                setExerciseForm({ ...exerciseForm, equipment: e.target.value })
                                              }
                                              className="bg-gray-50 border-gray-300 text-gray-900"
                                            />
                                          </div>
                                        </div>
                                        <Button
                                          onClick={handleEditExercise}
                                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
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
                                    className="h-6 w-6 p-0 border-red-400 text-red-500 hover:bg-red-500 hover:text-white bg-white shadow-sm"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
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
                    <Card key={exerciseIndex} className="bg-white border border-gray-200 shadow-lg">
                      <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-gray-900 font-black text-sm sm:text-lg">
                            {workoutExercise.exercise.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Badge
                              className={
                                categoryColors[workoutExercise.exercise.category as keyof typeof categoryColors] +
                                " font-bold text-xs shadow-sm"
                              }
                            >
                              {workoutExercise.exercise.category}
                            </Badge>
                            <Button
                              onClick={() => removeExerciseFromSession(exerciseIndex)}
                              variant="outline"
                              size="sm"
                              className="border-red-400 text-red-500 hover:bg-red-500 hover:text-white h-6 w-6 p-0 bg-white shadow-sm"
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
                              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ${
                                set.completed
                                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-sm"
                                  : setIndex === workoutExercise.currentSet
                                    ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-400 shadow-sm"
                                    : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                <span className="font-bold text-gray-900 text-sm sm:text-base">
                                  セット {setIndex + 1}
                                </span>
                                {set.completed ? (
                                  <div className="text-green-600 font-bold text-sm sm:text-base">
                                    ✅ {set.reps}回 × {set.weight}kg
                                  </div>
                                ) : setIndex === workoutExercise.currentSet ? (
                                  <div className="flex gap-2 w-full sm:w-auto">
                                    <Input
                                      type="number"
                                      placeholder="回数"
                                      className="w-16 sm:w-20 bg-white border-gray-300 text-gray-900 text-sm focus:border-blue-500"
                                      id={`reps-${exerciseIndex}-${setIndex}`}
                                    />
                                    <Input
                                      type="number"
                                      placeholder="重量"
                                      className="w-16 sm:w-20 bg-white border-gray-300 text-gray-900 text-sm focus:border-blue-500"
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
                                      className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-2 sm:px-3 shadow-sm"
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
              <Card className="bg-white border border-gray-200 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-2xl font-black text-center mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
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
                            ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg transform scale-105"
                            : "border-2 border-gray-300 text-gray-700 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white hover:border-transparent hover:scale-105 bg-white"
                        }`}
                      >
                        {area === "全身バランス" ? "💥 " + area : area}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center mb-4 sm:mb-8">
                <Button
                  onClick={generateWorkout}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-red-500 via-orange-500 to-red-500 hover:from-red-600 hover:via-orange-600 hover:to-red-600 text-white px-6 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-black rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 sm:hover:scale-110 disabled:opacity-50"
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
                  <Card className="bg-gradient-to-r from-red-500 to-orange-500 border-0 shadow-xl">
                    <CardContent className="p-4 sm:p-6">
                      <h3 className="font-black text-lg sm:text-xl text-white mb-3 flex items-center gap-2">
                        🔥 {focusArea}メニュー
                      </h3>
                      <p className="text-white font-medium mb-4 text-sm sm:text-base">
                        {focusArea === "全身バランス"
                          ? "💥 全身を完全燃焼！各部位から最強の種目を厳選したバランス型メニューだ！"
                          : `🎯 ${focusArea}を徹底的に追い込む！メイン部位を限界まで鍛え上げる最強メニューだ！`}
                      </p>
                      <Button
                        onClick={() => startWorkout(generatedWorkout)}
                        className="w-full sm:w-auto bg-white text-red-500 hover:bg-gray-100 font-bold shadow-lg"
                      >
                        <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        このメニューでワークアウト開始
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {generatedWorkout.map((exercise, index) => (
                      <Card
                        key={index}
                        className="hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 hover:border-blue-300 hover:scale-105 shadow-lg"
                      >
                        <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg sm:text-xl font-black text-gray-900">
                              {exercise.name}
                            </CardTitle>
                            <Badge
                              className={
                                categoryColors[exercise.category as keyof typeof categoryColors] +
                                " font-bold text-xs shadow-sm"
                              }
                            >
                              {exercise.category}
                            </Badge>
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <Badge
                              variant="outline"
                              className="border-2 border-gray-400 text-gray-700 font-bold text-xs bg-white shadow-sm"
                            >
                              {exercise.equipment}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 p-3 sm:p-6">
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-semibold text-sm">セット数:</span>
                              <span className="font-black text-gray-900 text-sm">{exercise.sets}セット</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-semibold text-sm">回数:</span>
                              <span className="font-black text-gray-900 text-sm">{exercise.reps}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-semibold text-sm">休憩:</span>
                              <span className="font-black text-gray-900 text-sm">{exercise.rest}</span>
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
                <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
                  📊 ワークアウト履歴
                </h2>
                {workoutHistory.length > 0 && (
                  <Button
                    onClick={clearAllHistory}
                    variant="outline"
                    className="border-red-400 text-red-500 hover:bg-red-500 hover:text-white font-bold bg-white w-full sm:w-auto shadow-sm"
                  >
                    🗑️ 全履歴削除
                  </Button>
                )}
              </div>

              {workoutHistory.length === 0 ? (
                <div className="text-center py-8 sm:py-16">
                  <div className="text-4xl sm:text-8xl mb-4 sm:mb-6">📊</div>
                  <p className="text-gray-600 text-lg sm:text-2xl font-bold">まだ記録がありません</p>
                  <p className="text-gray-500 text-sm sm:text-lg">ワークアウトを開始して記録を作りましょう！</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {workoutHistory.map((session) => (
                    <Card key={session.id} className="bg-white border border-gray-200 shadow-lg">
                      <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <CardTitle className="text-gray-900 font-black text-sm sm:text-lg">
                            {new Date(session.date).toLocaleDateString("ja-JP")}{" "}
                            {new Date(session.date).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                          </CardTitle>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs shadow-sm">
                              {session.duration}分
                            </Badge>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xs shadow-sm">
                              {session.exercises.length}種目
                            </Badge>
                            <Button
                              onClick={() => deleteWorkoutSession(session.id)}
                              variant="outline"
                              size="sm"
                              className="border-red-400 text-red-500 hover:bg-red-500 hover:text-white h-6 w-6 p-0 bg-white shadow-sm"
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
                              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg gap-2 border border-gray-100"
                            >
                              <div>
                                <span className="text-gray-900 font-semibold text-sm sm:text-base">
                                  {workoutExercise.exercise.name}
                                </span>
                                <span className="text-gray-600 ml-2 text-xs sm:text-sm">
                                  ({workoutExercise.exercise.category})
                                </span>
                              </div>
                              <div className="text-left sm:text-right">
                                <div className="text-gray-700 font-bold text-xs sm:text-sm">
                                  {workoutExercise.sets.filter((set) => set.completed).length}/
                                  {workoutExercise.sets.length}セット完了
                                </div>
                                <div className="text-xs text-gray-500">
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
              <h2 className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-500">
                📈 トレーニング統計
              </h2>

              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <Card className="bg-gradient-to-br from-red-500 to-orange-500 border-0 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-3xl mb-1 sm:mb-2">🔥</div>
                    <div className="text-lg sm:text-2xl font-black text-white mb-1">{workoutHistory.length}</div>
                    <div className="text-white font-bold text-xs sm:text-sm leading-tight">総ワークアウト数</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 border-0 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-3xl mb-1 sm:mb-2">⏱️</div>
                    <div className="text-lg sm:text-2xl font-black text-white mb-1">
                      {workoutHistory.reduce((total, session) => total + session.duration, 0)}
                    </div>
                    <div className="text-white font-bold text-xs sm:text-sm leading-tight">
                      総トレーニング時間（分）
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 border-0 shadow-xl">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-lg sm:text-3xl mb-1 sm:mb-2">💪</div>
                    <div className="text-lg sm:text-2xl font-black text-white mb-1">
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
                    <div className="text-white font-bold text-xs sm:text-sm leading-tight">総完了セット数</div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar View */}
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <CardTitle className="text-gray-900 font-black text-lg sm:text-xl">
                      📅 ワークアウトカレンダー
                    </CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => setCalendarView("week")}
                        variant={calendarView === "week" ? "default" : "outline"}
                        className={`flex-1 sm:flex-none ${
                          calendarView === "week"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                        } shadow-sm`}
                        size="sm"
                      >
                        週表示
                      </Button>
                      <Button
                        onClick={() => setCalendarView("month")}
                        variant={calendarView === "month" ? "default" : "outline"}
                        className={`flex-1 sm:flex-none ${
                          calendarView === "month"
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                        } shadow-sm`}
                        size="sm"
                      >
                        月表示
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0 bg-white">
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
                    >
                      <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center">
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
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
                    >
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  {calendarView === "week" ? (
                    <div className="grid grid-cols-7 gap-2 sm:gap-3">
                      {["月", "火", "水", "木", "金", "土", "日"].map((day, index) => (
                        <div
                          key={day}
                          className={`text-center font-bold p-2 sm:p-3 text-sm sm:text-base rounded-lg ${
                            index === 5
                              ? "text-blue-600 bg-blue-50"
                              : index === 6
                                ? "text-red-600 bg-red-50"
                                : "text-gray-700 bg-gray-50"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                      {getWeekDates(currentDate).map((date, index) => (
                        <div
                          key={index}
                          className={`p-3 sm:p-4 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-md ${
                            isToday(date)
                              ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-lg transform scale-105 ring-2 ring-indigo-300"
                              : hasWorkoutOnDate(date)
                                ? "bg-gradient-to-br from-red-500 to-orange-500 border-red-400 text-white shadow-lg transform scale-105"
                                : index === 5
                                  ? "bg-blue-50 border-blue-200 text-blue-800"
                                  : index === 6
                                    ? "bg-red-50 border-red-200 text-red-800"
                                    : "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          <div className="font-bold text-lg sm:text-xl mb-1">{date.getDate()}</div>
                          {isToday(date) && !hasWorkoutOnDate(date) && (
                            <div className="text-xs sm:text-sm font-bold">📅 今日</div>
                          )}
                          {hasWorkoutOnDate(date) && (
                            <div className="text-xs sm:text-sm font-bold">
                              🔥 {getWorkoutCountOnDate(date)}回{isToday(date) && <div className="text-xs">今日</div>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-1 sm:gap-2">
                      {["月", "火", "水", "木", "金", "土", "日"].map((day, index) => (
                        <div
                          key={day}
                          className={`text-center font-bold p-2 text-xs sm:text-sm rounded ${
                            index === 5
                              ? "text-blue-600 bg-blue-50"
                              : index === 6
                                ? "text-red-600 bg-red-50"
                                : "text-gray-700 bg-gray-50"
                          }`}
                        >
                          {day}
                        </div>
                      ))}
                      {getMonthDates(currentDate).map((date, index) => (
                        <div
                          key={index}
                          className={`p-2 sm:p-3 border rounded-lg text-center transition-all duration-200 hover:shadow-sm ${
                            date.getMonth() !== currentDate.getMonth()
                              ? "bg-gray-100 border-gray-200 text-gray-400"
                              : isToday(date)
                                ? "bg-gradient-to-br from-indigo-500 to-purple-500 border-indigo-400 text-white shadow-md font-bold ring-2 ring-indigo-300"
                                : hasWorkoutOnDate(date)
                                  ? "bg-gradient-to-br from-red-500 to-orange-500 border-red-400 text-white shadow-md font-bold"
                                  : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`text-xs sm:text-sm font-bold ${hasWorkoutOnDate(date) || isToday(date) ? "text-white" : ""}`}
                          >
                            {date.getDate()}
                          </div>
                          {isToday(date) && !hasWorkoutOnDate(date) && (
                            <div className="text-xs font-bold text-white mt-1">📅</div>
                          )}
                          {hasWorkoutOnDate(date) && (
                            <div className="text-xs font-bold text-white mt-1">
                              🔥{getWorkoutCountOnDate(date)}
                              {isToday(date) && <div className="text-xs">今日</div>}
                            </div>
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
                  <p className="text-gray-600 text-lg sm:text-2xl font-bold">統計データがありません</p>
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
