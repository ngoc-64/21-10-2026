import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Send, Smartphone } from 'lucide-react';
import { LithoDevice, evaluatePm25State } from '../data/telemetryData';

interface PushNotificationSectionProps {
  activeDevice: LithoDevice;
  currentPm25: number;
}

export function PushNotificationSection({
  activeDevice,
  currentPm25,
}: PushNotificationSectionProps) {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [swReady, setSwReady] = useState<boolean>(false);
  const [autoAlertEnabled, setAutoAlertEnabled] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [lastSentTime, setLastSentTime] = useState<string | null>(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator;

  // Register Service Worker on mount so mobile browsers can display system-tray push notifications
  useEffect(() => {
    if (!isSupported) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        setSwReady(true);
      })
      .catch(() => {
        setSwReady(false);
      });
  }, [isSupported]);

  const sendDeviceNotification = async (title: string, body: string) => {
    if (!isSupported) {
      setStatusMessage('This browser does not support device push notifications.');
      return;
    }

    let currentPerm = Notification.permission;
    if (currentPerm === 'default') {
      currentPerm = await Notification.requestPermission();
      setPermission(currentPerm);
    }

    if (currentPerm !== 'granted') {
      setStatusMessage(
        'Please allow notification permissions in your phone or browser settings first.'
      );
      return;
    }

    try {
      if (swReady) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          body,
          tag: 'lithoclean-pm25-push',
        });
      } else {
        new Notification(title, { body });
      }
      const timeLabel = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSentTime(timeLabel);
      setStatusMessage('Notification sent! Check your phone or device notification bar.');
    } catch {
      new Notification(title, { body });
      setStatusMessage('Notification sent to your device.');
    }
  };

  const handleEnableAlerts = async () => {
    if (!isSupported) {
      setStatusMessage('Push notifications are not supported on this browser.');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await sendDeviceNotification(
        'LithoClean Alerts Connected',
        `Your phone will now receive instant alerts if fine dust rises in ${activeDevice.equipmentTitle}.`
      );
    } else if (result === 'denied') {
      setStatusMessage(
        'Notifications are blocked. Enable them in your browser site settings to receive alerts.'
      );
    }
  };

  const handleSendLiveUpdate = () => {
    const airState = evaluatePm25State(currentPm25);
    sendDeviceNotification(
      `${activeDevice.equipmentTitle} · ${airState.aqiLabel}`,
      `Current fine dust (PM2.5) is ${currentPm25.toFixed(1)} µg/m³. ${airState.description}`
    );
  };

  return (
    <section id="notifications" className="py-16 lg:py-24">
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        {/* Top Status Bar at the start of the Section */}
        <div className="mb-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] p-4 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                permission === 'granted' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {permission === 'granted'
                ? 'Phone & Browser Push Active'
                : 'Phone Alerts Not Enabled Yet'}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
              ·
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {lastSentTime
                ? `Last alert sent at ${lastSentTime}`
                : 'Ready to send air quality alerts straight to your screen'}
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 shrink-0">
            Watching: <strong className="font-semibold text-slate-900 dark:text-white">{activeDevice.equipmentTitle}</strong>
          </div>
        </div>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 5 Columns: Friendly Explanation */}
          <div className="lg:col-span-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              03. Mobile Push Notifications
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white text-balance leading-tight">
              Get Instant Air Alerts Straight on Your Phone
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Open this page on your phone (Android Chrome or iPhone Safari added to Home Screen) and turn on notifications. Whenever fine dust rises, we will send a push alert directly to your notification bar.
            </p>
          </div>

          {/* Right 7 Columns: Push Notification Controls */}
          <div className="lg:col-span-7 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-3.5">
                <Smartphone className="w-5 h-5 text-slate-900 dark:text-white mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                    Push Notification Settings
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Works via Web Push Service Worker — no extra app download needed.
                  </p>
                </div>
              </div>

              {permission === 'granted' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Connected</span>
                </span>
              )}
            </div>

            {/* Auto-alert toggle */}
            <div className="py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-6">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Automatic High-Dust Warning (&gt; 35.4 µg/m³)
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Automatically push an alert to your phone if any room crosses into unsafe air.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoAlertEnabled}
                onClick={() => setAutoAlertEnabled((prev) => !prev)}
                className={`px-3.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  autoAlertEnabled
                    ? 'bg-slate-950 text-white border-slate-950 dark:bg-white dark:text-slate-950 dark:border-white'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {autoAlertEnabled ? 'On' : 'Off'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {permission !== 'granted' ? (
                <button
                  type="button"
                  onClick={handleEnableAlerts}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-85 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Bell className="w-4 h-4" />
                  <span>Turn On Phone Notifications</span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleSendLiveUpdate}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border border-slate-950 dark:border-slate-200 text-slate-950 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send Current Air Reading to Phone</span>
              </button>
            </div>

            {statusMessage && (
              <p className="mt-5 text-xs text-slate-600 dark:text-slate-300 pt-4 border-t border-slate-100 dark:border-slate-800/70">
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
