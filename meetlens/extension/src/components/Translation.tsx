type TranslationProps = {
  text: string;
  isLoading: boolean;
};

export function Translation({ text, isLoading }: TranslationProps) {
  return (
    <div className="translation-box">
      {isLoading ? <div className="inline-status">Translating...</div> : null}
      <p>{text || 'Translation will appear here.'}</p>
    </div>
  );
}
