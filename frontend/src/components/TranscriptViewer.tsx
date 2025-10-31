// frontend/src/components/TranscriptViewer.tsx
import { memo } from 'react'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

export type TranscriptViewerProps = {
  transcript: string
  reasoning: string
  classification: string
}

/**
 * Displays the input transcript and the engine's reasoning.
 */
export const TranscriptViewer = memo(function TranscriptViewer({
  transcript,
  reasoning,
  classification
}: TranscriptViewerProps) {
  
  const [hoveredCitations, setHoveredCitations] = useState<string[]>([]);

  const highlightText = (text: string, citations: string[]) => {
    if (citations.length === 0) return text;

    let result = text;
    const highlights: Array<{ start: number; end: number; citation: string }> = [];

    // Find all occurrences of citations
    citations.forEach(citation => {
      let index = result.indexOf(citation);
      while (index !== -1) {
        highlights.push({ start: index, end: index + citation.length, citation });
        index = result.indexOf(citation, index + 1);
      }
    });

    // Sort by start position
    highlights.sort((a, b) => a.start - b.start);

    // Build the highlighted text
    const parts: JSX.Element[] = [];
    let lastEnd = 0;

    highlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.start > lastEnd) {
        parts.push(<span key={`text-${idx}`}>{result.substring(lastEnd, highlight.start)}</span>);
      }
      // Add highlighted text
      parts.push(
        <mark key={`mark-${idx}`} className="bg-primary/20 rounded px-1">
          {result.substring(highlight.start, highlight.end)}
        </mark>
      );
      lastEnd = highlight.end;
    });

    // Add remaining text
    if (lastEnd < result.length) {
      parts.push(<span key="text-end">{result.substring(lastEnd)}</span>);
    }

    return <>{parts}</>;
  };  
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-500">Classification</CardTitle>
        </CardHeader>
        <CardContent>
          {classification ? (
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              {classification}
            </span>
          ) : (
            <div className="h-7" />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-500">Input Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground leading-relaxed">
              {hoveredCitations.length > 0 ? highlightText(transcript, hoveredCitations) : transcript}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-500">Reasoning</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
              {reasoning.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-default"
                  onMouseEnter={() => setHoveredCitations(item.citations)}
                  onMouseLeave={() => setHoveredCitations([])}
                >
                  <p className="text-sm leading-relaxed">{item.reasoning_text}</p>
                  {item.citations.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {item.citations.length} citation{item.citations.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})