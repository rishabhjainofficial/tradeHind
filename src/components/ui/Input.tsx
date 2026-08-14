'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  rightAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, rightAction, type = 'text', style, className = '', ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
        {(label || rightAction) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {label && (
              <label htmlFor={props.id} style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                {label} {props.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
            )}
            {rightAction}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          style={{
            width: '100%',
            height: '44px',
            padding: '0 0.85rem',
            borderRadius: '8px',
            border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#0f172a',
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            outline: 'none',
            boxSizing: 'border-box',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            transition: 'all 0.2s ease',
            ...style,
          }}
          className={`custom-input ${className}`}
          {...props}
        />

        {error && (
          <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 500 }}>
            {error}
          </span>
        )}

        {helperText && !error && (
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
