"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  /** Array of currently selected values */
  values: string[];
  /** Called when selection changes */
  onChange: (values: string[]) => void;
  /** Array of options to display */
  options: MultiSelectOption[];
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
  /** Size variant */
  size?: "sm" | "md";
  /** Max items to show as pills before collapsing to "N selected" */
  maxPills?: number;
  /** Show select all / clear all buttons at the top */
  showSelectAll?: boolean;
  /** Label for "Select All" (i18n-friendly) */
  selectAllLabel?: string;
  /** Label for "Deselect All" (i18n-friendly) */
  deselectAllLabel?: string;
  /** Label for "Clear All" (i18n-friendly) */
  clearAllLabel?: string;
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
// Checkbox SVG Icon
// ────────────────────────────────────────────────────────────

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
      className="shrink-0"
    >
      {checked ? (
        // Checked box — navy fill with gold check
        <g>
          <rect
            x="40"
            y="40"
            width="176"
            height="176"
            rx="24"
            ry="24"
            fill="var(--color-ph-navy)"
          />
          <path
            d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"
            fill="var(--color-ph-gold)"
          />
        </g>
      ) : (
        // Unchecked box — border only
        <rect
          x="40"
          y="40"
          width="176"
          height="176"
          rx="24"
          ry="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="16"
          opacity="0.4"
        />
      )}
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// Close Icon (for pills)
// ────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 256 256"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
// MultiSelect Component
// ────────────────────────────────────────────────────────────

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder = "Select...",
  label,
  disabled = false,
  className = "",
  id: externalId,
  size = "sm",
  maxPills = 2,
  showSelectAll = true,
  selectAllLabel = "Select All",
  deselectAllLabel = "Deselect All",
  clearAllLabel = "Clear All",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const id = externalId ?? internalId;
  const listboxId = `${id}-listbox`;

  // ── Derived display values ────────────────────────────
  const selectedOptions = options.filter((opt) => values.includes(opt.value));
  const allSelected = options.length > 0 && values.length === options.length;
  const someSelected = values.length > 0;

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

  // ── Handle item activation (toggle) ────────────────────
  const handleItemActivation = useCallback(
    (idx: number) => {
      const extraCount = showSelectAll ? 2 : 0;
      if (showSelectAll && idx === 0) {
        // Select All
        if (allSelected) {
          onChange([]);
        } else {
          onChange(options.map((o) => o.value));
        }
        return;
      }
      if (showSelectAll && idx === 1) {
        // Clear All
        onChange([]);
        return;
      }
      const optionIdx = idx - extraCount;
      if (optionIdx < 0 || optionIdx >= options.length) return;

      const option = options[optionIdx];
      if (values.includes(option.value)) {
        onChange(values.filter((v) => v !== option.value));
      } else {
        onChange([...values, option.value]);
      }
      // Keep focus on the trigger — the list stays open
      triggerRef.current?.focus();
    },
    [options, values, onChange, showSelectAll, allSelected]
  );

  // ── Keyboard navigation ────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault();
          setOpen(true);
          setFocusedIdx(0);
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
          setFocusedIdx((prev) => Math.min(prev + 1, options.length - 1 + (showSelectAll ? 2 : 0)));
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleItemActivation(focusedIdx);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIdx(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIdx(options.length - 1 + (showSelectAll ? 2 : 0));
          break;
      }
    },
    [open, focusedIdx, options.length, showSelectAll, handleItemActivation]
  );

  // ── Scroll focused option into view ────────────────────
  useEffect(() => {
    if (!open || focusedIdx < 0) return;
    const items = listRef.current?.querySelectorAll("[role='option']");
    items?.[focusedIdx]?.scrollIntoView({ block: "nearest" });
  }, [focusedIdx, open]);

  // ── Reset focused index when opened ────────────────────
  useEffect(() => {
    if (open) setFocusedIdx(0);
  }, [open]);

  // ── Toggle an option (called from click) ───────────────
  const toggleOption = useCallback(
    (value: string) => {
      if (values.includes(value)) {
        onChange(values.filter((v) => v !== value));
      } else {
        onChange([...values, value]);
      }
    },
    [values, onChange]
  );

  // ── Remove single value (from pill) ────────────────────
  const removeValue = useCallback(
    (e: React.MouseEvent, value: string) => {
      e.stopPropagation();
      onChange(values.filter((v) => v !== value));
    },
    [values, onChange]
  );

  // ── Render helper for option item ──────────────────────
  const renderOption = (
    option: MultiSelectOption,
    idx: number,
    extraOffset: number
  ) => {
    const actualIdx = idx + extraOffset;
    const isChecked = values.includes(option.value);
    const isFocused = actualIdx === focusedIdx;
    return (
      <button
        key={option.value}
        id={`${id}-option-${actualIdx}`}
        type="button"
        role="option"
        aria-selected={isChecked}
        disabled={disabled}
        tabIndex={-1}
        onClick={() => toggleOption(option.value)}
        onMouseEnter={() => setFocusedIdx(actualIdx)}
        className={`
          w-full flex items-center gap-2.5 text-left
          font-sans leading-none cursor-pointer
          transition-colors duration-100
          ${size === "sm" ? "text-xs py-2 px-3" : "text-sm py-2.5 px-3.5"}
          ${
            isFocused
              ? "bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
              : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
          }
        `}
      >
        <span
          className={`shrink-0 ${
            isChecked ? "text-[var(--color-ph-navy)]" : "text-[var(--color-text-muted)]"
          }`}
        >
          <CheckboxIcon checked={isChecked} />
        </span>
        <span className="truncate">{option.label}</span>
      </button>
    );
  };

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
        aria-activedescendant={
          open && focusedIdx >= 0 ? `${id}-option-${focusedIdx}` : undefined
        }
        disabled={disabled}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center gap-1.5
          font-sans leading-none
          transition-all duration-150
          border
          ${size === "sm" ? "text-xs py-2 px-3 min-h-[32px]" : "text-sm py-2.5 px-3.5 min-h-[40px]"}
          border-[var(--color-border)] hover:border-[var(--color-border-hover)]
          focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(232,168,56,0.25)]
          ${
            disabled
              ? "opacity-50 cursor-not-allowed text-[var(--color-text-muted)]"
              : "cursor-pointer text-[var(--color-text)]"
          }
          bg-[var(--color-bg)]
          rounded-[var(--radius-md)]
        `}
      >
        {/* Selected pills or display text */}
        <div className="flex-1 flex items-center gap-1 min-w-0">
          {someSelected ? (
            <div className="flex items-center gap-1 flex-wrap">
              {selectedOptions.slice(0, maxPills).map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-0.5 bg-[var(--color-accent-muted)] text-[var(--color-ph-navy)] rounded-[var(--radius-sm)] px-1.5 py-0.5 text-[0.65rem] font-medium max-w-[120px]"
                >
                  <span className="truncate">{opt.label}</span>
                  <button
                    onClick={(e) => removeValue(e, opt.value)}
                    className="shrink-0 hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${opt.label}`}
                    type="button"
                    tabIndex={-1}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
              {selectedOptions.length > maxPills && (
                <span className="text-[0.65rem] font-medium text-[var(--color-text-muted)]">
                  +{selectedOptions.length - maxPills}
                </span>
              )}
            </div>
          ) : (
            <span className="truncate text-[var(--color-text-muted)]">
              {placeholder}
            </span>
          )}
        </div>

        {/* Count badge */}
        {someSelected && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[0.6rem] font-semibold rounded-full bg-[var(--color-ph-gold)] text-[var(--color-ph-navy)] shrink-0">
            {values.length}
          </span>
        )}

        <ChevronDown open={open} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-multiselectable="true"
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
            style={{ maxHeight: "280px", overflowY: "auto" }}
          >
            {options.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-[var(--color-text-muted)]">
                No options available
              </div>
            ) : (
              <>
                {/* Select All / Clear All */}
                {showSelectAll && (
                  <div className="sticky top-0 z-[1] bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                    <button
                      id={`${id}-option-0`}
                      type="button"
                      role="option"
                      aria-selected={allSelected}
                      tabIndex={-1}
                      onClick={() => {
                        if (allSelected) {
                          onChange([]);
                        } else {
                          onChange(options.map((o) => o.value));
                        }
                      }}
                      onMouseEnter={() => setFocusedIdx(0)}
                      className={`
                        w-full flex items-center gap-2.5 text-left
                        font-sans leading-none cursor-pointer
                        transition-colors duration-100
                        ${size === "sm" ? "text-xs py-2 px-3" : "text-sm py-2.5 px-3.5"}
                        font-medium
                        ${
                          0 === focusedIdx
                            ? "bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
                            : "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                        }
                      `}
                    >
                      <span className="shrink-0 text-[var(--color-ph-navy)]">
                        <CheckboxIcon checked={allSelected} />
                      </span>
                      <span>{allSelected ? deselectAllLabel : selectAllLabel}</span>
                    </button>
                    <button
                      id={`${id}-option-1`}
                      type="button"
                      role="option"
                      aria-selected={false}
                      tabIndex={-1}
                      onClick={() => onChange([])}
                      onMouseEnter={() => setFocusedIdx(1)}
                      className={`
                        w-full flex items-center gap-2.5 text-left
                        font-sans leading-none cursor-pointer
                        transition-colors duration-100
                        ${size === "sm" ? "text-xs py-2 px-3" : "text-sm py-2.5 px-3.5"}
                        ${
                          1 === focusedIdx
                            ? "bg-[var(--color-bg-secondary)] text-[var(--color-text)]"
                            : "bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]"
                        }
                      `}
                    >
                      <span className="w-4" />                          <span>{clearAllLabel}</span>
                    </button>
                  </div>
                )}

                {/* Option items */}
                {options.map((option, idx) =>
                  renderOption(option, idx, showSelectAll ? 2 : 0)
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
