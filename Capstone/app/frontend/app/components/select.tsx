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

function ChevronDown({ open, direction }: { open: boolean; direction: "down" | "up" }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      animate={{ rotate: open ? (direction === "up" ? 0 : 180) : (direction === "up" ? 180 : 0) }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="shrink-0 text-slate-400"
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
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Select Component — High-End Dynamic Droptop & Generous Hitbox
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
  size = "md",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const id = externalId ?? internalId;
  const listboxId = `${id}-listbox`;

  // Find selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label ?? (value || placeholder);

  // ── Dynamic Placement / Collision Detection ─────────────────────────────
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const estimatedDropdownHeight = 260; // 240px max-height + padding

    // If there isn't enough space below AND there is more space above, drop UP ("droptop")
    if (rect.bottom + estimatedDropdownHeight > viewportHeight && rect.top > estimatedDropdownHeight) {
      setDirection("up");
    } else {
      setDirection("down");
    }
  }, [open]);

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
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
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
          className="block text-sm font-bold text-[var(--color-ph-navy)] dark:text-slate-300 mb-2"
        >
          {label}
        </label>
      )}

      {/* Trigger Button — Expanded Premium Hitbox */}
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
          w-full flex items-center justify-between gap-3
          font-sans leading-none
          transition-all duration-150
          border
          py-3 px-5 text-sm font-bold
          ${
            error
              ? "border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"
              : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-[var(--color-ph-gold)] focus:shadow-[0_0_0_4px_rgba(232,168,56,0.25)]"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-800 dark:text-slate-100"
          }
          bg-white dark:bg-slate-900
          rounded-2xl shadow-sm
        `}
      >
        <span
          className={`truncate ${
            !selectedOption && value ? "text-slate-400 font-medium" : ""
          }`}
        >
          {displayText}
        </span>
        <ChevronDown open={open} direction={direction} />
      </button>

      {/* Dropdown / Droptop */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? `${id}-label` : id}
            tabIndex={-1}
            initial={{ opacity: 0, y: direction === "up" ? 4 : -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === "up" ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`
              absolute z-50 left-0 right-0
              ${direction === "up" ? "bottom-full mb-2" : "top-full mt-2"}
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-800
              rounded-2xl shadow-2xl shadow-black/20 overflow-hidden
            `}
            style={{ maxHeight: "240px", overflowY: "auto" }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm font-medium text-slate-400">
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
                      w-full flex items-center justify-between gap-3 text-left
                      font-sans leading-none cursor-pointer
                      transition-colors duration-100
                      py-3 px-5 text-sm font-bold
                      ${
                        isSelected
                          ? "bg-[var(--color-ph-navy)] text-[var(--color-ph-gold)] font-black"
                          : isFocused
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                            : "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <span className="text-[var(--color-ph-gold)] shrink-0">
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
