import { useState } from 'react';
import { learnLessons } from '@/data/demoData';
import type { LearnLesson } from '@/types';
import * as Icons from 'lucide-react';
import { X, BookOpen, Lightbulb, Wrench } from 'lucide-react';

function LessonDetail({ lesson, onClose }: { lesson: LearnLesson; onClose: () => void }) {
  const IconComp = (Icons as unknown as Record<string, typeof Icons.Cpu>)[lesson.icon] || Icons.Cpu;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="hud-panel hud-panel-glow w-full max-w-2xl max-h-[85vh] overflow-y-auto p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#00b4ff]/10 border border-[#00b4ff]/30 flex items-center justify-center">
              <IconComp size={20} className="text-[#00b4ff]" />
            </div>
            <div>
              <div className="section-label">{lesson.category}</div>
              <h2 className="font-display text-xl tracking-wider text-[#00b4ff]">{lesson.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-[#4a5a7a] hover:text-[#00b4ff]">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="hud-panel p-4 border-l-2 border-[#00b4ff]">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={16} className="text-[#00b4ff]" />
              <span className="font-display text-xs tracking-wider text-[#00b4ff]">WHAT</span>
            </div>
            <p className="text-sm text-[#e8f0ff] leading-relaxed">{lesson.what}</p>
          </div>

          <div className="hud-panel p-4 border-l-2 border-[#ff8c42]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} className="text-[#ff8c42]" />
              <span className="font-display text-xs tracking-wider text-[#ff8c42]">WHY</span>
            </div>
            <p className="text-sm text-[#e8f0ff] leading-relaxed">{lesson.why}</p>
          </div>

          <div className="hud-panel p-4 border-l-2 border-[#00ff9d]">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={16} className="text-[#00ff9d]" />
              <span className="font-display text-xs tracking-wider text-[#00ff9d]">HOW</span>
            </div>
            <p className="text-sm text-[#e8f0ff] leading-relaxed">{lesson.how}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState<LearnLesson | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(learnLessons.map((l) => l.category)))];
  const filtered = filter === 'ALL' ? learnLessons : learnLessons.filter((l) => l.category === filter);

  return (
    <div className="space-y-4">
      <div className="hud-panel hud-panel-glow p-6">
        <div className="section-label mb-1">MODULE 04</div>
        <h1 className="font-display text-2xl lg:text-3xl font-black tracking-tight text-[#00b4ff] mb-2">LEARN MODE</h1>
        <p className="text-[#8a9bb8] max-w-2xl">
          Understand laptop hardware components. Every lesson explains WHAT it is, WHY it matters, and HOW to work with it.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 text-xs font-display tracking-wider rounded transition-all ${
              filter === cat
                ? 'bg-[#00b4ff]/15 text-[#00b4ff] border border-[#00b4ff]/40'
                : 'text-[#4a5a7a] border border-[#00b4ff]/10 hover:border-[#00b4ff]/30 hover:text-[#8a9bb8]'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((lesson, i) => {
          const IconComp = (Icons as unknown as Record<string, typeof Icons.Cpu>)[lesson.icon] || Icons.Cpu;
          return (
            <div
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className="hud-panel corner-brackets p-4 card-hover cursor-pointer animate-slide-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-[#00b4ff]/10 border border-[#00b4ff]/20 flex items-center justify-center">
                  <IconComp size={18} className="text-[#00b4ff]" />
                </div>
                <div>
                  <h3 className="font-display text-sm tracking-wider text-[#e8f0ff]">{lesson.title}</h3>
                  <div className="text-[0.6rem] font-mono text-[#4a5a7a] uppercase tracking-wider">{lesson.category}</div>
                </div>
              </div>
              <p className="text-xs text-[#8a9bb8] leading-relaxed line-clamp-3">{lesson.what}</p>
              <div className="mt-3 pt-3 border-t border-[#00b4ff]/10 flex items-center gap-3 text-[0.6rem] font-mono">
                <span className="text-[#00b4ff]">WHAT</span>
                <span className="text-[#ff8c42]">WHY</span>
                <span className="text-[#00ff9d]">HOW</span>
                <span className="ml-auto text-[#4a5a7a]">READ →</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedLesson && <LessonDetail lesson={selectedLesson} onClose={() => setSelectedLesson(null)} />}
    </div>
  );
}
