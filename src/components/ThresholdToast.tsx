import { AlertTriangle, X } from 'lucide-react';

interface ThresholdToastProps {
  visible: boolean;
  pm25Value: number;
  activeZoneName: string;
  onDismiss: () => void;
  onNormalize: () => void;
}

export function ThresholdToast({
  visible,
  pm25Value,
  activeZoneName,
  onDismiss,
  onNormalize,
}: ThresholdToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 max-w-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="border border-rose-500/40 bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 dark:bg-rose-500" />
            </span>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Heads Up: High Fine Dust Level
            </span>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Close alert"
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 -m-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Fine dust in <strong className="font-semibold text-slate-950 dark:text-white">{activeZoneName}</strong> is now{' '}
          <span className="tabular-nums font-semibold text-rose-600 dark:text-rose-400">
            {pm25Value.toFixed(1)} µg/m³
          </span>
          , which is above our safe limit of 35.4 µg/m³. Please put on a protective mask and keep the air purifiers running.
        </p>

        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>N95 / KN95 mask recommended</span>
          </div>
          <button
            type="button"
            onClick={onNormalize}
            className="px-3 py-1.5 text-xs font-medium bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            Back to Safe Air
          </button>
        </div>
      </div>
    </div>
  );
}
