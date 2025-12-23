import React from 'react';
import { Sparkles, Loader2, ChevronUp, ChevronDown } from 'lucide-react';

interface ScriptInputAreaProps {
  script: string;
  onScriptChange: (script: string) => void;
  onParse: () => void;
  isParsing: boolean;
  hasScenes: boolean;
}

export function ScriptInputArea({
  script,
  onScriptChange,
  onParse,
  isParsing,
  hasScenes,
}: ScriptInputAreaProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(hasScenes);

  return (
    <div className={`border-b border-gray-200 transition-all ${isCollapsed ? '' : 'flex-shrink-0'}`}>
      {/* Collapse Toggle */}
      <button
        className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:bg-gray-50 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="font-medium">剧本输入</span>
        {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="px-4 pb-3">
          <textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            placeholder="在这里输入你的剧本或故事梗概...&#10;&#10;每个段落将被解析为一个独立的镜头。&#10;例如：&#10;&#10;清晨，阳光透过窗帘洒进房间。主角缓缓睁开眼睛。&#10;&#10;主角走进厨房，开始准备早餐。咖啡机发出轻柔的声音。"
            className="w-full h-32 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 placeholder:text-gray-400"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {script.length > 0 ? `${script.length} 字符` : '支持中英文剧本'}
            </span>
            <button
              onClick={onParse}
              disabled={isParsing || !script.trim()}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isParsing || !script.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-violet-500 text-white hover:bg-violet-600 shadow-sm hover:shadow'
              }`}
            >
              {isParsing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  解析中...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  AI 智能解析
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
