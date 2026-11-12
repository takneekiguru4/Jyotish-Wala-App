import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Award,
  BookOpen,
  HelpCircle,
  ChevronLeft,
  Sparkles,
  Languages,
  Check,
  X
} from 'lucide-react';
import {
  SANSKRIT_LEVELS,
  INITIAL_SANSKRIT_LESSONS,
  SanskritCourseLevel,
  SanskritLesson,
  getSanskritProgress,
  saveSanskritQuizScore,
  recordReadingHistory
} from '../services/sanatanPlatformService';

interface SanskritLearningViewProps {
  language?: 'hi' | 'en';
}

export const SanskritLearningView: React.FC<SanskritLearningViewProps> = ({ language = 'hi' }) => {
  const [selectedLevel, setSelectedLevel] = useState<SanskritCourseLevel | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<SanskritLesson | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [progress, setProgress] = useState(() => getSanskritProgress());

  const lessons = useMemo(() => {
    try {
      const wpRaw = localStorage.getItem('jyotishwala_wp_sync_cache_v1');
      if (wpRaw) {
        const parsed = JSON.parse(wpRaw);
        if (Array.isArray(parsed?.sanskrit) && parsed.sanskrit.length > 0) {
          return [...parsed.sanskrit, ...INITIAL_SANSKRIT_LESSONS];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SANSKRIT_LESSONS;
  }, []);

  const filteredLessons = useMemo(() => {
    if (selectedLevel === 'all') return lessons;
    return lessons.filter((l) => l.level === selectedLevel);
  }, [lessons, selectedLevel]);

  const handleOpenLesson = (lesson: SanskritLesson) => {
    setActiveLesson(lesson);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    recordReadingHistory({
      itemType: 'sanskrit_lesson',
      title: lesson.titleHi,
      subtitle: `${lesson.levelLabelHi} • ${lesson.topicCategory}`,
      targetPage: 'sanskrit'
    });
  };

  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    let correct = 0;
    activeLesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct += 1;
      }
    });
    const nextProgress = saveSanskritQuizScore(activeLesson.id, correct, activeLesson.quiz.length);
    setProgress(nextProgress);
    setQuizSubmitted(true);
  };

  const completionPercent = Math.round(
    (progress.completedLessonIds.length / Math.max(lessons.length, 1)) * 100
  );

  return (
    <div className="space-y-5 pb-10 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#008080] via-[#006666] to-[#FF7F33] rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 text-[11px] font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>देववाणी संस्कृत शिक्षण एवं पाणिनीय व्याकरण</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {language === 'en'
                ? 'Sanskrit Learning & Grammar Courses'
                : 'संस्कृत शिक्षा पाठ्यक्रम (प्रारंभिक से उन्नत स्तर)'}
            </h1>
            <p className="text-xs text-teal-50 mt-1">
              माहेश्वर सूत्र, वर्णमाला, सप्त विभक्ति, शब्दरूप, धातुरूप (लकार), संधि, समास, श्लोक अन्वय एवं प्रश्नोत्तरी
            </p>
          </div>

          {/* Progress Summary Card */}
          <div className="bg-black/25 backdrop-blur-sm rounded-xl p-3.5 min-w-[200px] border border-white/15">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4 text-[#FF7F33]" />
                आपकी अध्ययन प्रगति
              </span>
              <span>{completionPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-[#FF7F33] transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-teal-100 mt-1.5">
              पूर्ण किए गए पाठ: {progress.completedLessonIds.length} / {lessons.length}
            </div>
          </div>
        </div>
      </div>

      {activeLesson ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <button
              onClick={() => setActiveLesson(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008080] hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>सभी संस्कृत पाठों पर वापस जाएं</span>
            </button>
            <span className="px-2.5 py-1 rounded-md bg-[#008080]/10 text-[#008080] text-xs font-bold">
              {activeLesson.levelLabelHi}
            </span>
          </div>

          <div>
            <div className="text-xs font-bold text-[#FF7F33] mb-1">
              {activeLesson.topicCategory}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
              {activeLesson.titleHi}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">{activeLesson.titleEn}</p>
          </div>

          {/* Core Sanskrit Grammar Sutras / Examples */}
          <div className="bg-gradient-to-br from-[#FF7F33]/10 to-[#008080]/10 border-l-4 border-[#008080] rounded-xl p-4 space-y-2">
            <div className="text-xs font-bold text-[#008080] uppercase">
              संस्कृत सूत्र, रूप एवं उदाहरण (Sanskrit Rules & Paradigms)
            </div>
            <pre className="text-xs sm:text-sm font-bold text-[var(--text-main)] whitespace-pre-wrap font-sans leading-relaxed">
              {activeLesson.sanskritExamples}
            </pre>
          </div>

          {/* Detailed Explanation */}
          <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
            <h3 className="text-xs font-bold text-[#FF7F33] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>सरल हिंदी व्याख्या (Grammar Explanation)</span>
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed">
              {activeLesson.explanationHi}
            </p>
            {activeLesson.explanationEn && (
              <p className="text-xs text-[var(--text-muted)] pt-2 border-t border-[var(--border-color)]">
                {activeLesson.explanationEn}
              </p>
            )}
          </div>

          {/* Vocabulary Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#008080]" />
              <span>दैनिक संस्कृत शब्दावली (Key Vocabulary)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeLesson.vocabulary.map((v, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#008080]">{v.sanskrit}</div>
                    <div className="text-xs text-[var(--text-main)]">{v.hindi}</div>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] italic">{v.english}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Translation Practice */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[var(--text-main)]">
              वाक्य रचना एवं अनुवाद अभ्यास (Translation Practice)
            </h3>
            <div className="space-y-2">
              {activeLesson.practiceSentences.map((ps, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#008080]/5 border border-[#008080]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="text-xs text-[var(--text-main)]">
                    <strong>हिंदी:</strong> {ps.hindi}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#008080]">
                    संस्कृत: {ps.sanskrit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Quiz */}
          <div className="bg-[var(--bg-main)] border-2 border-[#008080]/30 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#008080] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#FF7F33]" />
                <span>अभ्यास प्रश्नोत्तरी (Interactive Sanskrit Quiz)</span>
              </h3>
              {progress.quizScores[activeLesson.id] && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  पिछला स्कोर: {progress.quizScores[activeLesson.id].score}/
                  {progress.quizScores[activeLesson.id].total}
                </span>
              )}
            </div>

            {activeLesson.quiz.map((q, qIdx) => {
              const userChoice = selectedAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5 space-y-2.5"
                >
                  <div className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
                    प्रश्न {qIdx + 1}: {q.questionHi}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = userChoice === oIdx;
                      const isCorrect = q.correctIndex === oIdx;
                      let btnStyle =
                        'bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-main)]';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle =
                            'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                        } else if (isChosen && !isCorrect) {
                          btnStyle = 'bg-rose-500/15 border-rose-500 text-rose-700';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-[#008080] text-white border-[#008080] font-bold';
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={quizSubmitted}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                          }
                          className={`p-2.5 rounded-lg border text-left text-xs flex items-center justify-between gap-2 transition ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <Check className="w-4 h-4 shrink-0" />}
                          {quizSubmitted && isChosen && !isCorrect && (
                            <X className="w-4 h-4 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="text-xs text-[#008080] bg-[#008080]/10 p-2.5 rounded-lg">
                      <strong>व्याख्या:</strong> {q.explanationHi}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2.5 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shadow-sm transition"
                >
                  उत्तर जाँचें एवं प्रगति सहेजें
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FF7F33] text-white text-xs font-bold"
                >
                  पुनः अभ्यास करें
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 4 Level Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SANSKRIT_LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(isSelected ? 'all' : lvl.id)}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'bg-[#008080] text-white border-[#008080] shadow-sm'
                      : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-main)] hover:border-[#008080]'
                  }`}
                >
                  <div className="text-xs font-bold">{lvl.titleHi}</div>
                  <div
                    className={`text-[11px] font-semibold mt-0.5 ${
                      isSelected ? 'text-amber-200' : 'text-[#FF7F33]'
                    }`}
                  >
                    {lvl.badgeHi}
                  </div>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 ${
                      isSelected ? 'text-teal-50' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {lvl.descriptionHi}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {filteredLessons.map((lesson) => {
              const isDone = progress.completedLessonIds.includes(lesson.id);
              const scoreObj = progress.quizScores[lesson.id];
              return (
                <div
                  key={lesson.id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#008080] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#008080]/10 text-[#008080] text-[11px] font-bold">
                        {lesson.levelLabelHi}
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-[#FF7F33]/15 text-[#FF7F33] text-[11px] font-bold">
                        {lesson.topicCategory}
                      </span>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          पूर्ण {scoreObj ? `(${scoreObj.score}/${scoreObj.total})` : ''}
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => handleOpenLesson(lesson)}
                      className="text-base font-bold text-[var(--text-main)] hover:text-[#008080] cursor-pointer"
                    >
                      {lesson.titleHi}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                      {lesson.explanationHi}
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenLesson(lesson)}
                    className="px-4 py-2 rounded-xl bg-[#008080] hover:bg-[#006666] text-white text-xs font-bold shrink-0 self-start sm:self-center flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF7F33]" />
                    <span>पाठ एवं अभ्यास खोलें</span>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
