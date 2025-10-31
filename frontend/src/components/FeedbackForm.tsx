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
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Is the classification correct?
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onFeedback(true)}
          disabled={!enabled}
          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Correct
        </button>
        <button
          type="button"
          onClick={() => onFeedback(false)}
          disabled={!enabled}
          className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Wrong
        </button>
      </div>
    </div>
  )
})