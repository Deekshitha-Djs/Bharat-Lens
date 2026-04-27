import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function InputBox({ value, onChange, onSubmit, isLoading, language }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
           const newText = value ? `${value} ${finalTranscript}` : finalTranscript;
           finalTranscriptRef.current = newText;
           onChange(newText);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Automatically submit when speech ends and we have recorded text
        if (finalTranscriptRef.current) {
          onSubmit(finalTranscriptRef.current);
          finalTranscriptRef.current = ''; // reset after submitting
        }
      };
    }
  }, [value, onChange, onSubmit]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        // Map selected language to Speech API locale
        let locale = 'en-IN';
        if (language === 'Hindi') locale = 'hi-IN';
        else if (language === 'Kannada') locale = 'kn-IN';
        
        recognitionRef.current.lang = locale;
        finalTranscriptRef.current = ''; // Reset for new session
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Your browser doesn't support voice input.");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="input-section">
      <div className="input-wrapper">
        <textarea
          placeholder="Describe your legal situation..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        
        <button 
          className={`mic-btn inside-input ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          type="button"
          title={isListening ? "Stop listening" : "Speak your situation"}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>

      <div className="submit-wrapper">
        <button 
          className="submit-btn full-width"
          onClick={() => onSubmit()}
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Get Legal Guidance'}
        </button>
      </div>
    </div>
  );
}
