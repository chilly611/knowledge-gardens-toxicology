'use client';

import React, { useState } from 'react';

interface DepthButtonProps {
  label: string;
  content: string | React.ReactNode;
  variant?: 'inline' | 'modal';
}

export default function DepthButton({ label, content, variant = 'inline' }: DepthButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'modal') {
    return (
      <div className='depth-button-container'>
        <button
          className='depth-button'
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          {label}
          <span className='depth-icon'>↗</span>
        </button>
        {isOpen && (
          <div className='depth-modal-overlay' onClick={() => setIsOpen(false)}>
            <div className='depth-modal' onClick={(e) => e.stopPropagation()}>
              <button className='modal-close' onClick={() => setIsOpen(false)}>×</button>
              <div className='modal-content'>{content}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='depth-button-container'>
      <button
        className='depth-button'
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {label}
        <span className='depth-icon'>+</span>
      </button>
      {isOpen && <div className='depth-expand-content'>{content}</div>}
    </div>
  );
}
