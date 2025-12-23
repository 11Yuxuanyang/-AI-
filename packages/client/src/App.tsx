import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { CanvasEditor } from './components/CanvasEditor';
import { Project } from './types';
import * as ProjectService from './services/projectService';

export default function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [route, setRoute] = useState<string>('');

  // 解析路由
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // 去掉 #
      setRoute(hash);

      // 如果是项目页面，加载项目
      if (hash.startsWith('/project/')) {
        const projectId = hash.replace('/project/', '');
        const project = ProjectService.getProjects().find(p => p.id === projectId);
        if (project) {
          setCurrentProject(project);
        } else {
          // 项目不存在，回到首页
          window.location.hash = '';
        }
      } else {
        setCurrentProject(null);
      }
    };

    // 初始化
    handleHashChange();

    // 监听路由变化
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 打开项目 - 在新标签页打开
  const handleOpenProject = (project: Project) => {
    window.open(`${window.location.origin}${window.location.pathname}#/project/${project.id}`, '_blank');
  };

  // 创建新项目 - 在新标签页打开
  const handleCreateProject = () => {
    const newProject = ProjectService.createProject();
    window.open(`${window.location.origin}${window.location.pathname}#/project/${newProject.id}`, '_blank');
  };

  // 返回首页
  const handleBack = () => {
    window.location.hash = '';
  };

  // 渲染编辑器页面
  if (route.startsWith('/project/') && currentProject) {
    return (
      <CanvasEditor
        key={currentProject.id}
        project={currentProject}
        onBack={handleBack}
      />
    );
  }

  // 渲染首页
  return (
    <HomePage
      onOpenProject={handleOpenProject}
      onCreateProject={handleCreateProject}
    />
  );
}
