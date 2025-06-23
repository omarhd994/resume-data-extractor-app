import React from 'react'
import { ResumeScore } from '../types/resume'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ResumeScoreCardProps {
  score: ResumeScore
  industryMatch: number
}

const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({ score, industryMatch }) => {
  const getScoreColor = (value: number): string => {
    if (value >= 85) return 'text-emerald-600'
    if (value >= 70) return 'text-blue-600'
    if (value >= 55) return 'text-amber-600'
    return 'text-red-600'
  }

  const getScoreBackground = (value: number): string => {
    if (value >= 85) return 'from-emerald-50 to-emerald-100'
    if (value >= 70) return 'from-blue-50 to-blue-100'
    if (value >= 55) return 'from-amber-50 to-amber-100'
    return 'from-red-50 to-red-100'
  }

  const getScoreBarColor = (value: number): string => {
    if (value >= 85) return 'bg-gradient-to-r from-emerald-400 to-emerald-500'
    if (value >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-500'
    if (value >= 55) return 'bg-gradient-to-r from-amber-400 to-amber-500'
    return 'bg-gradient-to-r from-red-400 to-red-500'
  }

  const getOverallRating = (overall: number): string => {
    if (overall >= 90) return 'Exceptional'
    if (overall >= 85) return 'Excellent'
    if (overall >= 70) return 'Strong'
    if (overall >= 55) return 'Good'
    if (overall >= 40) return 'Fair'
    return 'Needs Work'
  }

  const getTrendIcon = (value: number) => {
    if (value >= 70) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (value >= 55) return <Minus className="w-4 h-4 text-yellow-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const ScoreBar: React.FC<{ label: string; value: number; description: string }> = ({ 
    label, value, description 
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <span className="text-sm font-semibold text-gray-700 w-20">{label}</span>
          {getTrendIcon(value)}
        </div>
        <span className={`text-sm font-bold ${getScoreColor(value)}`}>
          {value}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${getScoreBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )

  const CategorySection: React.FC<{ 
    title: string; 
    scores: Record<string, number>; 
    descriptions: Record<string, string> 
  }> = ({ title, scores, descriptions }) => (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
        {title}
      </h4>
      {Object.entries(scores).map(([key, value]) => (
        <ScoreBar
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          description={descriptions[key] || ''}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className={`bg-gradient-to-br ${getScoreBackground(score.overall)} rounded-2xl p-6 shadow-lg border border-gray-100`}>
        <div className="text-center mb-4">
          <div className={`text-5xl font-bold ${getScoreColor(score.overall)} mb-2`}>
            {score.overall}%
          </div>
          <div className="text-lg font-semibold text-gray-700 mb-1">
            {getOverallRating(score.overall)}
          </div>
          <div className="text-sm text-gray-500">Overall Resume Score</div>
        </div>
        
        {/* Industry Match */}
        <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Industry Match</span>
            <span className={`text-sm font-bold ${getScoreColor(industryMatch)}`}>
              {industryMatch}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${getScoreBarColor(industryMatch)}`}
              style={{ width: `${industryMatch}%` }}
            />
          </div>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Detailed Analysis</h3>
        
        <CategorySection
          title="Content Quality"
          scores={score.content}
          descriptions={{
            experience: 'Work history depth and relevance',
            skills: 'Technical and soft skills coverage',
            education: 'Academic background and certifications',
            achievements: 'Quantified accomplishments and results'
          }}
        />

        <CategorySection
          title="Structure & Format"
          scores={score.structure}
          descriptions={{
            formatting: 'Professional appearance and organization',
            sections: 'Completeness of required sections',
            length: 'Appropriate content length (1-2 pages)',
            readability: 'Clarity and ease of reading'
          }}
        />

        <CategorySection
          title="Optimization"
          scores={score.optimization}
          descriptions={{
            keywords: 'Industry-relevant terminology',
            actionVerbs: 'Strong, impactful language',
            quantification: 'Use of numbers and metrics',
            relevance: 'Alignment with target roles'
          }}
        />
      </div>

      {/* Score Legend */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Score Guide</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded mr-2"></div>
            <span>85-100%: Excellent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span>70-84%: Strong</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
            <span>55-69%: Good</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span>0-54%: Needs Work</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeScoreCard