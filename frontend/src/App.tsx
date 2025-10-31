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
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      <TranscriptSubmit
        transcript={transcript}
        loading={loading}
        error={error}
        onChange={setTranscript}
        onSubmit={handleSubmit}
      />

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Classification</div>
        <div style={{ fontSize: 18, fontWeight: 600, minHeight: 28 }}>
          {result?.classification ?? ''}
        </div>
      </div>

      <TranscriptViewer
        transcript={transcript}
        reasoning={result?.reasoning ?? ''}
      />

      <FeedbackForm
        enabled={!!result}
        onFeedback={handleFeedback}
      />
    </div>
  )
}

export default App