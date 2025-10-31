// frontend/src/components/TranscriptViewer.tsx
import { memo } from 'react'

export type TranscriptViewerProps = {
  transcript: string
  reasoning: string
}

/**
 * Displays the input transcript and the engine's reasoning.
 */
export const TranscriptViewer = memo(function TranscriptViewer({
  transcript,
  reasoning
}: TranscriptViewerProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Input Transcript</div>
        <div className="min-h-[120px] whitespace-pre-wrap text-gray-800">{transcript}</div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Reasoning</div>
        <div className="min-h-[120px] whitespace-pre-wrap text-gray-800">{reasoning}</div>
      </div>
    </div>
  )
})