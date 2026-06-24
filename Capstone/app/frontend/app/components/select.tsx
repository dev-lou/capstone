"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  /** Currently selected value */
  value: string;
  /** Called when user selects an option */
  onChange: (value: string) => void;
  /** Array of options to display */
  options: SelectOption[];
  /** Placeholder shown when no value is selected */
  placeholder?: string;
  /** Optional label rendered above the trigger */
  label?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names for the trigger button */
  className?: string;
  /** Unique id for a11y (auto-generated if omitted) */
  id?: string;
  /** Error state */
  error?: boolean;
  /** Small variant */
  size?: "sm" | "md";
}

// ────────────────────────────────────────────────────────────
// Chevron Icon (animated)
// ────────────────────────────────────────────────────────────

function ChevronDown({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="shrink-0"
    >
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
    </motion.svg>
  );
}

// ────────────────────────────────────────────────────────────
// Check Icon
// ────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Select Component
// ────────────────────────────────────────────────────────────

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  disabled = false,
  className = "",
  id: externalId,
  error = false,
  size = "sm",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const id = externalId ?? internalId;
  const listboxId = `${id}-listbox`;

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label ?? (value || placeholder);

  // ── Close on click outside ─────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // ── Keyboard navigation ────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusedIdx(options.findIndex((opt) => opt.value === value));
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
        case "ArrowDown":
          e.preventDefault();
          setFocusedIdx((prev) => Math.min(prev + 1, options.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (focusedIdx >= 0 && focusedIdx < options.length) {
            onChange(options[focusedIdx].value);
            setOpen(false);
            triggerRef.current?.focus();
          }
          break;
        case "Home":
          e.preventDefault();
          setFocusedIdx(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIdx(options.length - 1);
          break;
      }
    },
    [open, focusedIdx, options, value, onChange]
  );

  // ── Scroll focused option into view ────────────────────
  useEffect(() => {
    if (!open || focusedIdx < 0) return;
    const items = listRef.current?.querySelectorAll("[role='option']");
    items?.[focusedIdx]?.scrollIntoView({ block: "nearest" });
  }, [focusedIdx, open]);

  // ── Reset focused index when opened ────────────────────
  useEffect(() => {
    if (open) {
      setFocusedIdx(options.findIndex((opt) => opt.value === value));
    }
  }, [open, options, value]);

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          id={`${id}-label`}
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id}-label ${id}` : id}
        aria-controls={listboxId}
        aria-activedescendant={focusedIdx >= 0 ? `${id}-option-${focusedIdx}` : undefined}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between gap-2
          font-sans leading-none
          transition-all duration-150
          border
          ${size === "sm" ? "text-xs py-2 px-3" : "text-sm py-2.5 px-3.5"}
          ${
            error
              ? "border-[var(--color-danger)] focus:shadow-[0_0_0_3px_rgba(199,62,58,0.2)]"
              : "border-[var(--color-border)] hover:border-[var(--color-border-hover)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(232,168,56,0.25)]"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed text-[var(--color-text-muted)]"
              : "cursor-pointer text-[var(--color-text)]"
          }
          bg-[var(--color-bg)]
          rounded-[var(--radius-md)]
        `}
      >
        <span
          className={`truncate ${
            !selectedOption && value ? "text-[var(--color-text-muted)]" : ""
          }`}
        >
          {displayText}
        </span>
        <ChevronDown open={open} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? `${id}-label` : id}
            tabIndex={-1}
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-[var(--z-dropdown)] left-0 right-0 mt-1
              bg-[var(--color-surface)]
              border border-[var(--color-border)]
              ${size === "sm" ? "rounded-[var(--radius-md)]" : "rounded-[var(--radius-lg)]"}
              shadow-lg overflow-hidden
            `}
            style={{ maxHeight: "220px", overflowY: "auto" }}
          >
            {options.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-[var(--color-text-muted)]">
                No options available
              </div>
            ) : (
              options.map((option, idx) => {
                const isSelected = option.value === value;
                const isFocused = idx === focusedIdx;
                return (
                  <button
                    key={option.value}
                    id={`${id}-option-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={disabled}
                    tabIndex={-1}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    className={`
                      w-full flex items-center justify-between gap-2 text-left
                      font-sans leading-none cursor-pointer
                      transition-colors duration-100
                      ${size === "sm" ? "text-xs py-2 px-3" : "text-sm py-2.5 px-3.5"}
                      ${
                        isSelected
                          ? "bg-[var(--color-accent-muted)] text-[var(--color-ph-navy)] font-medium"
                          : isFocused
                            ? "bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
                            : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                      }
                    `}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <span className="text-[var(--color-accent)] shrink-0">
                        <CheckIcon />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
