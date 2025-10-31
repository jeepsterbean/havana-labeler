import { useCallback, useState } from 'react'
import './App.css'
import { TranscriptSubmit } from './components/TranscriptSubmit'
import { TranscriptViewer } from './components/TranscriptViewer'
import { FeedbackForm } from './components/FeedbackForm'

type ClassificationResult = {
  transcriptId: string
  classification: string
  reasoning: string
}

function App() {
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ClassificationResult | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('http://localhost:5001/classify-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      })

      const data = await res.json() as Partial<ClassificationResult>

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }

      setResult({
        transcriptId: data.transcriptId ?? '',
        classification: data.classification ?? '',
        reasoning: data.reasoning ?? ''
      })
    } catch (err) {
      try {
        const res = await fetch('http://localhost:5001/')
        const text = await res.text()
        setError(`Expected JSON but got text: ${text}`)
      } catch {
        setError((err as Error).message)
      }
    } finally {
      setLoading(false)
    }
  }, [transcript])

  const handleFeedback = useCallback((isCorrect: boolean) => {
    console.log('Feedback:', { isCorrect, transcript, result })
  }, [transcript, result])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">Transcript Classifier</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <TranscriptSubmit
            transcript={transcript}
            loading={loading}
            error={error}
            onChange={setTranscript}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Classification</div>
          {result?.classification ? (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              {result.classification}
            </span>
          ) : (
            <div className="h-7" />
          )}
        </div>

        <TranscriptViewer
          transcript={transcript}
          reasoning={result?.reasoning ?? ''}
        />

        <FeedbackForm
          enabled={!!result}
          onFeedback={handleFeedback}
        />
      </main>
    </div>
  )
}

export default App