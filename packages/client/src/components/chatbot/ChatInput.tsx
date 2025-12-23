import React, { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Globe, X, Loader2 } from 'lucide-react';
import { ChatAttachment } from '@/types';

interface ChatInputProps {
  onSend: (content: string, attachments: ChatAttachment[]) => void;
  onWebSearchToggle: (enabled: boolean) => void;
  webSearchEnabled: boolean;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onWebSearchToggle,
  webSearchEnabled,
  isLoading,
  disabled,
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 自动调整高度
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, []);

  const handleSubmit = () => {
    if (!content.trim() && attachments.length === 0) return;
    if (isLoading || disabled) return;

    onSend(content.trim(), attachments);
    setContent('');
    setAttachments([]);

    // 重置高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'text/plain', 'application/pdf'];

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过10MB限制`);
        continue;
      }

      if (!allowedTypes.includes(file.type)) {
        alert(`不支持的文件类型: ${file.type}`);
        continue;
      }

      const content = await readFileAsBase64(file);
      const attachment: ChatAttachment = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        content,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };

      setAttachments((prev) => [...prev, attachment]);
    }

    // 清空 input
    e.target.value = '';
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const attachment = prev.find((a) => a.id === id);
      if (attachment?.previewUrl) {
        URL.revokeObjectURL(attachment.previewUrl);
      }
      return prev.filter((a) => a.id !== id);
    });
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative group">
              {attachment.type.startsWith('image/') ? (
                <img
                  src={attachment.previewUrl}
                  alt={attachment.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg border border-gray-200 flex items-center justify-center bg-gray-50">
                  <span className="text-xs text-gray-500 text-center px-1 truncate">
                    {attachment.name}
                  </span>
                </div>
              )}
              <button
                onClick={() => removeAttachment(attachment.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading || disabled}
          className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.txt,.pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Web Search Toggle */}
        <button
          onClick={() => onWebSearchToggle(!webSearchEnabled)}
          disabled={isLoading || disabled}
          className={`
            flex-shrink-0 p-2 rounded-lg transition-colors disabled:opacity-50
            ${webSearchEnabled
              ? 'text-primary bg-primary/10'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}
          `}
          title={webSearchEnabled ? '联网搜索已开启' : '开启联网搜索'}
        >
          <Globe size={20} />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            disabled={isLoading || disabled}
            rows={1}
            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-50 disabled:text-gray-400"
            style={{ minHeight: '44px', maxHeight: '150px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || disabled || (!content.trim() && attachments.length === 0)}
          className="flex-shrink-0 p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </div>
    </div>
  );
};
