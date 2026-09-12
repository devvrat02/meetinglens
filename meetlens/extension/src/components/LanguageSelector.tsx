type LanguageSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const languages = ['English', 'Hindi', 'Spanish'];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <label className="language-selector">
      <span>Language</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Language selector">
        {languages.map((language) => (
          <option key={language} value={language}>{language}</option>
        ))}
      </select>
    </label>
  );
}
