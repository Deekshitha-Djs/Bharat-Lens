import React from 'react';

const CATEGORIES = [
  { id: 1, label: "Police Issues", text: "Police stopped me and asked to check my phone. Is that legal?" },
  { id: 2, label: "Landlord / Rent", text: "My landlord is not returning my deposit after I moved out. What can I do?" },
  { id: 3, label: "Workplace Issues", text: "My company fired me without any notice. What are my rights?" },
  { id: 4, label: "Cyber Crime", text: "Someone scammed me online and took money from my account." },
  { id: 5, label: "Women Safety", text: "I am facing harassment at my workplace. How can I file a complaint?" }
];

export default function CategoryCards({ onSelect }) {
  return (
    <div className="categories">
      {CATEGORIES.map(cat => (
        <button 
          key={cat.id} 
          className="category-card"
          onClick={() => onSelect(cat.text)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
