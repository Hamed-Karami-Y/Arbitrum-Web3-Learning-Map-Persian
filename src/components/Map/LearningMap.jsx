// src/components/Map/LearningMap.jsx
// نقشه یادگیری تعاملی: هسته مرکزی برنامه

import React, { useState } from 'react';
import { ZONES, STAGES } from '../../data/stages.js';
import { MapZone } from './MapZone.jsx';
import { ZoneConnectingPath } from './ZoneConnectingPath.jsx';
import { useLearning } from '../../context/LearningContext.jsx';
import { 
  Sparkles, 
  Compass, 
  Play, 
  CheckCircle, 
  MapPin, 
  ChevronLeft,
  Filter
} from 'lucide-react';

export function LearningMap() {
  const { completedStages, openStage, isStageUnlocked } = useLearning();
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('all');

  // مرحله بعدی که کاربر باید انجام دهد
  const nextStage = STAGES.find(s => !completedStages.includes(s.id) && isStageUnlocked(s.id)) || STAGES[0];

  const filteredZones = selectedZoneFilter === 'all' 
    ? ZONES 
    : ZONES.filter(z => z.id.toString() === selectedZoneFilter);

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-right">
      
      {/* Map Header & Fast Action Banner */}
      <div className="mb-10 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/40">
                <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>نقشه تعاملی وب۳</span>
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">•</span>
              <span className="text-xs text-slate-400 hidden sm:inline font-mono">شبکه آزمایشی Arbitrum Sepolia</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-2">
              سفر آن‌چین: مسیر تسلط بر آربیتروم
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              قلمروهای به‌هم‌پیوسته وب۳ را کشف کنید. مبانی رمزنگاری را در محیط آزمایشی بیاموزید، تراکنش‌های زنده در آربیتروم سپولیا را اجرا کنید و امتیازهای تاییدشده دریافت نمایید.
            </p>
          </div>

          {/* Quick Resume Current Objective */}
          {nextStage && (
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 lg:w-96 shadow-lg shadow-cyan-500/5">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-[11px] uppercase text-cyan-400 font-semibold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>هدف پیشنهادی بعدی</span>
                </div>
                <div className="font-bold text-white text-sm truncate">
                  {nextStage.title}
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  +{nextStage.xp} XP • {nextStage.category}
                </div>
              </div>
              <button
                onClick={() => openStage(nextStage.id)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <span>ادامه مسیر</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Zone Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 flex items-center gap-1 ml-1 whitespace-nowrap">
            <Filter className="w-3 h-3" /> فیلتر بخش‌ها:
          </span>
          <button
            onClick={() => setSelectedZoneFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedZoneFilter === 'all'
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            همه بخش‌ها ({ZONES.length})
          </button>
          {ZONES.map(z => (
            <button
              key={z.id}
              onClick={() => setSelectedZoneFilter(z.id.toString())}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedZoneFilter === z.id.toString()
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {z.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Hierarchy */}
      <div className="space-y-4">
        {filteredZones.map((zone, index) => {
          const zoneStages = STAGES.filter(s => s.zone === zone.id);
          const isZoneDone = zoneStages.length > 0 && zoneStages.every(s => completedStages.includes(s.id));
          const hasNext = index < filteredZones.length - 1;

          return (
            <React.Fragment key={zone.id}>
              <MapZone zone={zone} stages={zoneStages} />
              {hasNext && (
                <ZoneConnectingPath 
                  isCompleted={isZoneDone} 
                  label={`مسیر اتصال به ${filteredZones[index + 1]?.title || 'بخش بعدی'}`} 
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
}
