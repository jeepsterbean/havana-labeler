// frontend/src/components/TranscriptSubmit.tsx
import { memo } from 'react'

export type TranscriptSubmitProps = {
  transcript: string
  loading: boolean
  error: string | null
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

/**
 * Renders the transcript input form and submit button.
 */
export const TranscriptSubmit = memo(function TranscriptSubmit({
  transcript,
  loading,
  error,
  onChange,
  onSubmit
}: TranscriptSubmitProps) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
      <label htmlFor="transcript"><strong>Transcript</strong></label>
      <textarea
        id="transcript"
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste transcript here…"
        rows={8}
        style={{ width: '100%', fontFamily: 'inherit', fontSize: 14 }}
        required
        aria-invalid={!!error}
        aria-describedby={error ? 'transcript-error' : undefined}
      />
      <div>
        <button type="submit" disabled={loading || !transcript.trim()}>
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      {error && (
        <div id="transcript-error" style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}
    </form>
  )
})