import React, { useState } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'

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

    try {
      const file = e.target.files[0] // Only take the first file
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
        // Try both extractors as fallback
        fileWithPreview.content = await extractTextFromPDF(file) 
          || await extractTextFromWord(file)
          || 'Unsupported file type'
      }

      setCurrentFile(fileWithPreview)
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
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Document Extractor</h1>
          <p className="text-gray-600 mb-6">
            Upload a PDF or Word document to extract its contents
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-colors hover:border-blue-400">
            <div className="flex flex-col items-center justify-center">
              <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Drag and drop file here
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

          {currentFile && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Resume Information
              </h2>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="font-medium text-gray-700">
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
                <div className="p-4 bg-white">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
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
