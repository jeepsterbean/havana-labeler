import { useState } from 'react'
import './App.css'

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

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Try to parse JSON; if backend returns text, this will throw
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
      // If backend returns plain text, attempt to read it for debugging visibility
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
  }
  const handleFeedback = async (isCorrect: boolean) => {
    // Placeholder: send feedback if/when an endpoint is available.
    // For now, just log it.
    console.log('Feedback:', { isCorrect, transcript, result })
    // Optionally: optimistic UI toast or inline message.
  }

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 16 }}>
      {/* 1) Top form: transcript + submit */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="transcript"><strong>Transcript</strong></label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste transcript here…"
          rows={8}
          style={{ width: '100%', fontFamily: 'inherit', fontSize: 14 }}
          required
        />
        <div>
          <button type="submit" disabled={loading || !transcript.trim()}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </div>
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      </form>
      {/* 2) Classification display */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Classification</div>
        <div style={{ fontSize: 18, fontWeight: 600, minHeight: 28 }}>
          {result?.classification ?? ''}
        </div>
      </div>
      {/* 3 & 4) Horizontal: left transcript, right reasoning */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Input Transcript</div>
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: 12,
              minHeight: 120,
              whiteSpace: 'pre-wrap'
            }}
          >
            {transcript}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#666' }}>Reasoning</div>
          <div
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 8,
              padding: 12,
              minHeight: 120,
              whiteSpace: 'pre-wrap'
            }}
          >
            {result?.reasoning ?? ''}
          </div>
        </div>
      </div>
      {/* Feedback form */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Is the classification correct?
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => handleFeedback(true)}
            disabled={!result}
          >
            Correct
          </button>
          <button
            type="button"
            onClick={() => handleFeedback(false)}
            disabled={!result}
          >
            Wrong
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
