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
      className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 md:p-4 ${
        sender === 'user'
          ? 'bg-purple-500 text-white'
          : isCrisis
          ? 'bg-red-50 border-2 border-red-200 text-gray-800'
          : isError
          ? 'bg-orange-50 border border-orange-200 text-gray-800'
          : 'bg-white text-gray-800 shadow-sm'
      }`}
    >
      {isCrisis && (
        <div className="flex items-center gap-2 mb-2 text-red-600">
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span className="font-medium text-sm md:text-base">Crisis Support Available</span>
        </div>
      )}
      {sender === 'user' ? (
        <p className="text-sm md:text-base break-words">{content}</p>
      ) : (
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 md:mb-3 last:mb-0 text-sm md:text-base break-words">{children}</p>,
            ul: ({ children }) => <ul className="mb-2 md:mb-3 ml-3 md:ml-4 list-disc text-sm md:text-base">{children}</ul>,
            ol: ({ children }) => <ol className="mb-2 md:mb-3 ml-3 md:ml-4 list-decimal text-sm md:text-base">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            h1: ({ children }) => <h1 className="text-lg md:text-xl font-bold mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base md:text-lg font-bold mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm md:text-base font-bold mb-2">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-3 md:pl-4 my-2 italic text-sm md:text-base">
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