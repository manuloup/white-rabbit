import { useEffect, useState } from "react";

function pickGlitchChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+/\\=<>_";
    return chars[Math.floor(Math.random() * chars.length)];
}

function QuestionDialog({ question, onAnswer, answered, selectedOption, isCorrect }) {
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

    return (
        <div className="modal-overlay">
            <div className="dialog">
                <div className="dialog-titlebar">
                    {/* data-text pour le glitch CSS ::before */}
                    <div className="dialog-title" data-text="QUESTION">QUESTION</div>
                    <button className="dialog-x" onClick={() => onAnswer(null, true)} aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className="dialog-content">
                    <div className="category-badge">{question.category}</div>

                    <div className="question-text">
                        {typed}
                        <span className="cursor on" />
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
                                {isCorrect ? `✓ CORRECT  +${question.points}` : "✗ INCORRECT"}
                            </div>
                            {/* data-text pour glitch */}
                            <button
                                className="link-action"
                                data-text="CONTINUE"
                                onClick={() => onAnswer(null, true)}
                            >
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
