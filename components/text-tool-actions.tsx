"use client";

type TextToolActionsProps = {
  onSample?: () => void;
  onClear?: () => void;
  onReset?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  copyLabel?: string;
};

export function TextToolActions({
  onSample,
  onClear,
  onReset,
  onCopy,
  copied = false,
  copyLabel = "Copy",
}: TextToolActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onSample ? (
        <button type="button" className="btn btn-secondary" onClick={onSample}>
          Sample
        </button>
      ) : null}
      {onClear ? (
        <button type="button" className="btn btn-secondary" onClick={onClear}>
          Clear
        </button>
      ) : null}
      {onReset ? (
        <button type="button" className="btn btn-secondary" onClick={onReset}>
          Reset
        </button>
      ) : null}
      {onCopy ? (
        <button type="button" className="btn btn-secondary" onClick={onCopy}>
          {copied ? "Copied!" : copyLabel}
        </button>
      ) : null}
    </div>
  );
}
