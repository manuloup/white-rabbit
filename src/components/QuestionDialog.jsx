import { useEffect, useState } from "react";

function pickGlitchChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+/\\=<>_";
    return chars[Math.floor(Math.random() * chars.length)];
}

function QuestionDialog({ question, onAnswer, answered, selectedOption, isCorrect, timeLeft, totalTime }) {
    const [typed, setTyped] = useState("");

    useEffect(() => {
        if (!question) return;
        let cancelled = false;
        const run = async () => {
            setTyped("");
            const text = question.question;
            let current = "";
            for (let i = 0; i < text.length; i++) {
                if (cancelled) return;
                const real = text[i];
                const passes = Math.random() < 0.35 ? 2 : 1;
                for (let p = 0; p < passes; p++) {
                    const maybe = Math.random() < 0.65 ? pickGlitchChar() : real;
                    setTyped(current + maybe);
                    await new Promise((r) => setTimeout(r, 18));
                    if (cancelled) return;
                }
                current += real;
                setTyped(current);
                await new Promise((r) => setTimeout(r, 28));
            }
        };
        run();
        return () => { cancelled = true; };
    }, [question?.id]);

    if (!question) return null;

    const timerPct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

    return (
        <div className="modal-overlay">
            <div className="dialog">
                <div className="dialog-titlebar">
                    <div className="dialog-title" data-text="QUESTION">QUESTION</div>

                    {/* Timer dans la titlebar */}
                    <div className="dialog-timer">
                        <div className="dialog-timer-bar-wrap">
                            <div
                                className="dialog-timer-bar"
                                style={{ width: answered ? "0%" : `${timerPct}%` }}
                            />
                        </div>
                        <span className="dialog-timer-count">
                            {answered ? "" : `${timeLeft}s`}
                        </span>
                    </div>

                    <button className="dialog-x" onClick={() => onAnswer(null, true)} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="dialog-content">
                    <div className="category-badge">{question.category}</div>

                    <div className="question-text">
                        {typed}
                        <span className="cursor on">█</span>
                    </div>

                    <div className="options">
                        {question.options.map((option, idx) => {
                            const cls =
                                answered && idx === question.correct
                                    ? "option correct"
                                    : answered && idx === selectedOption && !isCorrect
                                        ? "option incorrect"
                                        : "option";
                            return (
                                <button
                                    key={idx}
                                    className={cls}
                                    onClick={() => !answered && onAnswer(idx)}
                                    type="button"
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>

                    {answered && (
                        <>
                            <div className={`result-box ${isCorrect ? "correct" : "incorrect"}`}>
                                {isCorrect ? `✓ CORRECT  +${question.points}` : timeLeft === 0 ? "✗ TEMPS ECOULE" : "✗ INCORRECT"}
                            </div>
                            <button className="link-action" data-text="CONTINUE" onClick={() => onAnswer(null, true)}>
                                CONTINUE
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuestionDialog;
