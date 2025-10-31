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
          {reasoning}
        </div>
      </div>
    </div>
  )
})