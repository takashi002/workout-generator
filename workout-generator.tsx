"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Dumbbell, Clock, Target } from "lucide-react"

interface Exercise {
  name: string
  category: string
  sets: number
  reps: string
  rest: string
  difficulty: "初級" | "中級" | "上級"
  equipment: string
}

const exercises: Exercise[] = [
  // 胸筋
  {
    name: "腕立て伏せ",
    category: "胸筋",
    sets: 3,
    reps: "10-15回",
    rest: "60秒",
    difficulty: "初級",
    equipment: "自重",
  },
  {
    name: "ベンチプレス",
    category: "胸筋",
    sets: 4,
    reps: "8-12回",
    rest: "90秒",
    difficulty: "中級",
    equipment: "バーベル",
  },
  {
    name: "ダンベルフライ",
    category: "胸筋",
    sets: 3,
    reps: "12-15回",
    rest: "60秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    name: "インクラインプッシュアップ",
    category: "胸筋",
    sets: 3,
    reps: "12-20回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "自重",
  },

  // 背筋
  { name: "懸垂", category: "背筋", sets: 3, reps: "5-10回", rest: "90秒", difficulty: "上級", equipment: "懸垂バー" },
  {
    name: "ラットプルダウン",
    category: "背筋",
    sets: 4,
    reps: "10-12回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "マシン",
  },
  {
    name: "ベントオーバーロー",
    category: "背筋",
    sets: 4,
    reps: "8-12回",
    rest: "90秒",
    difficulty: "中級",
    equipment: "バーベル",
  },
  {
    name: "シーテッドロー",
    category: "背筋",
    sets: 3,
    reps: "12-15回",
    rest: "60秒",
    difficulty: "初級",
    equipment: "マシン",
  },

  // 脚
  { name: "スクワット", category: "脚", sets: 4, reps: "12-20回", rest: "90秒", difficulty: "初級", equipment: "自重" },
  { name: "ランジ", category: "脚", sets: 3, reps: "10-15回/脚", rest: "60秒", difficulty: "初級", equipment: "自重" },
  {
    name: "デッドリフト",
    category: "脚",
    sets: 4,
    reps: "6-10回",
    rest: "120秒",
    difficulty: "上級",
    equipment: "バーベル",
  },
  {
    name: "レッグプレス",
    category: "脚",
    sets: 4,
    reps: "15-20回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "マシン",
  },
  {
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
    name: "ショルダープレス",
    category: "肩",
    sets: 3,
    reps: "10-12回",
    rest: "75秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    name: "サイドレイズ",
    category: "肩",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    name: "フロントレイズ",
    category: "肩",
    sets: 3,
    reps: "10-12回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
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
    name: "バイセップカール",
    category: "腕",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  {
    name: "トライセップエクステンション",
    category: "腕",
    sets: 3,
    reps: "10-12回",
    rest: "60秒",
    difficulty: "中級",
    equipment: "ダンベル",
  },
  {
    name: "ハンマーカール",
    category: "腕",
    sets: 3,
    reps: "12-15回",
    rest: "45秒",
    difficulty: "初級",
    equipment: "ダンベル",
  },
  { name: "ディップス", category: "腕", sets: 3, reps: "8-15回", rest: "75秒", difficulty: "中級", equipment: "自重" },

  // 腹筋
  { name: "プランク", category: "腹筋", sets: 3, reps: "30-60秒", rest: "45秒", difficulty: "初級", equipment: "自重" },
  { name: "クランチ", category: "腹筋", sets: 3, reps: "15-25回", rest: "30秒", difficulty: "初級", equipment: "自重" },
  {
    name: "レッグレイズ",
    category: "腹筋",
    sets: 3,
    reps: "10-15回",
    rest: "45秒",
    difficulty: "中級",
    equipment: "自重",
  },
  {
    name: "バイシクルクランチ",
    category: "腹筋",
    sets: 3,
    reps: "20-30回",
    rest: "45秒",
    difficulty: "中級",
    equipment: "自重",
  },
  {
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

export default function WorkoutGenerator() {
  const [currentWorkout, setCurrentWorkout] = useState<Exercise[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [focusArea, setFocusArea] = useState<string>("全身バランス")

  const generateWorkout = () => {
    setIsGenerating(true)

    const newWorkout: Exercise[] = []

    if (focusArea === "全身バランス") {
      // 各部位から1つずつ選択（バランスの良いワークアウト）
      const categories = ["胸筋", "背筋", "脚", "肩", "腕", "腹筋"]
      categories.forEach((category) => {
        const categoryExercises = exercises.filter((ex) => ex.category === category)
        const randomExercise = categoryExercises[Math.floor(Math.random() * categoryExercises.length)]
        newWorkout.push(randomExercise)
      })
    } else {
      // 特定部位中心のワークアウト
      const focusExercises = exercises.filter((ex) => ex.category === focusArea)

      // メイン部位から全種目選択（最大6種目）
      const shuffledFocus = [...focusExercises].sort(() => Math.random() - 0.5)
      const selectedCount = Math.min(6, focusExercises.length)
      newWorkout.push(...shuffledFocus.slice(0, selectedCount))
    }

    // シャッフルして順序をランダムに
    for (let i = newWorkout.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newWorkout[i], newWorkout[j]] = [newWorkout[j], newWorkout[i]]
    }

    setTimeout(() => {
      setCurrentWorkout(newWorkout)
      setIsGenerating(false)
    }, 1000)
  }

  const getTotalTime = () => {
    if (currentWorkout.length === 0) return 0
    // 各セットの時間を概算（実行時間 + 休憩時間）
    return currentWorkout.reduce((total, exercise) => {
      const restTime = Number.parseInt(exercise.rest)
      const exerciseTime = exercise.sets * (30 + restTime) // 30秒実行 + 休憩時間
      return total + exerciseTime
    }, 0)
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl">💪</div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500">
              WORKOUT GENERATOR
            </h1>
            <div className="text-4xl">🔥</div>
          </div>
          <p className="text-xl text-gray-300 font-semibold">
            今日も限界を超えろ！最強のトレーニングメニューを生成せよ！
          </p>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600 shadow-2xl">
          <h3 className="text-2xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
            🎯 TARGET MUSCLE
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {["全身バランス", "胸筋", "背筋", "脚", "肩", "腕", "腹筋"].map((area) => (
              <Button
                key={area}
                variant={focusArea === area ? "default" : "outline"}
                onClick={() => setFocusArea(area)}
                className={`font-bold text-lg px-6 py-3 transition-all duration-300 ${
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

        <div className="text-center mb-8">
          <Button
            onClick={generateWorkout}
            disabled={isGenerating}
            size="lg"
            className="bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white px-12 py-4 text-xl font-black rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-110 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="mr-3 h-6 w-6 animate-spin" />🔥 GENERATING...
              </>
            ) : (
              <>
                <Dumbbell className="mr-3 h-6 w-6" />💪 {focusArea}で限界突破！
              </>
            )}
          </Button>
        </div>

        {currentWorkout.length > 0 && (
          <>
            <div className="mb-6 p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-xl border border-red-500/30 shadow-xl">
              <h3 className="font-black text-xl text-red-400 mb-3 flex items-center gap-2">🔥 {focusArea}メニュー</h3>
              <p className="text-gray-300 font-medium">
                {focusArea === "全身バランス"
                  ? "💥 全身を完全燃焼！各部位から最強の種目を厳選したバランス型メニューだ！"
                  : `🎯 ${focusArea}を徹底的に追い込む！メイン部位を限界まで鍛え上げ、他の部位もサポートする最強メニューだ！`}
              </p>
            </div>

            <div className="mb-6 p-4 bg-gray-800 rounded-xl shadow-xl border border-gray-600">
              <div className="flex items-center justify-center gap-8 text-gray-300 font-bold">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  <span className="text-lg">{currentWorkout.length}種目</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-lg">約{Math.round(getTotalTime() / 60)}分</span>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentWorkout.map((exercise, index) => (
                <Card
                  key={index}
                  className="hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 hover:border-red-500 hover:scale-105"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-black text-white">{exercise.name}</CardTitle>
                      <Badge
                        className={categoryColors[exercise.category as keyof typeof categoryColors] + " font-bold"}
                      >
                        {exercise.category}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={difficultyColors[exercise.difficulty] + " font-bold border-2"}
                      >
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline" className="border-2 border-gray-500 text-gray-300 font-bold">
                        {exercise.equipment}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">セット数:</span>
                        <span className="font-black text-white">{exercise.sets}セット</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">回数:</span>
                        <span className="font-black text-white">{exercise.reps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-semibold">休憩:</span>
                        <span className="font-black text-white">{exercise.rest}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-2xl border border-gray-600">
              <h3 className="font-black text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                🔥 TRAINING TIPS
              </h3>
              <ul className="text-gray-300 font-medium space-y-2">
                <li>💪 正しいフォームで限界まで追い込め！質が全てだ！</li>
                <li>💧 水分補給を怠るな！戦士は常に準備を怠らない！</li>
                <li>⚡ 筋肉痛は成長の証！でも無理は禁物、賢く戦え！</li>
                <li>🔥 ウォーミングアップとクールダウンで完璧を目指せ！</li>
              </ul>
            </div>
          </>
        )}

        {currentWorkout.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💪</div>
            <p className="text-gray-400 text-2xl font-bold mb-4">準備はいいか？</p>
            <p className="text-gray-500 text-lg">上のボタンを押して、今日の限界突破メニューを生成しろ！</p>
          </div>
        )}
      </div>
    </div>
  )
}
