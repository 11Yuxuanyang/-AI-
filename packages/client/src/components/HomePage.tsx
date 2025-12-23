import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, LogOut, Star, Trash2 } from 'lucide-react';
import { Project } from '../types';
import * as ProjectService from '../services/projectService';
import { LoginModal } from './LoginModal';

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface HomePageProps {
  onOpenProject: (project: Project) => void;
  onCreateProject: () => void;
}

export function HomePage({ onOpenProject, onCreateProject }: HomePageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 加载项目列表
  useEffect(() => {
    setProjects(ProjectService.getProjects());
  }, []);

  // 加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个项目吗？')) {
      ProjectService.deleteProject(id);
      setProjects(ProjectService.getProjects());
    }
  };

  // 格式化相对时间
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚编辑';
    if (minutes < 60) return `${minutes} 分钟前编辑`;
    if (hours < 24) return `${hours} 小时前编辑`;
    if (days < 30) return `${days} 天前编辑`;
    return `${Math.floor(days / 30)} 个月前编辑`;
  };

  // 渲染图片拼贴预览
  const renderImageCollage = (project: Project) => {
    const images = project.items.filter(item => item.type === 'image').map(item => item.src);
    const count = images.length;

    if (count === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 shadow-sm" />
        </div>
      );
    }

    if (count === 1) {
      return (
        <img src={images[0]} alt="" className="w-full h-full object-cover" />
      );
    }

    if (count === 2) {
      return (
        <div className="absolute inset-0 flex gap-0.5">
          <img src={images[0]} alt="" className="w-1/2 h-full object-cover" />
          <img src={images[1]} alt="" className="w-1/2 h-full object-cover" />
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="absolute inset-0 flex gap-0.5">
          <img src={images[0]} alt="" className="w-1/2 h-full object-cover" />
          <div className="w-1/2 h-full flex flex-col gap-0.5">
            <img src={images[1]} alt="" className="w-full h-1/2 object-cover" />
            <img src={images[2]} alt="" className="w-full h-1/2 object-cover" />
          </div>
        </div>
      );
    }

    // 4张及以上：左边大图，右边3个小图（最后一个可能有遮罩显示更多数量）
    return (
      <div className="absolute inset-0 flex gap-0.5">
        <img src={images[0]} alt="" className="w-1/2 h-full object-cover" />
        <div className="w-1/2 h-full flex flex-col gap-0.5">
          <img src={images[1]} alt="" className="w-full h-1/3 object-cover" />
          <img src={images[2]} alt="" className="w-full h-1/3 object-cover" />
          <div className="w-full h-1/3 relative">
            <img src={images[3]} alt="" className="w-full h-full object-cover" />
            {count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-medium text-sm">+{count - 4}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-100 selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold tracking-tight text-gray-900">Mixboard</span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              // 已登录 - 显示用户头像和菜单
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <span className="text-sm text-gray-700 font-medium hidden sm:block">
                    {user.nickname}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        退出登录
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // 未登录 - 显示登录按钮
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors text-sm font-medium"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center mb-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center tracking-tight leading-tight">
            欢迎来到灵感屋
          </h1>
          <p className="text-lg text-gray-500 font-normal text-center max-w-xl leading-relaxed">
            探索、延伸、重塑你的创意
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium text-sm"
          >
            <Plus size={18} />
            新建项目
          </button>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors">
              最近项目
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {projects.length === 0 && (
            <div
              onClick={onCreateProject}
              className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white border border-gray-100 flex items-center justify-center mb-4 transition-colors">
                <Plus size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-gray-500 font-medium text-sm">开始你的第一个创作</p>
            </div>
          )}

          {projects.map(project => {
            const imageCount = project.items.filter(item => item.type === 'image').length;

            return (
              <div
                key={project.id}
                onClick={() => onOpenProject(project)}
                className="group flex flex-col gap-2 cursor-pointer"
              >
                {/* Card Preview - 图片拼贴 */}
                <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden transition-all duration-200 group-hover:shadow-lg">
                  {renderImageCollage(project)}

                  {/* 悬停时显示的操作按钮 */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // 收藏功能待实现
                      }}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-600 hover:text-gray-900 transition-colors shadow-sm"
                    >
                      <Star size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, project.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-600 hover:text-red-500 transition-colors shadow-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-0.5">
                  <h3 className="font-medium text-gray-900 text-sm leading-tight mb-0.5">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-normal">
                    {formatRelativeTime(project.updatedAt)}
                    {imageCount > 0 && ` · ${imageCount} 张图片`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
