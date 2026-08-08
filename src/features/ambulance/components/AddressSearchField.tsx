"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Spinner } from "@/components/ui/Spinner";
import { searchAddresses } from "@/lib/geocoding/geocoding.api";
import type { GeocodingResult } from "@/lib/geocoding/geocoding.types";
import type { LatLng } from "@/lib/ambulance/ambulance.types";

interface AddressSearchFieldProps {
  accessToken: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  coordinates: LatLng | null;
  onCoordinatesChange: (coordinates: LatLng | null) => void;
  placeholder?: string;
  error?: string;
  helperText?: ReactNode;
  disabled?: boolean;
}

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 450;

export function AddressSearchField({
  accessToken,
  label,
  value,
  onValueChange,
  coordinates,
  onCoordinatesChange,
  placeholder,
  error,
  helperText,
  disabled = false,
}: AddressSearchFieldProps) {
  const listboxId = useId();
  const fieldId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function clearPendingSearch() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }

  function handleInputChange(nextValue: string) {
    onValueChange(nextValue);
    onCoordinatesChange(null);
    setSearchError(null);
    setActiveIndex(-1);

    clearPendingSearch();

    if (nextValue.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;

      try {
        const results = await searchAddresses(accessToken, nextValue.trim());

        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSearchError(results.length === 0 ? "No matching addresses found." : null);
      } catch {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions([]);
        setIsOpen(false);
        setSearchError("Could not search addresses right now.");
      } finally {
        if (requestId === requestIdRef.current) {
          setIsSearching(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);
  }

  function selectSuggestion(result: GeocodingResult) {
    onValueChange(result.label);
    onCoordinatesChange({ lat: result.lat, lng: result.lng });
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    setSearchError(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  const resolvedHelper = coordinates ? (
    <span className="text-emerald-700">
      Location confirmed ({coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)})
    </span>
  ) : (
    helperText
  );

  return (
    <div ref={containerRef}>
      <label htmlFor={fieldId} className="mb-2 block text-sm font-semibold text-[var(--color-text-primary)]">
        {label}
      </label>

      <div className="relative">
        <input
          id={fieldId}
          type="text"
          value={value}
          disabled={disabled}
          aria-invalid={!!error}
          aria-autocomplete="list"
          aria-controls={isOpen ? listboxId : undefined}
          aria-expanded={isOpen}
          role="combobox"
          autoComplete="street-address"
          placeholder={placeholder}
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-sky-100 ${
            error
              ? "border-red-300 bg-red-50"
              : "border-[var(--color-border)] bg-white"
          } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
        />

        {isSearching ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center">
            <Spinner className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      {isOpen ? (
        <ul
          id={listboxId}
          role="listbox"
          className="z-20 mt-2 max-h-56 overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li key={`${suggestion.lat}-${suggestion.lng}-${index}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={activeIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full px-4 py-3 text-left text-sm transition hover:bg-sky-50 ${
                  activeIndex === index ? "bg-sky-50 text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"
                }`}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {!error && searchError ? (
        <p className="mt-2 text-sm text-amber-700">{searchError}</p>
      ) : null}

      {!error && resolvedHelper ? (
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{resolvedHelper}</p>
      ) : null}
    </div>
  );
}
