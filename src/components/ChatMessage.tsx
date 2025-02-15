import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  isCrisis?: boolean;
  isError?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  sender,
  isCrisis,
  isError
}) => {
  return (
    <div
      className={`max-w-[80%] rounded-lg p-4 ${
        sender === 'user'
          ? 'bg-purple-500 text-white'
          : isCrisis
          ? 'bg-red-50 border-2 border-red-200 text-gray-800'
          : isError
          ? 'bg-orange-50 border border-orange-200 text-gray-800'
          : 'bg-white text-gray-800'
      }`}
    >
      {isCrisis && (
        <div className="flex items-center gap-2 mb-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Crisis Support Available</span>
        </div>
      )}
      {sender === 'user' ? (
        <p>{content}</p>
      ) : (
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="mb-3 ml-4 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic">
                {children}
              </blockquote>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default ChatMessage;