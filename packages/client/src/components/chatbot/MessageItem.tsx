import React from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { ChatMessage } from '@/types';

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 简单的 Markdown 渲染
  const renderContent = (content: string) => {
    // 处理代码块
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3);
        const firstLine = code.split('\n')[0];
        const language = firstLine.match(/^\w+$/) ? firstLine : '';
        const codeContent = language ? code.slice(firstLine.length + 1) : code;

        return (
          <pre key={index} className="bg-gray-800 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-sm">
            <code>{codeContent.trim()}</code>
          </pre>
        );
      }

      // 处理普通文本
      return (
        <div key={index} className="whitespace-pre-wrap">
          {part.split('\n').map((line, lineIndex) => {
            // 处理标题
            if (line.startsWith('## ')) {
              return <h2 key={lineIndex} className="text-lg font-bold mt-4 mb-2">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={lineIndex} className="text-base font-bold mt-3 mb-1">{line.slice(4)}</h3>;
            }
            // 处理粗体
            const boldProcessed = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            // 处理列表
            if (line.startsWith('- ')) {
              return (
                <div key={lineIndex} className="flex gap-2 ml-2">
                  <span>•</span>
                  <span dangerouslySetInnerHTML={{ __html: boldProcessed.slice(2) }} />
                </div>
              );
            }
            if (/^\d+\.\s/.test(line)) {
              const match = line.match(/^(\d+)\.\s(.*)$/);
              if (match) {
                return (
                  <div key={lineIndex} className="flex gap-2 ml-2">
                    <span>{match[1]}.</span>
                    <span dangerouslySetInnerHTML={{ __html: match[2].replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                );
              }
            }
            // 处理分隔线
            if (line === '---') {
              return <hr key={lineIndex} className="my-3 border-gray-200" />;
            }
            // 普通段落
            if (line.trim()) {
              return <p key={lineIndex} className="mb-1" dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
            }
            return <br key={lineIndex} />;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-200`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
      `}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message Content */}
      <div className={`
        flex-1 max-w-[85%] rounded-2xl px-4 py-3
        ${isUser
          ? 'bg-primary text-white rounded-tr-md'
          : 'bg-gray-100 text-gray-800 rounded-tl-md'}
      `}>
        <div className="text-sm leading-relaxed">
          {renderContent(message.content)}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-current animate-pulse ml-0.5" />
          )}
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="relative">
                {attachment.type.startsWith('image/') ? (
                  <img
                    src={attachment.previewUrl || attachment.content}
                    alt={attachment.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2 text-xs">
                    <span>{attachment.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Copy button for assistant messages */}
        {isAssistant && !message.isStreaming && (
          <button
            onClick={handleCopy}
            className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? '已复制' : '复制'}
          </button>
        )}
      </div>
    </div>
  );
};
