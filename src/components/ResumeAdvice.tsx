import React from 'react'
import { ResumeAdvice as ResumeAdviceType } from '../types/resume'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ResumeAdviceProps {
  advice: ResumeAdviceType[]
  strengths: string[]
  weaknesses: string[]
}

const ResumeAdvice: React.FC<ResumeAdviceProps> = ({ advice, strengths, weaknesses }) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <Info className="w-4 h-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="text-green-700 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Areas */}
      {advice.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {advice.map((item, index) => (
              <div
                key={index}
                className={`border-l-4 pl-4 py-2 ${getPriorityBorder(item.priority)}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getPriorityIcon(item.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 text-sm">
                      {item.category}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      {item.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="bg-red-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Key Weaknesses
          </h3>
          <ul className="space-y-2">
            {weaknesses.map((weakness, index) => (
              <li key={index} className="text-red-700 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                {weakness}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Pro Tips
        </h3>
        <ul className="space-y-2 text-blue-700 text-sm">
          <li className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
            Use action verbs like "achieved," "implemented," "led," and "optimized"
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
            Quantify achievements with specific numbers and percentages
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
            Tailor your resume to match job descriptions and requirements
          </li>
          <li className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2" />
            Keep your resume to 1-2 pages and use consistent formatting
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ResumeAdvice