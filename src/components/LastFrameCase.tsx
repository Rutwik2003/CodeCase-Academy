import React from 'react';

// TODO: Replace with your actual case logic and UI
const LastFrameCase: React.FC<{ onCaseComplete?: () => void }> = ({ onCaseComplete }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl font-bold mb-4">Last Frame</h1>
      <p className="mb-6 max-w-xl text-center">
        Arjun Shetty, a crime photographer, is found dead in his 1BHK apartment. Police find only a broken coffee cup near the body. Your team is called to investigate his digital and physical traces.<br /><br />
        You are a web detective who fixes Arjun’s broken local files to reveal hidden photos and text clues to find the killer.
      </p>
      <div className="bg-slate-800 rounded-lg p-6 mb-6 max-w-lg w-full">
        <strong>Gameplay:</strong>
        <ul className="list-disc pl-6 mt-2 text-slate-300 text-left">
          <li>Click interactive images (laptop, books, phone) to open HTML/CSS debug micro-puzzles revealing hidden clues.</li>
          <li>Fix hidden/misaligned containers to reveal photos and messages.</li>
          <li>Progress to interrogation and solve the case!</li>
        </ul>
      </div>
      <button
        className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-semibold transition-colors"
        onClick={onCaseComplete}
      >
        Mark Case Complete (Demo)
      </button>
    </div>
  );
};

export default LastFrameCase;
