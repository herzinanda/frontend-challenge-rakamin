"use client";

import React from 'react';

export type OptionValue = 'mandatory' | 'optional' | 'off';

interface OptionSelectorProps {
  value: OptionValue;
  onChange: (value: OptionValue) => void;
  isMandatory?: boolean;
  disabled?: boolean;
}

const options: { label: string; value: OptionValue }[] = [
  { label: 'Mandatory', value: 'mandatory' },
  { label: 'Optional', value: 'optional' },
  { label: 'Off', value: 'off' },
];

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  value,
  onChange,
  isMandatory = false,
  disabled = false,
}) => {
  const getButtonClasses = (optionValue: OptionValue): string => {
    const baseClasses = 'py-1 px-4 rounded-full border text-md transition-colors';

    if (disabled) {
      return `${baseClasses} bg-neutral-40 border-neutral-60 text-neutral-60 cursor-not-allowed`;
    }

    if (isMandatory) {
      if (optionValue === 'mandatory') {
        return `${baseClasses} border-primary-main text-primary-main bg-neutral-10 font-medium cursor-not-allowed`;
      } else {
        return `${baseClasses} bg-neutral-40 border-neutral-60 text-neutral-60 cursor-not-allowed`;
      }
    }

    if (optionValue === value) {
      return `${baseClasses} border-primary-main text-primary-main bg-neutral-10 font-medium`;
    }

    return `${baseClasses} bg-neutral-10 border-neutral-40 text-neutral-90 hover:border-primary-main hover:text-primary-main`;
  };

  const isButtonDisabled = (optionValue: OptionValue): boolean => {
    if (disabled) return true; 
    
    if (isMandatory) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="flex space-x-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={getButtonClasses(option.value)}
          onClick={() => !isButtonDisabled(option.value) && onChange(option.value)}
          disabled={isButtonDisabled(option.value)}
          aria-pressed={!isMandatory && value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

