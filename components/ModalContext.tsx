"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Link from 'next/link';

export type ModalType = 'auth' | 'success' | 'warning' | 'error' | 'info';

export interface ModalButton {
  text: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface ModalOptions {
  type?: ModalType;
  title: string;
  message: string;
  primaryBtn?: ModalButton;
  secondaryBtn?: ModalButton;
  onClose?: () => void;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  closeModal: () => void;
  isOpen: boolean;
  modalConfig: ModalOptions | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => {
    setModalConfig(options);
  };

  const closeModal = () => {
    if (modalConfig?.onClose) {
      modalConfig.onClose();
    }
    setModalConfig(null);
  };

  const type = modalConfig?.type || 'info';

  return (
    <ModalContext.Provider value={{ showModal, closeModal, isOpen: !!modalConfig, modalConfig }}>
      {children}

      {/* Center of Page Custom Modal Alert */}
      {modalConfig && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            id="kb-center-modal"
            className="bg-white text-kb-black rounded-kb-panel border border-[#E8EAF0] shadow-2xl max-w-md w-full overflow-hidden p-6 sm:p-7 space-y-5 animate-scaleUp relative"
          >
            {/* Close Button Top Right */}
            <button
              onClick={closeModal}
              aria-label="Close dialog"
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-[#E8EAF0] hover:border-black text-neutral-400 hover:text-black flex items-center justify-center text-sm transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Icon Header */}
            <div className="text-center pt-2">
              {type === 'auth' && (
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-kb-blue flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                  🔒
                </div>
              )}
              {type === 'success' && (
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-kb-success flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                  ✓
                </div>
              )}
              {type === 'warning' && (
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-kb-gold/40 text-kb-gold flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                  ⚠️
                </div>
              )}
              {type === 'error' && (
                <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 text-kb-error flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                  ✕
                </div>
              )}
              {type === 'info' && (
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 text-kb-blue flex items-center justify-center text-2xl mx-auto mb-3 shadow-xs">
                  ℹ️
                </div>
              )}

              {/* Badges for Authenticity */}
              {type === 'auth' && (
                <span className="inline-block text-[10px] font-bold text-kb-blue uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 mb-2">
                  Session Authentication Required
                </span>
              )}
              {type === 'success' && (
                <span className="inline-block text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
                  Kalwaral Store Service
                </span>
              )}

              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-kb-black">
                {modalConfig.title}
              </h3>

              <p className="text-xs sm:text-sm text-kb-slate mt-2 leading-relaxed">
                {modalConfig.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {modalConfig.primaryBtn ? (
                modalConfig.primaryBtn.href ? (
                  <Link
                    href={modalConfig.primaryBtn.href}
                    onClick={() => {
                      if (modalConfig.primaryBtn?.onClick) modalConfig.primaryBtn.onClick();
                      closeModal();
                    }}
                    id="modal-primary-btn"
                    className="block w-full text-center bg-kb-blue hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-kb-pill transition-all shadow-sm"
                  >
                    {modalConfig.primaryBtn.text}
                  </Link>
                ) : (
                  <button
                    type="button"
                    id="modal-primary-btn"
                    onClick={() => {
                      if (modalConfig.primaryBtn?.onClick) modalConfig.primaryBtn.onClick();
                      closeModal();
                    }}
                    className="w-full bg-kb-blue hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-kb-pill transition-all shadow-sm"
                  >
                    {modalConfig.primaryBtn.text}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  id="modal-primary-btn"
                  onClick={closeModal}
                  className="w-full bg-kb-blue hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-kb-pill transition-all"
                >
                  OK
                </button>
              )}

              {modalConfig.secondaryBtn && (
                modalConfig.secondaryBtn.href ? (
                  <Link
                    href={modalConfig.secondaryBtn.href}
                    onClick={() => {
                      if (modalConfig.secondaryBtn?.onClick) modalConfig.secondaryBtn.onClick();
                      closeModal();
                    }}
                    id="modal-secondary-btn"
                    className="block w-full text-center border border-[#E8EAF0] hover:border-black text-kb-black font-semibold text-xs sm:text-sm py-3 px-6 rounded-kb-pill transition-all"
                  >
                    {modalConfig.secondaryBtn.text}
                  </Link>
                ) : (
                  <button
                    type="button"
                    id="modal-secondary-btn"
                    onClick={() => {
                      if (modalConfig.secondaryBtn?.onClick) modalConfig.secondaryBtn.onClick();
                      closeModal();
                    }}
                    className="w-full border border-[#E8EAF0] hover:border-black text-kb-black font-semibold text-xs sm:text-sm py-3 px-6 rounded-kb-pill transition-all"
                  >
                    {modalConfig.secondaryBtn.text}
                  </button>
                )
              )}

              {type === 'auth' && !modalConfig.secondaryBtn && (
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full text-neutral-400 hover:text-black text-xs font-semibold py-1.5 transition-colors"
                >
                  Continue Browsing Without Bag
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModalAlert() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalAlert must be used within a ModalProvider');
  }
  return context;
}

