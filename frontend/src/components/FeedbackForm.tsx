// frontend/src/components/FeedbackForm.tsx
import { memo } from 'react'

export type FeedbackFormProps = {
  enabled: boolean
  onFeedback: (isCorrect: boolean) => void
}

/**
 * Renders feedback controls to mark the classification as correct or wrong.
 */
export const FeedbackForm = memo(function FeedbackForm({
  enabled,
  onFeedback
}: FeedbackFormProps) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        Is the classification correct?
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => onFeedback(true)}
          disabled={!enabled}
        >
          Correct
        </button>
        <button
          type="button"
          onClick={() => onFeedback(false)}
          disabled={!enabled}
        >
          Wrong
        </button>
      </div>
    </div>
  )
})