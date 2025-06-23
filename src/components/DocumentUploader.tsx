import React, { useState } from 'react'
import { UploadCloud, FileText, X, BarChart3, Eye, EyeOff, Zap } from 'lucide-react'
import { ResumeAnalyzer } from '../utils/resumeAnalyzer'
import { ResumeAnalysis } from '../types/resume'
import ResumeScoreCard from './ResumeScoreCard'
import ResumeAdvice from './ResumeAdvice'

// Import PDF.js using ESM syntax
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface FileWithPreview extends File {
  preview?: string
  content?: string
}

const DocumentUploader: React.FC = () => {
  const [currentFile, setCurrentFile] = useState<FileWithPreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [showRawText, setShowRawText] = useState(false)

  const getFileExtension = (filename: string = ''): string => {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      let fullText = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n\n'
      }

      return fullText || 'No text could be extracted from PDF'
    } catch (err) {
      console.error('PDF extraction error:', err)
      return 'Could not extract text from PDF'
    }
  }

  const extractTextFromWord = async (file: File): Promise<string> => {
    try {
      const mammoth = await import('mammoth')
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.extractRawText({ arrayBuffer })
      return result.value || 'No text could be extracted from Word document'
    } catch (err) {
      console.error('Word extraction error:', err)
      return 'Could not extract text from Word document'
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    setIsLoading(true)
    setError(null)
    setAnalysis(null)

    try {
      const file = e.target.files[0]
      const fileWithPreview: FileWithPreview = {
        ...file,
        preview: URL.createObjectURL(file),
        content: ''
      }

      const extension = getFileExtension(file.name)
      const fileType = file.type.toLowerCase()

      if (fileType.includes('pdf') || extension === 'pdf') {
        fileWithPreview.content = await extractTextFromPDF(file)
      } else if (
        fileType.includes('word') || 
        fileType.includes('document') ||
        ['docx', 'doc'].includes(extension)
      ) {
        fileWithPreview.content = await extractTextFromWord(file)
      } else {
        fileWithPreview.content = await extractTextFromPDF(file) 
          || await extractTextFromWord(file)
          || 'Unsupported file type'
      }

      setCurrentFile(fileWithPreview)

      // Analyze the resume
      if (fileWithPreview.content && fileWithPreview.content !== 'Unsupported file type') {
        const analyzer = new ResumeAnalyzer(fileWithPreview.content)
        const resumeAnalysis = analyzer.analyze()
        setAnalysis(resumeAnalysis)
      }
    } catch (err) {
      setError('Failed to process file. Please try again.')
      console.error('Processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    if (currentFile?.preview) {
      URL.revokeObjectURL(currentFile.preview)
    }
    setCurrentFile(null)
    setAnalysis(null)
    setShowRawText(false)
  }

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-emerald-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 55) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant, comprehensive feedback on your resume with AI-powered analysis, 
            detailed scoring, and actionable improvement recommendations
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <UploadCloud className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Drag and drop your resume file here, or click to browse. 
                  Get instant analysis and improvement suggestions.
                </p>
                <label className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                  />
                  Choose File
                </label>
                <p className="text-xs text-gray-400 mt-3">
                  Supported formats: PDF, DOCX, DOC (Max 10MB)
                </p>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="mt-8 flex flex-col items-center justify-center py-12">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Analyzing your resume...</p>
                <p className="text-sm text-gray-500">This may take a few seconds</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <div className="flex items-center">
                  <X className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {/* Results */}
            {currentFile && analysis && (
              <div className="mt-8">
                {/* File Info Header */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <span className="font-medium text-gray-700">{currentFile.name}</span>
                      <div className="text-sm text-gray-500">
                        {analysis.insights.wordCount} words • {analysis.insights.pageEstimate} page(s) • 
                        Overall Score: <span className={`font-bold ${getScoreColor(analysis.score.overall)}`}>
                          {analysis.score.overall}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowRawText(!showRawText)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                    >
                      {showRawText ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide Text
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-1" />
                          View Text
                        </>
                      )}
                    </button>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Main Analysis Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Score Card */}
                  <div className="xl:col-span-1">
                    <ResumeScoreCard 
                      score={analysis.score} 
                      industryMatch={analysis.industryMatch}
                    />
                  </div>

                  {/* Analysis and Advice */}
                  <div className="xl:col-span-2">
                    <div className="flex items-center mb-6">
                      <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Analysis & Recommendations
                      </h2>
                    </div>
                    
                    <ResumeAdvice 
                      advice={analysis.advice}
                      insights={analysis.insights}
                      strengths={analysis.strengths}
                      criticalIssues={analysis.criticalIssues}
                    />
                  </div>
                </div>

                {/* Raw Text Display */}
                {showRawText && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Extracted Text Content
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm text-gray-600">
                          Raw text extracted from your resume
                        </span>
                      </div>
                      <div className="p-6 bg-gray-50 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm leading-relaxed">
                          {currentFile.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by advanced AI • Secure and private • No data stored</p>
        </div>
      </div>
    </div>
  )
}

export default DocumentUploader