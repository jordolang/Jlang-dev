import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface HighlightedSegment {
  text: string
  isHighlight: boolean
}

/**
 * Highlights matching text segments in a string based on a search query
 * @param text - The text to search within
 * @param query - The search query to highlight
 * @returns Array of text segments with highlight flags
 */
export function highlightText(text: string, query: string): HighlightedSegment[] {
  if (!query || !text) {
    return [{ text, isHighlight: false }]
  }

  const segments: HighlightedSegment[] = []
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()

  let lastIndex = 0
  let index = lowerText.indexOf(lowerQuery)

  while (index !== -1) {
    // Add non-highlighted text before the match
    if (index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, index),
        isHighlight: false
      })
    }

    // Add highlighted match
    segments.push({
      text: text.substring(index, index + query.length),
      isHighlight: true
    })

    lastIndex = index + query.length
    index = lowerText.indexOf(lowerQuery, lastIndex)
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isHighlight: false
    })
  }

  return segments
} 