import React, { forwardRef } from 'react';

interface BaseInputProps {
  className?: string;
  placeholder?: string;
}

type InputElProps = BaseInputProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input';
    prefix?: React.ReactNode; 
  };


type TextareaElProps = BaseInputProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea';
    prefix?: never; 
  };


type SelectElProps = BaseInputProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    as: 'select';
    prefix?: never; 
    children: React.ReactNode; 
  };
export type InputProps = InputElProps | TextareaElProps | SelectElProps;

export type InputRef = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

const Input = forwardRef<InputRef, InputProps>(
  ({ as = 'input', className = '', ...props }, ref) => {
    
    const baseStyles =
      'w-full rounded-lg bg-neutral-10 border-2 border-neutral-40 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed';

    const focusStyles =
      'focus:outline-none';

    const placeholderStyles = 'placeholder:text-neutral-90 placeholder:text-[0.875rem]';

    const paddingStyles = 'px-4 py-2';

    const optionStyles = 'mt-2 rounded-lg bg-neutral-10 border-1 border-neutral-40';

    const selectArrowStyles = `
      appearance-none 
      bg-no-repeat 
      bg-[center_right_1rem] 
      bg-[url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236b7280'><path fill-rule='evenodd' d='M10 12.5a.5.5 0 0 1-.354-.146l-4-4a.5.5 0 1 1 .708-.708L10 11.293l3.646-3.647a.5.5 0 1 1 .708.708l-4 4A.5.5 0 0 1 10 12.5z' clip-rule='evenodd' /></svg>")]
    `;


    switch (as) {
      case 'textarea': {
        const { ...rest } = props as TextareaElProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={[
              baseStyles,
              paddingStyles,
              placeholderStyles,
              focusStyles,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />
        );
      }

      case 'select': {
        const { children, ...rest } = props as SelectElProps;
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            className={[
              baseStyles,
              paddingStyles,
              focusStyles,
              selectArrowStyles,
              className,
              props.value ? 'text-gray-900' : 'text-gray-400 text-sm',
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          >
            {children}
          </select>
        );
      }

      case 'input':
      default: {
        const { prefix, ...rest } = props as InputElProps;

        if (!prefix) {
          return (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={[
                baseStyles,
                paddingStyles,
                placeholderStyles,
                focusStyles,
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              {...rest}
            />
          );
        }

        return (
          <div
            className={[
              baseStyles,
              focusStyles,
              'flex items-center p-3 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="mr-2 text-gray-500">{prefix}</span>
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              className={`
                border-none p-0 focus:outline-none focus:ring-0 
                w-full bg-transparent 
                ${placeholderStyles}
              `}
              {...rest}
            />
          </div>
        );
      }
    }
  }
);

Input.displayName = 'Input';
export default Input;

