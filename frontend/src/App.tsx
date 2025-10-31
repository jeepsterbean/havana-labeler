import { useCallback, useState } from 'react'
import './App.css'
import { TranscriptSubmit } from './components/TranscriptSubmit.tsx'
import { TranscriptViewer } from './components/TranscriptViewer.tsx'
import { FeedbackForm } from './components/FeedbackForm.tsx'

interface ReasoningItem {
  reasoning_text: string;
  citations: string[];
}

type ClassificationResult = {
  transcriptId: string
  classification: string
  reasoning: ReasoningItem[]
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
      console.log("printing data now")
      console.log(data)

      setResult({
        transcriptId: data.transcriptId ?? '',
        classification: data.classification ?? '',
        reasoning: data.reasoning ?? []
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

        <TranscriptViewer
          transcript={transcript}
          reasoning={result?.reasoning ?? []}
          classification={result?.classification ?? ''}
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