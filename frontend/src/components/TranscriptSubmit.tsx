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
    <form onSubmit={onSubmit} className="grid gap-3">
      <label htmlFor="transcript" className="text-sm font-medium text-gray-900">Transcript</label>
      <textarea
        id="transcript"
        value={transcript}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste transcript here…"
        rows={8}
        className="w-full rounded-md border border-gray-300 bg-white p-3 text-sm shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
        aria-invalid={!!error}
        aria-describedby={error ? 'transcript-error' : undefined}
      />
      <div>
        <button
          type="submit"
          disabled={loading || !transcript.trim()}
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      {error && (
        <div id="transcript-error" className="text-sm text-red-600">
          Error: {error}
        </div>
      )}
    </form>
  )
})