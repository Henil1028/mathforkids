'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, X as XIcon, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '@/hooks/use-user';
import { useTimer } from '@/hooks/use-timer';
import { generateQuiz } from '@/lib/questions';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { TIMER_DURATION, QUESTIONS_PER_QUIZ, POINTS_PER_CORRECT, OPERATIONS, DIFFICULTIES } from '@/lib/constants';
import { OperationType, DifficultyType, Question, QuestionResult } from '@/types';

type FeedbackState = 'none' | 'correct' | 'wrong';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef(false);
  const hasFinishedRef = useRef(false);

  const operationSlug = (params.operation as string).toUpperCase() as OperationType;
  const difficultySlug = (params.difficulty as string).toUpperCase() as DifficultyType;

  const operationConfig = OPERATIONS.find((o) => o.operation === operationSlug);
  const difficultyConfig = DIFFICULTIES.find((d) => d.difficulty === difficultySlug);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>('none');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  const finishQuiz = async (finalResults: QuestionResult[], finalScore: number) => {
    if (hasFinishedRef.current || !user) return;
    hasFinishedRef.current = true;
    setSubmitting(true);

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          operation: operationSlug,
          difficulty: difficultySlug,
          score: finalScore,
          totalQuestions: QUESTIONS_PER_QUIZ,
          timeTaken,
          questionResults: finalResults,
        }),
      });
    } catch {
      console.error('Failed to save quiz results');
    }

    // Navigate to result page with data in URL params
    const resultData = encodeURIComponent(JSON.stringify({
      score: finalScore,
      totalQuestions: QUESTIONS_PER_QUIZ,
      percentage: Math.round((finalScore / (QUESTIONS_PER_QUIZ * POINTS_PER_CORRECT)) * 100),
      correctAnswers: finalResults.filter((r) => r.isCorrect).length,
      wrongAnswers: finalResults.filter((r) => !r.isCorrect).length,
      timeTaken,
      operation: operationSlug,
      difficulty: difficultySlug,
      questionResults: finalResults,
    }));

    router.push(`/quiz/${operationSlug.toLowerCase()}/${difficultySlug.toLowerCase()}/result?data=${resultData}`);
  };

  const moveToNext = (currentResults: QuestionResult[], currentScore: number) => {
    setFeedback('none');
    setAnswer('');
    submitRef.current = false;
    setIsSubmitted(false);

    if (currentIndex + 1 >= QUESTIONS_PER_QUIZ) {
      finishQuiz(currentResults, currentScore);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleTimeout = useCallback(() => {
    if (submitRef.current || isSubmitted) return;
    submitRef.current = true;
    setIsSubmitted(true);

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    playWrongSound();
    setFeedback('wrong');

    const updatedResults = [...results, {
      question: currentQ.questionText,
      correctAnswer: currentQ.answer,
      userAnswer: null,
      isCorrect: false,
    }];
    setResults(updatedResults);

    setTimeout(() => {
      moveToNext(updatedResults, score);
    }, 1500);
  }, [currentIndex, questions, isSubmitted, results, score]);

  const { timeLeft, percentage: timerPercentage, isWarning, isCritical, reset: resetTimer } = useTimer(TIMER_DURATION, handleTimeout);

  // Generate questions on mount
  useEffect(() => {
    if (operationConfig && difficultyConfig) {
      const q = generateQuiz(operationSlug, difficultySlug, QUESTIONS_PER_QUIZ);
      setQuestions(q);
    }
  }, [operationSlug, difficultySlug]);

  // Start timer
  useEffect(() => {
    if (questions.length > 0) {
      resetTimer();
    }
  }, [questions, currentIndex]);

  // Redirect if not logged in
  useEffect(() => {
    if (!userLoading && !user) router.push('/register');
  }, [user, userLoading, router]);

  // Focus input on question change
  useEffect(() => {
    if (!isSubmitted) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIndex, isSubmitted]);

  const handleSubmitAnswer = () => {
    if (submitRef.current || isSubmitted || !questions[currentIndex]) return;
    submitRef.current = true;
    setIsSubmitted(true);

    const currentQ = questions[currentIndex];
    const userAns = answer.trim() ? parseInt(answer.trim()) : null;
    const isCorrect = userAns === currentQ.answer;

    let updatedScore = score;
    if (isCorrect) {
      playCorrectSound();
      setFeedback('correct');
      updatedScore = score + POINTS_PER_CORRECT;
      setScore(updatedScore);
    } else {
      playWrongSound();
      setFeedback('wrong');
    }

    const updatedResults = [...results, {
      question: currentQ.questionText,
      correctAnswer: currentQ.answer,
      userAnswer: userAns,
      isCorrect,
    }];
    setResults(updatedResults);

    setTimeout(() => {
      moveToNext(updatedResults, updatedScore);
    }, 1500);
  };

  if (userLoading || !user || questions.length === 0 || submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p style={{ color: 'var(--text-muted)' }}>{submitting ? 'Saving results...' : 'Loading quiz...'}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS_PER_QUIZ) * 100;

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Top bar: Progress + Timer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Question {currentIndex + 1} of {QUESTIONS_PER_QUIZ}
            </span>
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-amber-500' : 'text-green-500'}`} />
              <span className={`text-sm font-bold font-mono ${isCritical ? 'text-red-500' : isWarning ? 'text-amber-500' : ''}`}
                style={{ color: isCritical || isWarning ? undefined : 'var(--text-primary)' }}>
                {timeLeft}s
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Timer bar */}
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-glass)' }}>
            <motion.div
              className={`h-full rounded-full ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-green-500'}`}
              animate={{ width: `${timerPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Score: <span className="font-bold text-indigo-500">{score}</span>
          </span>
        </motion.div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ duration: 0.4, type: 'spring' }}
            className={`glass-card p-8 sm:p-12 text-center relative overflow-hidden ${
              feedback === 'correct' ? 'ring-2 ring-green-500' : feedback === 'wrong' ? 'ring-2 ring-red-500' : ''
            }`}
          >
            {/* Feedback overlay */}
            <AnimatePresence>
              {feedback !== 'none' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 ${feedback === 'correct' ? 'bg-green-500/5' : 'bg-red-500/5'}`}
                />
              )}
            </AnimatePresence>

            {/* Question */}
            <div className="relative z-10">
              <p className="text-sm font-medium mb-6" style={{ color: 'var(--text-muted)' }}>
                {operationConfig?.name} • {difficultyConfig?.name}
              </p>

              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'var(--text-primary)',
                }}
              >
                {currentQ.questionText} = <span className="text-indigo-500">?</span>
              </h2>

              {/* Answer input */}
              <div className="max-w-xs mx-auto mb-6">
                <input
                  ref={inputRef}
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSubmitted) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                  disabled={isSubmitted}
                  placeholder="Your answer"
                  className="w-full text-center text-2xl font-bold py-4 rounded-xl outline-none transition-all focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono), monospace',
                  }}
                />
              </div>

              {/* Feedback message */}
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-green-500 font-bold mb-4"
                  >
                    <Check className="w-6 h-6" />
                    Correct! +{POINTS_PER_CORRECT} points
                  </motion.div>
                )}
                {feedback === 'wrong' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-1 text-red-500 font-bold mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <XIcon className="w-6 h-6" />
                      Wrong!
                    </div>
                    <p className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                      Correct answer: <span className="font-bold text-green-500">{currentQ.answer}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              {!isSubmitted && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitAnswer}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25"
                >
                  Submit
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < currentIndex
                  ? results[i]?.isCorrect
                    ? 'bg-green-500'
                    : 'bg-red-500'
                  : i === currentIndex
                  ? 'bg-indigo-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
