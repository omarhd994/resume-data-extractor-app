import React, { useState } from 'react'
import { UploadCloud, FileText, X, BarChart3, Eye, EyeOff } from 'lucide-react'
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resume Analyzer</h1>
          <p className="text-gray-600 mb-6">
            Upload your resume to get an AI-powered analysis with scoring and improvement suggestions
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors hover:border-blue-400">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop your resume here
              </h3>
              <p className="text-gray-500 mb-4">or</p>
              <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
                Select File
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Supported formats: PDF, DOCX, DOC
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-md">
              {error}
            </div>
          )}

          {currentFile && analysis && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* File Info and Score */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-blue-500 mr-3" />
                      <span className="font-medium text-gray-700 truncate">
                        {currentFile.name}
                      </span>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowRawText(!showRawText)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    {showRawText ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hide Raw Text
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        Show Raw Text
                      </>
                    )}
                  </button>
                </div>

                <ResumeScoreCard score={analysis.score} />
              </div>

              {/* Analysis and Advice */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Analysis & Recommendations
                  </h2>
                </div>
                
                <ResumeAdvice 
                  advice={analysis.advice}
                  strengths={analysis.strengths}
                  weaknesses={analysis.weaknesses}
                />
              </div>
            </div>
          )}

          {/* Raw Text Display */}
          {currentFile && showRawText && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Extracted Text
              </h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">
                    {currentFile.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentUploader