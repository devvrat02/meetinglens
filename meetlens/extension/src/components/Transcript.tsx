import type { TranscriptSegment } from '../types';

type TranscriptProps = {
  segments: TranscriptSegment[];
  onWordClick: (word: string) => void;
};

const COMMON_WORDS = new Set(['the', 'a', 'an', 'is', 'are', 'we', 'to', 'of', 'and', 'in', 'on']);

function renderWords(text: string, onWordClick: (word: string) => void) {
  return text.split(/\s+/).map((token, index) => {
    const clean = token.replace(/[^a-zA-Z-]/g, '').toLowerCase();
    const clickable = clean && !COMMON_WORDS.has(clean) && clean.length > 2;

    if (!clickable) {
      return <span key={`${token}-${index}`}> {token}</span>;
    }

    return (
      <button
        key={`${token}-${index}`}
        type="button"
        className="word-button"
        onClick={() => onWordClick(clean)}
        aria-label={`Define ${clean}`}
      >
        {token}
      </button>
    );
  });
}

export function Transcript({ segments, onWordClick }: TranscriptProps) {
  return (
    <div className="transcript-list">
      {segments.length === 0 ? (
        <p className="empty-state">No transcript yet.</p>
      ) : (
        segments.map((segment) => (
          <div key={segment.id} className="segment">
            <div className="segment-speaker">{segment.speaker || 'Speaker 1'}</div>
            <div className="segment-text">{renderWords(segment.text, onWordClick)}</div>
          </div>
        ))
      )}
    </div>
  );
}
