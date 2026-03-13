"use client";

import { useMemo, useState } from "react";
import { ToolResultCard } from "@/components/tool-result-card";

const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      className="flex items-center gap-2 rounded-lg border p-3"
      style={{ borderColor: "var(--border)" }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export function PasswordGeneratorTool() {
  const defaultState = {
    length: 16,
    useUpper: true,
    useLower: true,
    useNumbers: true,
    useSymbols: false,
  };

  const [length, setLength] = useState(defaultState.length);
  const [useUpper, setUseUpper] = useState(defaultState.useUpper);
  const [useLower, setUseLower] = useState(defaultState.useLower);
  const [useNumbers, setUseNumbers] = useState(defaultState.useNumbers);
  const [useSymbols, setUseSymbols] = useState(defaultState.useSymbols);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const availableSet = useMemo(() => {
    return `${useUpper ? CHARSETS.upper : ""}${useLower ? CHARSETS.lower : ""}${useNumbers ? CHARSETS.number : ""}${useSymbols ? CHARSETS.symbol : ""}`;
  }, [useUpper, useLower, useNumbers, useSymbols]);

  const generatePassword = () => {
    if (!availableSet) {
      return;
    }

    let generated = "";
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let index = 0; index < length; index += 1) {
      generated += availableSet[randomValues[index] % availableSet.length];
    }

    setPassword(generated);
    setCopied(false);
  };

  const copyPassword = async () => {
    if (!password) {
      return;
    }

    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="password-length" className="mb-2 block font-medium">
          Length: {length}
        </label>
        <input
          id="password-length"
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(event) => setLength(Number(event.target.value))}
          className="w-full"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Toggle label="Uppercase" checked={useUpper} onChange={setUseUpper} />
        <Toggle label="Lowercase" checked={useLower} onChange={setUseLower} />
        <Toggle
          label="Numbers"
          checked={useNumbers}
          onChange={setUseNumbers}
        />
        <Toggle
          label="Symbols"
          checked={useSymbols}
          onChange={setUseSymbols}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generatePassword}
          className="btn btn-primary"
          disabled={!availableSet}
        >
          Generate Password
        </button>
        <button
          type="button"
          onClick={copyPassword}
          className="btn btn-secondary"
          disabled={!password}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setPassword("");
            setCopied(false);
          }}
        >
          Clear
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setLength(defaultState.length);
            setUseUpper(defaultState.useUpper);
            setUseLower(defaultState.useLower);
            setUseNumbers(defaultState.useNumbers);
            setUseSymbols(defaultState.useSymbols);
            setPassword("");
            setCopied(false);
          }}
        >
          Reset
        </button>
      </div>

      {!availableSet && (
        <p className="text-sm text-red-500">
          Enable at least one character set to generate a password.
        </p>
      )}

      <ToolResultCard
        icon="🔐"
        label="Generated Password"
        value={<span className="break-all text-lg">{password || "Your generated password will appear here."}</span>}
        helpText="Tip: Use at least 16 characters with symbols for stronger security."
      />
    </div>
  );
}
