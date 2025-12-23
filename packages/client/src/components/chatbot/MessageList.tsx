import React, { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatMessage } from '@/types';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <MessageCircle size={32} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">开始对话</h3>
        <p className="text-sm text-center max-w-[250px]">
          我是剧本创作助手，可以帮你写剧本、设计场景、编写对白
        </p>
        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-[300px]">
          {['写一个剧本大纲', '设计一个场景', '写一段对白', '创建人物设定'].map((suggestion) => (
            <button
              key={suggestion}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
