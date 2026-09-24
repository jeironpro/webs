import { useCallback, useEffect, useState } from 'react'
import { useTimer } from './hooks/useTimer'
import Stars from './components/Stars'
import CircularTimer from './components/CircularTimer'
import TaskTitle from './components/TaskTitle'
import Controls from './components/Controls'
import ModeToggle from './components/ModeToggle'
import DurationSelector from './components/DurationSelector'
import SessionCounter from './components/SessionCounter'
import CompletionDialog from './components/CompletionDialog'
import InfoPopover from './components/InfoPopover'
import { playFinish, resumeAudio } from './utils/sound'

const FOCUS_MINUTES = 25
const BREAK_MINUTES = 5

export default function App() {
    const [mode, setMode] = useState('focus')
    const [focusMinutes, setFocusMinutes] = useState(FOCUS_MINUTES)
    const [breakMinutes, setBreakMinutes] = useState(BREAK_MINUTES)
    const [pomodoroCount, setPomodoroCount] = useState(0)
    const [taskTitle, setTaskTitle] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)

    const currentMinutes = mode === 'focus' ? focusMinutes : breakMinutes
    const {
        remaining, duration, isRunning, isPaused, isFinished,
        start, pause, reset, setDuration, onFinish,
    } = useTimer(currentMinutes * 60)

    const handleFinish = useCallback(() => {
        playFinish()
        if (mode === 'focus') {
            setPomodoroCount((prev) => Math.min(prev + 1, 4))
        }
        setShowDialog(true)
        setTaskTitle('')
    }, [mode])

    useEffect(() => { onFinish(handleFinish) }, [onFinish, handleFinish])

    const handleModeChange = useCallback(
        (newMode) => {
            setMode(newMode); setHasStarted(false); setTaskTitle('')
            if (newMode === 'focus') {
                setFocusMinutes(FOCUS_MINUTES); setDuration(FOCUS_MINUTES * 60)
            } else {
                setBreakMinutes(BREAK_MINUTES); setDuration(BREAK_MINUTES * 60)
            }
            reset()
        }, [setDuration, reset],
    )

    const handleFocusMinutes = useCallback(
        (val) => {
            setFocusMinutes(val)
            if (mode === 'focus') setDuration(val * 60)
            setHasStarted(false)
        }, [mode, setDuration],
    )

    const handleBreakMinutes = useCallback(
        (val) => {
            setBreakMinutes(val)
            if (mode === 'break') setDuration(val * 60)
            setHasStarted(false)
        }, [mode, setDuration],
    )

    const handleStart = useCallback(() => {
        resumeAudio(); setHasStarted(true); start()
    }, [start])

    const startBreak = useCallback(() => { handleModeChange('break'); setShowDialog(false) }, [handleModeChange])
    const continueFocus = useCallback(() => { handleModeChange('focus'); setShowDialog(false) }, [handleModeChange])
    const startFocus = useCallback(() => { handleModeChange('focus'); setShowDialog(false) }, [handleModeChange])
    const continueBreak = useCallback(() => { handleModeChange('break'); setShowDialog(false) }, [handleModeChange])

    const resetTimer = useCallback(() => {
        reset()
        if (mode === 'focus') {
            setFocusMinutes(FOCUS_MINUTES); setDuration(FOCUS_MINUTES * 60)
        } else {
            setBreakMinutes(BREAK_MINUTES); setDuration(BREAK_MINUTES * 60)
        }
        setHasStarted(false); setTaskTitle('')
    }, [reset, setFocusMinutes, setBreakMinutes, setDuration, mode])

    const isDisabled = isRunning || isPaused

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <Stars />
            <div className="fixed z-20" style={{ top: 'calc(env(safe-area-inset-top, 16px) + 8px)', right: 16 }}>
                <InfoPopover />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="flex items-center justify-center gap-2">
                    <ModeToggle mode={mode} onModeChange={handleModeChange} disabled={isDisabled} />
                </div>
                {!hasStarted && (
                    <DurationSelector
                        minutes={currentMinutes}
                        onMinutesChange={mode === 'focus' ? handleFocusMinutes : handleBreakMinutes}
                        mode={mode}
                    />
                )}
                <div className="flex flex-col items-center gap-6">
                    <div className="relative mt-4">
                        <CircularTimer remaining={remaining} duration={duration} mode={mode} isFinished={isFinished} />
                    </div>
                    <TaskTitle
                        title={taskTitle} onTitleChange={setTaskTitle}
                        isTimerRunning={isRunning} isTimerPaused={isPaused} isTimerFinished={isFinished}
                    />
                </div>
                <Controls
                    isRunning={isRunning} isPaused={isPaused} hasStarted={hasStarted}
                    onStart={handleStart} onPause={pause} onReset={resetTimer}
                />
                {hasStarted && !isFinished && <SessionCounter count={pomodoroCount} />}
            </div>
            {showDialog && (
                <CompletionDialog
                    mode={mode}
                    onPrimary={mode === 'focus' ? startBreak : startFocus}
                    onSecondary={mode === 'focus' ? continueFocus : continueBreak}
                />
            )}
        </div>
    )
}
