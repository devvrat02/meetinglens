import type { DefinitionResult } from '../types';

type DefinitionPanelProps = {
  word: string;
  definition: DefinitionResult | null;
  loading: boolean;
};

export function DefinitionPanel({ word, definition, loading }: DefinitionPanelProps) {
  if (loading) {
    return <div className="definition-box">Loading definition...</div>;
  }

  if (!definition) {
    return <div className="definition-box">Click a technical word to understand it.</div>;
  }

  return (
    <div className="definition-box">
      <h4>{word.toUpperCase()}</h4>
      <div className="definition-section">
        <strong>Definition:</strong>
        <p>{definition.definition}</p>
      </div>
      <div className="definition-section">
        <strong>Simple explanation:</strong>
        <p>{definition.simpleExplanation}</p>
      </div>
      <div className="definition-section">
        <strong>Context:</strong>
        <p>{definition.contextMeaning}</p>
      </div>
    </div>
  );
}
