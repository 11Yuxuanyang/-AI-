import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, ChevronDown, Trash2, Copy, Edit3, LogOut } from 'lucide-react';
import { Project } from '../types';
import * as ProjectService from '../services/projectService';
import { LoginModal } from './LoginModal';

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface HomePageProps {
  onOpenProject?: (project: Project) => void;
  onCreateProject?: () => void;
}

export function HomePage(_props: HomePageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'name'>('recent');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setProjects(ProjectService.getProjects());
    // 检查本地存储的用户
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
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
  };

  const handleOpenProject = (project: Project) => {
    window.location.hash = `/project/${project.id}`;
  };

  const handleCreateProject = () => {
    const newProject = ProjectService.createProject();
    window.location.hash = `/project/${newProject.id}`;
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个项目吗？')) {
      ProjectService.deleteProject(id);
      setProjects(ProjectService.getProjects());
    }
    setActiveMenu(null);
  };

  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    ProjectService.duplicateProject(id);
    setProjects(ProjectService.getProjects());
    setActiveMenu(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectPreview = (project: Project) => {
    const image = project.items.find(item => item.type === 'image');
    return image?.src || project.thumbnail;
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.updatedAt - a.updatedAt;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-14 px-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gray-900">三傻大闹AI圈</span>
          <span className="px-2 py-0.5 text-[10px] font-medium text-gray-500 border border-gray-300 rounded-full uppercase tracking-wide">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.nickname}
                    className="w-9 h-9 rounded-full ring-2 ring-gray-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center text-white font-medium text-sm ring-2 ring-violet-200">
                    {user.nickname.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.nickname}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              登录
            </button>
          )}
        </div>
      </header>

      {/* Hero Section - Geometric Editorial Style */}
      <div className="relative pt-20 pb-16 px-6 overflow-hidden bg-white">
        {/* Animated Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large hollow circle - top right */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 border-[3px] border-gray-900 rounded-full opacity-[0.08]"
            style={{ animation: 'spin 60s linear infinite' }}
          />

          {/* Solid black circle - left side */}
          <div
            className="absolute top-1/3 left-[8%] w-4 h-4 bg-gray-900 rounded-full"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          />

          {/* Small hollow circle */}
          <div
            className="absolute top-[20%] right-[15%] w-6 h-6 border-2 border-gray-900 rounded-full opacity-40"
            style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}
          />

          {/* Horizontal line - accent */}
          <div
            className="absolute top-[45%] left-[5%] w-24 h-[2px] bg-gray-900 opacity-20"
            style={{ animation: 'slideIn 1s ease-out' }}
          />

          {/* Cross element */}
          <div className="absolute bottom-[30%] right-[10%] opacity-30">
            <div className="w-8 h-[2px] bg-gray-900" style={{ animation: 'fadeIn 1s ease-out 0.3s both' }} />
            <div className="w-[2px] h-8 bg-gray-900 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'fadeIn 1s ease-out 0.5s both' }} />
          </div>

          {/* Dotted square pattern */}
          <div
            className="absolute bottom-[20%] left-[12%] grid grid-cols-3 gap-2 opacity-20"
            style={{ animation: 'fadeIn 1s ease-out 0.7s both' }}
          >
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
            ))}
          </div>

          {/* Diagonal line */}
          <div
            className="absolute top-[60%] right-[25%] w-16 h-[2px] bg-gray-900 opacity-15 rotate-45"
            style={{ animation: 'slideIn 1s ease-out 0.4s both' }}
          />
        </div>

        {/* Main Content */}
        <div className="relative max-w-4xl mx-auto">
          {/* Eyebrow text */}
          <div
            className="flex items-center justify-center gap-3 mb-6"
            style={{ animation: 'fadeInUp 0.8s ease-out' }}
          >
            <div className="w-8 h-[1px] bg-gray-400" />
            <span className="text-xs font-medium tracking-[0.3em] text-gray-500 uppercase">Canvas Studio</span>
            <div className="w-8 h-[1px] bg-gray-400" />
          </div>

          {/* Main Title - Bold Typography */}
          <h1
            className="text-center mb-6"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.1s both' }}
          >
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              用 AI 画出
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-1">
              <span className="text-gray-900">你的</span>
              <span className="relative inline-block ml-2">
                <span className="text-gray-900">想法</span>
                {/* Underline decoration */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                  style={{ animation: 'drawLine 0.6s ease-out 0.8s both' }}
                >
                  <path
                    d="M0 4 Q25 0, 50 4 T100 4"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-900"
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-center text-lg md:text-xl text-gray-500 font-normal max-w-xl mx-auto leading-relaxed"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
          >
            输入描述，一键生成图片，自由编辑
          </p>

          {/* Decorative element below subtitle */}
          <div
            className="flex items-center justify-center gap-2 mt-8"
            style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}
          >
            <div className="w-2 h-2 bg-gray-900 rounded-full" />
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes drawLine {
            from {
              stroke-dasharray: 200;
              stroke-dashoffset: 200;
            }
            to {
              stroke-dasharray: 200;
              stroke-dashoffset: 0;
            }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>

      {/* Action Bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>新建项目</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-700">{sortBy === 'recent' ? '最近' : '名称'}</span>
            <ChevronDown size={18} className="text-gray-500" />
          </button>

          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => { setSortBy('recent'); setShowSortMenu(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${sortBy === 'recent' ? 'text-violet-600 bg-violet-50' : 'text-gray-700'}`}
                >
                  最近
                </button>
                <button
                  onClick={() => { setSortBy('name'); setShowSortMenu(false); }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${sortBy === 'name' ? 'text-violet-600 bg-violet-50' : 'text-gray-700'}`}
                >
                  名称
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {sortedProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有项目</h3>
            <p className="text-gray-500 mb-6">点击上方按钮创建你的第一个项目</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedProjects.map((project) => {
              const preview = getProjectPreview(project);

              return (
                <div
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className="group relative bg-white border-2 border-gray-100 hover:border-violet-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
                >
                  {/* Card Preview */}
                  <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                    {/* Dot Grid Pattern */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />

                    {/* Preview Image */}
                    {preview && (
                      <img
                        src={preview}
                        alt=""
                        className="absolute inset-0 w-full h-full object-contain p-4"
                      />
                    )}

                    {/* Canvas Icon for empty projects */}
                    {!preview && project.items.length > 0 && (
                      <div className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded shadow-sm flex items-center justify-center">
                        <div className="w-4 h-4 border border-gray-300 rounded-sm" />
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatDate(project.updatedAt)}
                      </p>
                    </div>

                    {/* Menu Button */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === project.id ? null : project.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>

                      {activeMenu === project.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }} />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            <button
                              onClick={(e) => handleDuplicate(e, project.id)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Copy size={16} />
                              复制
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newName = prompt('输入新名称:', project.name);
                                if (newName) {
                                  ProjectService.updateProjectName(project.id, newName);
                                  setProjects(ProjectService.getProjects());
                                }
                                setActiveMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit3 size={16} />
                              重命名
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={(e) => handleDelete(e, project.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              删除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
