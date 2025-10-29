"use client";

import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectContextProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOption: Option | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<Option | null>>;
  onChange: (option: Option) => void;
  listboxId: string;
  labelId: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  labelId: string; // ID of the <Label> component for accessibility
  disabled?: boolean;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelectContext must be used within a Select component");
  }
  return context;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  labelId,
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(() => {
    return options.find((opt) => opt.value === value) || null;
  });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const listboxId = useMemo(
    () => `select-listbox-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === value) || null);
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "Enter":
      case " ":
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(
            selectedOption ? options.indexOf(selectedOption) : 0
          );
        } else {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            e.preventDefault();
            handleSelect(options[highlightedIndex]);
          }
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(options.length - 1);
        break;
    }
  };

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const optionEl = listboxRef.current.children[highlightedIndex] as
        | HTMLLIElement
        | undefined;
      optionEl?.scrollIntoView({ block: "nearest" });
    }
  }, [isOpen, highlightedIndex]);

  const handleSelect = useCallback(
    (option: Option) => {
      setSelectedOption(option);
      onChange(option.value);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  const contextValue: SelectContextProps = {
    isOpen,
    setIsOpen,
    selectedOption,
    setSelectedOption,
    onChange: handleSelect,
    listboxId,
    labelId,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      <div
        className="relative w-full"
        ref={containerRef}
        onKeyDown={handleKeyDown}
      >
        <SelectTrigger
          ref={triggerRef}
          placeholder={placeholder}
          disabled={disabled}
        />
        <SelectList ref={listboxRef} options={options} highlightedIndex={highlightedIndex} />
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  placeholder: string;
  disabled?: boolean;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ placeholder, disabled }, ref) => {
    const { isOpen, setIsOpen, selectedOption, listboxId, labelId } =
      useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={`
          w-full rounded-lg bg-neutral-10 border-2 border-neutral-40 px-4 py-2 
          text-left text-sm transition-colors 
          focus:outline-none
          flex justify-between items-center text-m
          ${!selectedOption ? ' text-neutral-60' : ' text-neutral-90'}
          ${disabled ? 'bg-neutral-20 cursor-not-allowed text-neutral-50' : ''}
        `}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${listboxId}-trigger-label`}
        aria-controls={listboxId}
      >
        <span id={`${listboxId}-trigger-label`} className={`${!selectedOption ? 'text-neutral-60' : 'text-neutral-90'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12.5a.5.5 0 0 1-.354-.146l-4-4a.5.5 0 1 1 .708-.708L10 11.293l3.646-3.647a.5.5 0 1 1 .708.708l-4 4A.5.5 0 0 1 10 12.5z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

interface SelectListProps {
  options: Option[];
  highlightedIndex: number;
}

const SelectList = React.forwardRef<HTMLUListElement, SelectListProps>(
  ({ options, highlightedIndex }, ref) => {
    const { isOpen, listboxId, labelId } = useSelectContext();

    if (!isOpen) return null;

    return (
      <ul
        ref={ref}
        className="
          absolute z-10 w-full mt-2 py-2 text-s font-bold
          bg-neutral-10 border border-neutral-40 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.10)]
          max-h-60 overflow-y-auto 
          focus:outline-none
        "
        role="listbox"
        aria-labelledby={labelId}
        id={listboxId}
        tabIndex={-1}
      >
        {options.map((option, index) => (
          <SelectOption
            key={option.value}
            option={option}
            isHighlighted={index === highlightedIndex}
          />
        ))}
      </ul>
    );
  }
);
SelectList.displayName = 'SelectList';

interface SelectOptionProps {
  option: Option;
  isHighlighted: boolean;
}

function SelectOption({ option, isHighlighted }: SelectOptionProps) {
  const { onChange, selectedOption } = useSelectContext();
  const isSelected = selectedOption?.value === option.value;

  return (
    <li
      className={`
        text-sm font-bold
        px-4 py-2 text-neutral-100 cursor-pointer 
        flex justify-between items-center
        hover:text-primary-hover
        ${isHighlighted ? 'bg-primary-surface' : 'bg-neutral-10'}
        ${isSelected ? 'text-primary-hover text-s' : ''}
      `}
      role="option"
      aria-selected={isSelected}
      id={`option-${option.value}`}
      onClick={() => onChange(option)}
      onMouseEnter={(e) => {
      }}
    >
      {option.label}
      {isSelected && (
        <svg
          className="w-5 h-5 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </li>
  );
}

export default Select;