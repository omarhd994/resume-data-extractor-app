import React from 'react'
import { ResumeScore } from '../types/resume'

interface ResumeScoreCardProps {
  score: ResumeScore
}

const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({ score }) => {
  const getScoreColor = (value: number): string => {
    if (value >= 80) return 'text-green-600'
    if (value >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBarColor = (value: number): string => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getOverallRating = (overall: number): string => {
    if (overall >= 90) return 'Exceptional'
    if (overall >= 80) return 'Excellent'
    if (overall >= 70) return 'Good'
    if (overall >= 60) return 'Average'
    if (overall >= 50) return 'Below Average'
    return 'Needs Improvement'
  }

  const StatBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-700 w-24">{label}</span>
      <div className="flex-1 mx-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(value)}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-bold w-8 ${getScoreColor(value)}`}>
        {value}
      </span>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className={`text-6xl font-bold ${getScoreColor(score.overall)} mb-2`}>
            {score.overall}
          </div>
          <div className="absolute -top-2 -right-8 text-2xl font-bold text-gray-400">
            /99
          </div>
        </div>
        <div className="text-lg font-semibold text-gray-700">
          {getOverallRating(score.overall)}
        </div>
        <div className="text-sm text-gray-500">Resume Score</div>
      </div>

      <div className="space-y-1">
        <StatBar label="Experience" value={score.experience} />
        <StatBar label="Skills" value={score.skills} />
        <StatBar label="Education" value={score.education} />
        <StatBar label="Format" value={score.formatting} />
        <StatBar label="Keywords" value={score.keywords} />
        <StatBar label="Achievements" value={score.achievements} />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Powered by AI Resume Analysis
        </div>
      </div>
    </div>
  )
}

export default ResumeScoreCard