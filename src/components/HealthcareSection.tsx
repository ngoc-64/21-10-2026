import { useState } from 'react';
import { ArrowUpRight, Plus, Minus } from 'lucide-react';
import { WHO_GUIDANCE_ITEMS } from '../data/telemetryData';

interface HealthcareSectionProps {
  currentPm25: number;
}

export function HealthcareSection({ currentPm25 }: HealthcareSectionProps) {
  const [openId, setOpenId] = useState<string>(WHO_GUIDANCE_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? '' : id));
  };

  return (
    <section
      id="healthcare"
      className="py-16 lg:py-24 border-b border-slate-200 dark:border-slate-800/80"
    >
      <div className="max-w-[1360px] mx-auto px-6 lg:px-12">
        {/* Top Quick Guide Strip at the start of Section 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] mb-12 lg:mb-16 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Ideal Yearly Goal (WHO)
            </span>
            <span className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white block">
              5.0 <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </span>
          </div>
          <div className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Daily Healthy Limit
            </span>
            <span className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white block">
              15.0 <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </span>
          </div>
          <div className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              High Dust Warning Point
            </span>
            <span className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-950 dark:text-white block">
              35.4 <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </span>
          </div>
          <div className="p-5">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Right Now in Selected Room
            </span>
            <span
              className={`mt-1.5 text-2xl font-semibold tabular-nums block ${
                currentPm25 > 35.4
                  ? 'text-rose-600 dark:text-rose-400'
                  : currentPm25 > 15.0
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {currentPm25.toFixed(1)}{' '}
              <span className="text-xs font-normal text-slate-400">µg/m³</span>
            </span>
          </div>
        </div>

        {/* Asymmetric Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (5 cols): Friendly Intro & Official WHO External Link */}
          <div className="lg:col-span-5">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              02. Health &amp; Safety Tips
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950 dark:text-white text-balance leading-tight">
              Simple Ways to Stay Protected from Fine Dust
            </h2>
            <p className="mt-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              PM2.5 particles are tiny enough to breathe deep into your lungs without noticing. Follow these easy, practical habits based on World Health Organization (WHO) advice to keep yourself feeling great at work.
            </p>

            {/* Official WHO External Link with diagonal top-right arrow hover transition */}
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <a
                href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-5 py-3 border border-slate-950 dark:border-slate-200 text-sm font-medium text-slate-950 dark:text-white hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <span>Read WHO Air &amp; Health Guide</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Official guide from the World Health Organization (who.int)
              </p>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Accordion */}
          <div className="lg:col-span-7 border-t border-slate-200 dark:border-slate-800">
            {WHO_GUIDANCE_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="border-b border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full py-6 text-left flex items-start justify-between gap-6 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-6">
                      <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums shrink-0">
                        {item.index}.
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {item.exposureBracket}
                        </p>
                      </div>
                    </div>
                    <span className="mt-1 text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors shrink-0">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pb-7 pl-8 sm:pl-11 pr-4 animate-[fadeIn_180ms_ease-out]">
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.summary}
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {item.protocolDetails.map((detail, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-700 dark:text-slate-300 flex items-baseline gap-3"
                          >
                            <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400 tabular-nums shrink-0">
                              0{idx + 1}
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400">
                        {item.whoReferenceMetric}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
