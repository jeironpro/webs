import { useState, useRef, useEffect } from 'react'

export default function TaskTitle({
    title,
    onTitleChange,
    isTimerRunning,
    isTimerPaused,
    isTimerFinished,
}) {
    // Tres estados: input (idle/finished), display text (running), editing (running con pencil)
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState('')
    const inputRef = useRef(null)
    const isTimerActive = isTimerRunning || isTimerPaused

    // Auto-focus y selección al entrar en modo edición
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    function handleEditClick() {
        setEditValue(title)
        setIsEditing(true)
    }

    function handleSubmit() {
        onTitleChange(editValue)
        setIsEditing(false)
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSubmit()
        if (e.key === 'Escape') setIsEditing(false)
    }

    if (isTimerActive && !isTimerFinished) {
        if (isEditing) {
            return (
                <div className="w-full max-w-xs animate-slide-up mx-auto px-4">
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent border-b-2 text-center text-lg text-[#f1f5f9] outline-none"
                        style={{ borderColor: 'rgba(0,212,255,0.3)' }}
                        ref={inputRef}
                        autoFocus
                    />
                </div>
            )
        }

        return (
            <div className="flex items-center justify-center gap-1.5 w-full max-w-xs mx-auto animate-slide-up px-4">
                <span className="text-lg text-[#f1f5f9]/80 truncate">
                    {title || 'Sin título'}
                </span>
                <button
                    onClick={handleEditClick}
                    className="shrink-0 p-0.5 rounded transition-all duration-200 hover:bg-white/10"
                    aria-label="Editar título"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#00d4ff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-xs animate-slide-up mx-auto px-4">
            <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="¿En qué vas a trabajar?"
                className="w-full bg-transparent border-b-2 text-center text-lg text-[#f1f5f9] placeholder-[#64748b] outline-none transition-all duration-300"
                style={{ borderColor: 'rgba(148,163,184,0.2)' }}
                onFocus={(e) => (e.target.style.borderColor = '#00d4ff')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(148,163,184,0.2)')}
            />
        </div>
    )
}
