/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { LITHO_DEVICES, evaluatePm25State } from './data/telemetryData';
import { LithographySection } from './components/LithographySection';
import { HealthcareSection } from './components/HealthcareSection';
import { PushNotificationSection } from './components/PushNotificationSection';
import { ThresholdToast } from './components/ThresholdToast';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(LITHO_DEVICES[0].id);
  const [liveJitter, setLiveJitter] = useState<number>(0);
  const [toastDismissed, setToastDismissed] = useState<boolean>(false);

  // Sync dark mode class on root html element for smooth CSS transitions
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Subtle realistic cleanroom sensor micro-fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.4;
      setLiveJitter(Number(delta.toFixed(1)));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const activeDevice =
    LITHO_DEVICES.find((d) => d.id === selectedDeviceId) || LITHO_DEVICES[0];

  const effectivePm25 = Math.max(
    0.4,
    Number((activeDevice.pm25 + liveJitter).toFixed(1))
  );

  const safetyState = evaluatePm25State(effectivePm25);

  useEffect(() => {
    if (safetyState.isHazardous) {
      setToastDismissed(false);
    }
  }, [safetyState.isHazardous]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070A10] text-slate-900 dark:text-slate-100 micro-grid-bg selection:bg-cyan-500/20">
      {/* Strict 3-Zone Top Navigation Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 dark:border-slate-800/90 bg-[#F8FAFC]/90 dark:bg-[#070A10]/90 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#lithography"
            className="text-base font-bold tracking-tight text-slate-950 dark:text-white whitespace-nowrap shrink-0"
          >
            LithoClean
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a
              href="#lithography"
              className="hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Room Monitors
            </a>
            <a
              href="#healthcare"
              className="hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Health Tips
            </a>
            <a
              href="#notifications"
              className="hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Phone Alerts
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (Seamless Light / Dark Mode Switch) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-950 dark:hover:border-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Section 1: Room Air Monitors */}
        <LithographySection
          selectedDeviceId={selectedDeviceId}
          onSelectDevice={setSelectedDeviceId}
          simulatedOffset={liveJitter}
        />

        {/* Section 2: Health & Safety Tips */}
        <HealthcareSection currentPm25={effectivePm25} />

        {/* Section 3: Mobile Push Notifications (Standard Web Push Service Worker) */}
        <PushNotificationSection
          activeDevice={activeDevice}
          currentPm25={effectivePm25}
        />
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8">
        <div className="max-w-[1360px] mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>LithoClean · Keeping Your Workspace Air Clean &amp; Healthy</span>
          <div className="flex items-center gap-4">
            <a
              href="#lithography"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Back to Top
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              WHO Air &amp; Health Guide
            </a>
          </div>
        </div>
      </footer>

      {/* Global Floating Threshold Alert Toast */}
      <ThresholdToast
        visible={safetyState.isHazardous && !toastDismissed}
        pm25Value={effectivePm25}
        activeZoneName={`${activeDevice.name} (${activeDevice.equipmentTitle})`}
        onDismiss={() => setToastDismissed(true)}
        onNormalize={() => setSelectedDeviceId(LITHO_DEVICES[0].id)}
      />
    </div>
  );
}
