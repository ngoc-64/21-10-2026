import { useState } from 'react';
import { LITHO_DEVICES, LithoDevice, evaluatePm25State } from '../data/telemetryData';
import { AnimatedCounter } from './AnimatedCounter';

interface LithographySectionProps {
  selectedDeviceId: string;
  onSelectDevice: (id: string) => void;
  simulatedOffset: number;
}

export function LithographySection({
  selectedDeviceId,
  onSelectDevice,
  simulatedOffset,
}: LithographySectionProps) {
  const [transitionKey, setTransitionKey] = useState(0);

  const handleSelect = (id: string) => {
    if (id !== selectedDeviceId) {
      onSelectDevice(id);
      setTransitionKey((prev) => prev + 1);
    }
  };

  const getEffectivePm25 = (device: LithoDevice) => {
    return Math.max(0.4, Number((device.pm25 + simulatedOffset).toFixed(1)));
  };

  const activeDevice =
    LITHO_DEVICES.find((d) => d.id === selectedDeviceId) || LITHO_DEVICES[0];

  const activePm25 = getEffectivePm25(activeDevice);
  const activeState = evaluatePm25State(activePm25);

  const activeCo2 = Math.round(activeDevice.co2 + simulatedOffset * 2.5);
  const activeTemp = Number((activeDevice.temperature + simulatedOffset * 0.012).toFixed(2));

  return (
    <section
      id="lithography"
      className="py-14 lg:py-20 border-b border-slate-200 dark:border-slate-800/80"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        {/* PART 1: Friendly Monitoring Nodes Header + 4 Interactive Device Tiles */}
        <div className="mb-10 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                01. Cleanroom Air Check · Live Sensors
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white text-balance">
                Room Air Monitors
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Pick any device card below to see live air quality, CO₂, and room temperature.
              </p>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 shrink-0">
              <span>Live Updates</span>
              <span aria-hidden="true">·</span>
              <span>4 Rooms Online</span>
            </div>
          </div>

          {/* 4 Interactive Device Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
            {LITHO_DEVICES.map((device, index) => {
              const isSelected = device.id === selectedDeviceId;
              const devicePm25 = getEffectivePm25(device);
              const deviceStatus = evaluatePm25State(devicePm25);

              const colSpanClass =
                index === 0
                  ? 'lg:col-span-3'
                  : index === 1
                  ? 'lg:col-span-3 lg:translate-y-1.5'
                  : index === 2
                  ? 'lg:col-span-3'
                  : 'lg:col-span-3 lg:translate-y-1.5';

              return (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => handleSelect(device.id)}
                  aria-pressed={isSelected}
                  className={`group relative text-left p-6 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500 flex flex-col justify-between ${colSpanClass} ${
                    isSelected
                      ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 border border-slate-950 dark:border-slate-100 scale-[0.99]'
                      : 'bg-white/80 dark:bg-[#0F141F]/80 backdrop-blur-md text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 hover:border-slate-500 dark:hover:border-slate-500 hover:scale-[0.992]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-6">
                      <span
                        className={`text-xs tracking-tight ${
                          isSelected
                            ? 'text-slate-300 dark:text-slate-600'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {device.code} · {device.name}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${deviceStatus.toneDot}`}
                        title={`Air status: ${deviceStatus.aqiLabel}`}
                      />
                    </div>

                    <h2
                      className={`text-lg font-semibold tracking-tight leading-snug ${
                        isSelected
                          ? 'text-white dark:text-slate-950'
                          : 'text-slate-950 dark:text-white'
                      }`}
                    >
                      {device.equipmentTitle}
                    </h2>
                    <p
                      className={`mt-1 text-xs ${
                        isSelected
                          ? 'text-slate-300 dark:text-slate-600'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {device.bayLocation}
                    </p>
                  </div>

                  <div
                    className={`mt-7 pt-4 border-t flex items-baseline justify-between gap-2 ${
                      isSelected
                        ? 'border-slate-800 dark:border-slate-300'
                        : 'border-slate-200 dark:border-slate-800/90'
                    }`}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <AnimatedCounter
                        value={devicePm25}
                        decimals={1}
                        className="text-3xl font-semibold tracking-tight"
                      />
                      <span
                        className={`text-xs ${
                          isSelected
                            ? 'text-slate-400 dark:text-slate-600'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        µg/m³
                      </span>
                    </div>

                    <span
                      className={`text-xs font-medium text-right ${
                        isSelected
                          ? deviceStatus.isHazardous
                            ? 'text-rose-400 dark:text-rose-600'
                            : 'text-slate-200 dark:text-slate-800'
                          : deviceStatus.toneText
                      }`}
                    >
                      {deviceStatus.aqiLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PART 2: Friendly 3-Metric Strip (Fine Dust, CO₂, Room Temp) */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Metric 1: PM2.5 */}
            <div className="pb-6 sm:pb-0 sm:pr-8">
              <p
                key={`lbl-pm-${transitionKey}`}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-all duration-200 animate-[fadeIn_200ms_ease-out]"
              >
                Fine Dust (PM2.5)
              </p>
              <div className="mt-3 flex items-baseline">
                <AnimatedCounter
                  value={activePm25}
                  decimals={1}
                  className={`text-4xl lg:text-5xl font-semibold tracking-tight ${
                    activeState.isHazardous
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-950 dark:text-white'
                  }`}
                />
                <span className="text-xs text-slate-400 ml-2">µg/m³</span>
              </div>
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Safe limit: under 35.4 µg/m³
              </p>
            </div>

            {/* Metric 2: CO2 */}
            <div className="py-6 sm:py-0 sm:px-8">
              <p
                key={`lbl-co2-${transitionKey}`}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-all duration-200 animate-[fadeIn_200ms_ease-out]"
              >
                Air Freshness (CO₂)
              </p>
              <div className="mt-3 flex items-baseline">
                <AnimatedCounter
                  value={activeCo2}
                  decimals={0}
                  className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white"
                />
                <span className="text-xs text-slate-400 ml-2">ppm</span>
              </div>
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Fresh air goal: under 650 ppm
              </p>
            </div>

            {/* Metric 3: Temperature */}
            <div className="pt-6 sm:pt-0 sm:pl-8">
              <p
                key={`lbl-temp-${transitionKey}`}
                className="text-xs font-medium text-slate-500 dark:text-slate-400 transition-all duration-200 animate-[fadeIn_200ms_ease-out]"
              >
                Room Temperature
              </p>
              <div className="mt-3 flex items-baseline">
                <AnimatedCounter
                  value={activeTemp}
                  decimals={2}
                  className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950 dark:text-white"
                />
                <span className="text-xs text-slate-400 ml-2">°C</span>
              </div>
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Comfort range: around 21.0 °C
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
