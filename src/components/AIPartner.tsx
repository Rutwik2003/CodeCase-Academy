import React, { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

interface AIPartnerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentHint: string;
  onSendMessage: (message: string) => void;
  messages: Array<{ type: 'user' | 'ai'; content: string; timestamp: Date }>;
}

export const AIPartner: React.FC<AIPartnerProps> = ({
  isOpen,
  onToggle,
  currentHint,
  onSendMessage,
  messages
}) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* AI Partner Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <div className="flex items-center justify-center">
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      </button>

      {/* AI Partner Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Detective Claude</h3>
                <p className="text-xs opacity-90">Your AI Partner</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {/* Welcome Message */}
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  🕵️ Hello, Detective! I'm Claude, your AI coding partner. I analyze your code in real-time and provide specific guidance!
                  
                  **Quick Tips:**
                  • Watch the blue AI suggestion bar above the editor
                  • Use "Smart Snippets" for professional code templates  
                  • Ask me specific questions like "How do I center elements?" or "What's wrong with my navigation?"
                  
                  Ready to solve this case together? 🚀
                </p>
              </div>
            </div>
            
            {/* Current Hint */}
            {currentHint && (
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-3 max-w-xs">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">💡 Hint:</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">{currentHint}</p>
                </div>
              </div>
            )}
            
            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-blue-100 dark:bg-blue-900'
                }`}>
                  {message.type === 'user' ? (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">U</span>
                  ) : (
                    <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className={`rounded-lg p-3 max-w-xs ${
                  message.type === 'user'
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about HTML/CSS..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};