import React, { useState } from 'react';
import InputBox from './components/InputBox';
import CategoryCards from './components/CategoryCards';
import ResultCard from './components/ResultCard';
import { AlertTriangle } from 'lucide-react';

// A helper to parse the structured text from Gemini into an object
const parseGeminiResponse = (text) => {
  const sections = {
    relevantLaw: '',
    yourRights: [],
    actionSteps: []
  };

  try {
    const lines = text.split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const tLine = line.trim();
      if (!tLine) return;

      if (tLine.toLowerCase().includes('relevant law')) {
        currentSection = 'law';
      } else if (tLine.toLowerCase().includes('your rights')) {
        currentSection = 'rights';
      } else if (tLine.toLowerCase().includes('what you can do') || tLine.toLowerCase().includes('practical steps')) {
        currentSection = 'steps';
      } else {
        // Parse content based on current section
        if (currentSection === 'law') {
          sections.relevantLaw += tLine + ' ';
        } else if (currentSection === 'rights') {
          // Remove bullet points
          const cleaned = tLine.replace(/^[-*•\d.]\s*/, '');
          if (cleaned) sections.yourRights.push(cleaned);
        } else if (currentSection === 'steps') {
          const cleaned = tLine.replace(/^[-*•\d.]\s*/, '');
          if (cleaned) sections.actionSteps.push(cleaned);
        }
      }
    });
  } catch (e) {
    console.error("Error parsing response", e);
    // Fallback: just put everything in relevant law if parsing fails completely
    sections.relevantLaw = text;
  }

  return sections;
};

const EMERGENCY_KEYWORDS = ['threatening', 'harassment', 'violence', 'emergency', 'kill', 'suicide', 'abuse', 'rape'];

function App() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);

  const checkEmergency = (text) => {
    const lowerText = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const handleAnalyze = async (overrideQuery) => {
    const textToAnalyze = typeof overrideQuery === 'string' ? overrideQuery : query;
    if (!textToAnalyze.trim()) return;

    setIsEmergency(checkEmergency(textToAnalyze));
    setIsLoading(true);
    setResult(null);

    try {
      // Calls our secure Express backend via the Vite proxy (/api → localhost:5000)
      // The API key never touches the browser — it lives in backend/.env
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToAnalyze, language })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.text) {
        setResult(parseGeminiResponse(data.text));
      } else {
        throw new Error('Invalid response format from backend');
      }

    } catch (error) {
      console.error('Analysis Error:', error);
      alert(`Failed to get legal guidance: ${error.message}\n\nMake sure the backend is running:\n  cd backend && npm install && npm start`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>BharatLens</h1>
        <p>AI Legal Awareness for India</p>
      </header>

      <div className="controls">
        <select 
          className="lang-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Hindi">हिंदी (Hindi)</option>
          <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
        </select>
      </div>

      <CategoryCards onSelect={(text) => setQuery(text)} />

      {isEmergency && (
        <div className="emergency-alert">
          <AlertTriangle className="emergency-icon" size={28} />
          <div className="emergency-content">
            <h3>Emergency Detected</h3>
            <p>If you are in immediate danger, please call the National Emergency Number: <strong>112</strong> or Police: <strong>100</strong>. Women Helpline: <strong>1091</strong>.</p>
          </div>
        </div>
      )}

      <InputBox 
        value={query}
        onChange={setQuery}
        onSubmit={handleAnalyze}
        isLoading={isLoading}
        language={language}
      />

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Analyzing Indian Law...</div>
        </div>
      )}

      {!isLoading && result && (
        <ResultCard result={result} />
      )}
    </div>
  );
}

export default App;
