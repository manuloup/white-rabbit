import { useEffect, useMemo, useRef, useState } from "react";

function pickGlitchChar() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@*+/\\=<>_";
    return chars[Math.floor(Math.random() * chars.length)];
}

function IntroScreen({ onYes, onNo, denyMode }) {
    const lines = useMemo(
        () => [
            { text: "Wake up...", speed: 70, pauseAfter: 500 },
            { text: "Follow the white rabbit.", speed: 55, pauseAfter: 400 },
        ],
        []
    );

    const [printed, setPrinted] = useState(["", ""]);
    const [cursorOn, setCursorOn] = useState(true);
    const [spam, setSpam] = useState([]);
    const spamTimer = useRef(null);

    useEffect(() => {
        const t = setInterval(() => setCursorOn((s) => !s), 450);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            const out = ["", ""];
            setPrinted(["", ""]);
            for (let i = 0; i < lines.length; i++) {
                const { text, speed, pauseAfter } = lines[i];
                let current = "";
                for (let k = 0; k < text.length; k++) {
                    if (cancelled) return;
                    const real = text[k];
                    const glitchPasses = Math.random() < 0.35 ? 2 : 1;
                    for (let g = 0; g < glitchPasses; g++) {
                        const maybe = Math.random() < 0.65 ? pickGlitchChar() : real;
                        out[i] = current + maybe;
                        setPrinted([...out]);
                        await new Promise((r) => setTimeout(r, Math.max(18, speed / 4)));
                        if (cancelled) return;
                    }
                    current += real;
                    out[i] = current;
                    setPrinted([...out]);
                    await new Promise((r) => setTimeout(r, speed));
                }
                await new Promise((r) => setTimeout(r, pauseAfter));
            }
        };
        run();
        return () => { cancelled = true; };
    }, [lines]);

    useEffect(() => {
        if (!denyMode) return;
        spamTimer.current = setInterval(() => {
            setSpam((prev) => {
                const t = new Date().toISOString().slice(11, 19);
                const chunk = [
                    `${t}  ERROR  kernel panic — integrity compromised`,
                    `${t}  TRACE  $SYS/IO/TTY0  buffer overflow`,
                    `${t}  WARN   unauthorized handshake attempt`,
                ];
                return [...prev, ...chunk].slice(-18);
            });
        }, 90);
        return () => clearInterval(spamTimer.current);
    }, [denyMode]);

    return (
        <div className="intro-root">
            <div className="intro-terminal">
                {/* data-text = contenu réel → utilisé par le ::before CSS pour le glitch */}
                <div
                    className="intro-line intro-big"
                    data-text={printed[0] || "Wake up..."}
                >
                    {printed[0]}
                    <span className={`cursor ${cursorOn ? "on" : ""}`} />
                </div>

                <div
                    className="intro-line"
                    data-text={printed[1] || "Follow the white rabbit."}
                >
                    {printed[1]}
                    <span className={`cursor ${cursorOn ? "on" : ""}`} />
                </div>

                <div className="intro-actions">
                    <button className="intro-link" data-text="YES" onClick={onYes}>
                        YES
                    </button>
                    <button className="intro-link" data-text="NO" onClick={onNo}>
                        NO
                    </button>
                </div>

                {denyMode && (
                    <div className="intro-spam">
                        {spam.map((s, i) => (
                            <div key={i} className="intro-spam-line">{s}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default IntroScreen;
