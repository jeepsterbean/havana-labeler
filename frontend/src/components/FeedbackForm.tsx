// frontend/src/components/FeedbackForm.tsx
import { memo, useId, useState } from 'react'

export type FeedbackFormProps = {
  enabled: boolean
  onFeedback: (isCorrect: boolean) => void
}

const classificationOptions = [
  { value: "correct", label: "Correct Prediction" },
  { value: "voice_interested", label: "Interested" },
  { value: "voice_not_interested", label: "Not Interested" },
  { value: "voice_immediate_hangup", label: "Immediate Hangup" },
  { value: "voice_wrong_number", label: "Wrong Number" },
  { value: "voice_no_action", label: "No Action" },
  { value: "voice_wants_call_back", label: "Wants Call Back" },
  { value: "voice_wants_email_follow_up", label: "Email Follow-up" },
  { value: "voice_wants_whatsapp_sms_follow_up", label: "WhatsApp/SMS Follow-up" },
  { value: "voice_voice_mail", label: "Voice Mail" },
  { value: "voice_unknown", label: "Unknown" },
];

/**
 * Renders feedback controls to mark the classification as correct or wrong.
 */
export const FeedbackForm = memo(function FeedbackForm({
  enabled,
}: FeedbackFormProps) {
  const [selection, setSelection] = useState<string>('')
  const groupName = useId()
  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
        Is the classification correct?
      </div>
      <div role="radiogroup" aria-label="Classification options" className="space-y-2">
        {classificationOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${groupName}-${option.value}`}
              name={`${groupName}-classification`}
              value={option.value}
              checked={selection === option.value}
              onChange={() => setSelection(option.value)}
              disabled={!enabled}
             className="h-4 w-4 accent-emerald-600 disabled:opacity-50"
           />
           <label
             htmlFor={`${groupName}-${option.value}`}
             className="cursor-pointer select-none"
           >
             {option.label}
           </label>
         </div>
        ))}
      </div>
    </div>
  )
})