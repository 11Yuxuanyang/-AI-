import React, { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

type LoginMethod = 'select' | 'wechat';
type LoginStatus = 'loading' | 'pending' | 'scanned' | 'confirmed' | 'error' | 'expired';

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [method, setMethod] = useState<LoginMethod>('select');
  const [status, setStatus] = useState<LoginStatus>('loading');
  const [qrcodeUrl, setQrcodeUrl] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [configured, setConfigured] = useState<boolean>(true);

  // 重置状态
  const resetState = useCallback(() => {
    setMethod('select');
    setStatus('loading');
    setQrcodeUrl('');
    setState('');
    setError('');
  }, []);

  // 获取微信二维码
  const fetchWechatQrcode = useCallback(async () => {
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/wechat/qrcode');
      const data = await res.json();

      if (data.success) {
        setQrcodeUrl(data.data.qrcodeUrl);
        setState(data.data.state);
        setConfigured(data.data.configured);
        setStatus('pending');
      } else {
        setError(data.error || '获取二维码失败');
        setStatus('error');
      }
    } catch (e) {
      setError('网络错误，请重试');
      setStatus('error');
    }
  }, []);

  // 选择微信登录
  const handleSelectWechat = () => {
    setMethod('wechat');
    fetchWechatQrcode();
  };

  // 返回选择页
  const handleBack = () => {
    setMethod('select');
    setStatus('loading');
  };

  // 轮询检查登录状态
  useEffect(() => {
    if (!isOpen || method !== 'wechat' || !state || status === 'confirmed' || status === 'error' || status === 'expired') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/wechat/status/${state}`);
        const data = await res.json();

        if (!data.success) {
          setStatus('expired');
          setError(data.error || '登录已过期');
          clearInterval(pollInterval);
          return;
        }

        const newStatus = data.data.status;

        if (newStatus === 'confirmed' && data.data.user) {
          setStatus('confirmed');
          clearInterval(pollInterval);

          // 保存用户信息到 localStorage
          localStorage.setItem('user', JSON.stringify(data.data.user));

          // 通知父组件
          setTimeout(() => {
            onLoginSuccess(data.data.user);
            onClose();
            resetState();
          }, 1500);
        } else if (newStatus === 'scanned') {
          setStatus('scanned');
        }
      } catch (e) {
        console.error('轮询登录状态失败:', e);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [isOpen, method, state, status, onLoginSuccess, onClose, resetState]);

  // 关闭时重置状态
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  // 处理 URL 回调（用户扫码后重定向回来）
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const loginResult = urlParams.get('login');
    const callbackState = urlParams.get('state');

    if (loginResult === 'success' && callbackState) {
      // 清理 URL 参数
      window.history.replaceState({}, '', window.location.pathname);

      // 设置状态并触发轮询
      setMethod('wechat');
      setState(callbackState);
      setStatus('pending');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 弹窗 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* 返回按钮 */}
        {method !== 'select' && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="p-8">
          {method === 'select' ? (
            // 登录方式选择页
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">登录</h2>
                <p className="text-gray-500">选择登录方式继续</p>
              </div>

              <div className="space-y-3">
                {/* 微信登录 */}
                <button
                  onClick={handleSelectWechat}
                  className="w-full flex items-center gap-4 p-4 bg-[#07C160] hover:bg-[#06AE56] text-white rounded-2xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.27-.018-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                  </div>
                  <span className="font-medium">微信登录</span>
                </button>

                {/* 更多登录方式占位 - 后续可扩展 */}
                <button
                  disabled
                  className="w-full flex items-center gap-4 p-4 bg-gray-100 text-gray-400 rounded-2xl cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  </div>
                  <span className="font-medium">更多方式 (即将推出)</span>
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-6">
                首次登录将自动创建账号
              </p>
            </>
          ) : (
            // 微信扫码登录页
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">微信扫码登录</h2>
                <p className="text-sm text-gray-500">使用微信扫描下方二维码</p>
              </div>

              <div className="flex flex-col items-center">
                {!configured ? (
                  <div className="w-56 h-56 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-center p-6">
                    <AlertCircle size={40} className="text-amber-500 mb-3" />
                    <p className="text-gray-600 font-medium mb-1 text-sm">微信登录未配置</p>
                    <p className="text-xs text-gray-400">请先配置微信开放平台</p>
                  </div>
                ) : status === 'loading' ? (
                  <div className="w-56 h-56 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#07C160] border-t-transparent"></div>
                  </div>
                ) : status === 'error' || status === 'expired' ? (
                  <div className="w-56 h-56 bg-gray-50 rounded-2xl flex flex-col items-center justify-center">
                    <AlertCircle size={40} className="text-red-400 mb-3" />
                    <p className="text-gray-600 mb-3 text-sm">{error || '二维码已过期'}</p>
                    <button
                      onClick={fetchWechatQrcode}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#07C160] hover:bg-[#06AE56] text-white rounded-lg transition-colors text-sm"
                    >
                      <RefreshCw size={14} />
                      刷新
                    </button>
                  </div>
                ) : status === 'confirmed' ? (
                  <div className="w-56 h-56 bg-green-50 rounded-2xl flex flex-col items-center justify-center">
                    <CheckCircle size={56} className="text-green-500 mb-3" />
                    <p className="text-green-600 font-medium">登录成功</p>
                  </div>
                ) : (
                  <div className="relative">
                    <iframe
                      src={qrcodeUrl}
                      className="w-56 h-56 border-0 rounded-2xl bg-white"
                      sandbox="allow-scripts allow-same-origin"
                      title="微信登录二维码"
                    />

                    {status === 'scanned' && (
                      <div className="absolute inset-0 bg-white/90 rounded-2xl flex flex-col items-center justify-center">
                        <div className="animate-pulse">
                          <CheckCircle size={40} className="text-green-500 mb-3" />
                        </div>
                        <p className="text-gray-600 font-medium text-sm">扫描成功</p>
                        <p className="text-xs text-gray-400">请在手机上确认</p>
                      </div>
                    )}
                  </div>
                )}

                {status === 'pending' && configured && (
                  <button
                    onClick={fetchWechatQrcode}
                    className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <RefreshCw size={12} />
                    刷新二维码
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
