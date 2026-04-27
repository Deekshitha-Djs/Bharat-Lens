import React from 'react';
import { Scale, ShieldCheck, ListChecks } from 'lucide-react';

export default function ResultCard({ result }) {
  if (!result) return null;

  // Assuming result is already structured object parsed from Gemini text response
  // Or it could be raw text that we need to format. Let's assume structured for clean UI.
  
  return (
    <div className="result-section">
      <div className="result-card">
        
        {result.relevantLaw && (
          <div>
            <h3 className="result-section-title">
              <Scale size={24} color="var(--primary-saffron)" />
              Relevant Law
            </h3>
            <p className="result-text">{result.relevantLaw}</p>
          </div>
        )}

        {result.yourRights && result.yourRights.length > 0 && (
          <div>
            <h3 className="result-section-title">
              <ShieldCheck size={24} color="var(--primary-blue)" />
              Your Rights
            </h3>
            <ul className="result-list">
              {result.yourRights.map((right, index) => (
                <li key={index}>{right}</li>
              ))}
            </ul>
          </div>
        )}

        {result.actionSteps && result.actionSteps.length > 0 && (
          <div>
            <h3 className="result-section-title">
              <ListChecks size={24} color="var(--accent-green)" />
              What You Can Do
            </h3>
            <ol className="numbered-list">
              {result.actionSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
