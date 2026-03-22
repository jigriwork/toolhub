type TextToolActionsProps = {
  onSample?: () => void;
  onCopy?: () => void;
  onClear?: () => void;
  onReset?: () => void;
  copiedLabel?: string;
  copyLabel?: string;
  copied?: boolean;
};

export function TextToolActions({
  onSample,
  onCopy,
  onClear,
  onReset,
  copiedLabel = "Copied!",
  copyLabel = "Copy",
  copied,
}: TextToolActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onSample ? (
        <button type="button" className="btn btn-secondary" onClick={onSample}>
          Sample
        </button>
      ) : null}
      {onCopy ? (
        <button type="button" className="btn btn-primary" onClick={onCopy}>
          {copied ? copiedLabel : copyLabel}
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
    </div>
  );
}
