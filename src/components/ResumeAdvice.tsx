import React, { useState } from 'react'
import { ResumeAdvice as ResumeAdviceType, ResumeInsights } from '../types/resume'
import { 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb, 
  Target,
  FileText,
  TrendingUp,
  Users,
  Clock,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface ResumeAdviceProps {
  advice: ResumeAdviceType[]
  insights: ResumeInsights
  strengths: string[]
  criticalIssues: string[]
}

const ResumeAdvice: React.FC<ResumeAdviceProps> = ({ 
  advice, 
  insights, 
  strengths, 
  criticalIssues 
}) => {
  const [expandedAdvice, setExpandedAdvice] = useState<number | null>(null)

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'high':
        return <Target className="w-5 h-5 text-orange-500" />
      case 'medium':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'low':
        return <Lightbulb className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'border-l-red-500 bg-red-50'
      case 'high':
        return 'border-l-orange-500 bg-orange-50'
      case 'medium':
        return 'border-l-blue-500 bg-blue-50'
      case 'low':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getImpactBadge = (impact: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-blue-100 text-blue-800',
      low: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact as keyof typeof colors]}`}>
        {impact.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resume Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-indigo-600" />
          Resume Insights
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{insights.wordCount}</div>
            <div className="text-sm text-gray-600">Words</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{insights.experienceYears}</div>
            <div className="text-sm text-gray-600">Years Exp.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{insights.skillsCount}</div>
            <div className="text-sm text-gray-600">Skills</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{insights.quantifiedAchievements}</div>
            <div className="text-sm text-gray-600">Metrics</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {insights.sectionsFound.map((section, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/60 text-indigo-700 rounded-full text-xs font-medium"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Critical Issues */}
      {criticalIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Critical Issues to Fix
          </h3>
          <ul className="space-y-2">
            {criticalIssues.map((issue, index) => (
              <li key={index} className="flex items-start text-red-700">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-sm">{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Your Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start text-green-700">
                <CheckCircle className="w-4 h-4 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Recommendations */}
      {advice.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Improvement Recommendations
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Prioritized suggestions to enhance your resume
            </p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {advice.map((item, index) => (
              <div key={index} className={`border-l-4 ${getImpactColor(item.impact)}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      {getImpactIcon(item.impact)}
                      <div className="ml-3">
                        <div className="font-semibold text-gray-800 text-sm">
                          {item.category}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">
                          {item.issue}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getImpactBadge(item.impact)}
                      {item.examples && (
                        <button
                          onClick={() => setExpandedAdvice(expandedAdvice === index ? null : index)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedAdvice === index ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-8">
                    <div className="text-sm text-gray-700 font-medium mb-2">
                      💡 {item.suggestion}
                    </div>
                    
                    {item.examples && expandedAdvice === index && (
                      <div className="mt-3 p-3 bg-white/60 rounded-lg">
                        <div className="text-xs font-medium text-gray-600 mb-2">Examples:</div>
                        <ul className="space-y-1">
                          {item.examples.map((example, exIndex) => (
                            <li key={exIndex} className="text-xs text-gray-700 flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                {example}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Pro Tips for Resume Success
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <Target className="w-4 h-4 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-800 text-sm">Tailor for Each Job</div>
                <div className="text-blue-700 text-xs">Customize keywords and skills for each application</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="w-4 h-4 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-800 text-sm">Show Impact</div>
                <div className="text-blue-700 text-xs">Focus on results and achievements, not just duties</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Clock className="w-4 h-4 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-800 text-sm">Keep It Current</div>
                <div className="text-blue-700 text-xs">Update regularly with new skills and experiences</div>
              </div>
            </div>
            
            <div className="flex items-start">
              <FileText className="w-4 h-4 text-blue-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium text-blue-800 text-sm">Format Matters</div>
                <div className="text-blue-700 text-xs">Use consistent formatting and professional fonts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeAdvice