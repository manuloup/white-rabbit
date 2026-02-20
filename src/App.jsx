import { useEffect, useRef, useState, useCallback } from "react";
import "./styles/App.css";

import MatrixRain from "./components/MatrixRain";
import QuestionDialog from "./components/QuestionDialog";
import InfoDialog from "./components/InfoDialog";
import IntroScreen from "./components/IntroScreen";

import { questions, infoCells, pathCoordinates } from "./data/gameData";

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShuffledQuestion(q) {
  const entries = q.options.map((text, idx) => ({ text, isCorrect: idx === q.correct }));
  const shuffled = shuffleArray(entries);
  return {
    ...q,
    options: shuffled.map((x) => x.text),
    correct: shuffled.findIndex((x) => x.isCorrect),
  };
}

const CELL_SIZE = 68;
const MAX_LIVES = 3;
const QUESTION_TIME = 10;

function App() {
  const [phase, setPhase] = useState("intro");
  const [denyMode, setDenyMode] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [currentCell, setCurrentCell] = useState(0);
  const [answeredCells, setAnsweredCells] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerActive, setTimerActive] = useState(false);

  const [glitchPulse, setGlitchPulse] = useState(false);
  const [bigGlitch, setBigGlitch] = useState(false);
  const [hudFlash, setHudFlash] = useState({ score: false });
  const [rabbitScreen, setRabbitScreen] = useState({ x: -999, y: -999 });

  const boardRef = useRef(null);
  const totalCells = pathCoordinates.length;

  const updateRabbitPos = useCallback(() => {
    const viewport = boardRef.current;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const pos = pathCoordinates[currentCell];
    setRabbitScreen({
      x: rect.left + pos.x - viewport.scrollLeft,
      y: rect.top + pos.y - viewport.scrollTop,
    });
  }, [currentCell]);

  useEffect(() => {
    if (phase !== "game") return;
    updateRabbitPos();
  }, [currentCell, phase, updateRabbitPos]);

  useEffect(() => {
    if (phase !== "game") return;
    const viewport = boardRef.current;
    if (!viewport) return;
    viewport.addEventListener("scroll", updateRabbitPos);
    window.addEventListener("resize", updateRabbitPos);
    return () => {
      viewport.removeEventListener("scroll", updateRabbitPos);
      window.removeEventListener("resize", updateRabbitPos);
    };
  }, [phase, updateRabbitPos]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || answered) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setAnswered(true);
      setIsCorrect(false);
      setSelectedOption(null);
      setAnsweredCells((prev) => [...prev, currentCell]);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(() => { setShowQuestion(false); setGameOver(true); }, 900);
        return next;
      });
      microGlitch();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft, answered]);

  useEffect(() => {
    if (phase !== "game") return;
    const t = setInterval(() => {
      if (Math.random() < 0.06) {
        setBigGlitch(true);
        setTimeout(() => setBigGlitch(false), 200);
      }
    }, 7000);
    return () => clearInterval(t);
  }, [phase]);

  const microGlitch = () => {
    setGlitchPulse(true);
    setTimeout(() => setGlitchPulse(false), 130);
    if (Math.random() < 0.10) {
      setBigGlitch(true);
      setTimeout(() => setBigGlitch(false), 180);
    }
  };

  const flashHud = (key) => {
    setHudFlash(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setHudFlash(prev => ({ ...prev, [key]: false })), 350);
  };

  useEffect(() => {
    if (phase !== "game") return;
    const viewport = boardRef.current;
    if (!viewport) return;
    const pos = pathCoordinates[currentCell];
    viewport.scrollTo({ left: Math.max(0, pos.x - viewport.clientWidth / 2), behavior: "smooth" });
    setTimeout(updateRabbitPos, 400);
  }, [currentCell, phase]);

  useEffect(() => {
    if (phase !== "game") return;
    const viewport = boardRef.current;
    if (!viewport) return;
    const handleWheel = (e) => {
      e.preventDefault();
      viewport.scrollLeft += e.deltaY;
      updateRabbitPos();
    };
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [phase, updateRabbitPos]);

  const handleIntroYes = () => { microGlitch(); setPhase("game"); };
  const handleIntroNo = () => {
    microGlitch(); setDenyMode(true);
    setTimeout(() => setBigGlitch(true), 80);
    setTimeout(() => setBigGlitch(false), 220);
    setTimeout(() => setBigGlitch(true), 360);
    setTimeout(() => setBigGlitch(false), 520);
    setTimeout(() => window.location.reload(), 1600);
  };

  const handleCellClick = (index) => {
    if (phase !== "game") return;
    microGlitch();
    if (index !== currentCell || answeredCells.includes(index)) return;
    if (infoCells[index]) {
      setCurrentInfo(infoCells[index]);
      setShowInfo(true);
      if (infoCells[index].type === "bonus") { setScore((s) => s + infoCells[index].points); flashHud("score"); }
      setAnsweredCells((prev) => [...prev, index]);
    } else {
      const q = buildShuffledQuestion(questions[index % questions.length]);
      setCurrentQuestion(q);
      setShowQuestion(true);
      setAnswered(false);
      setSelectedOption(null);
      setIsCorrect(false);
      setTimeLeft(QUESTION_TIME);
      setTimerActive(true);
    }
  };

  const handleAnswer = (optionIndex, isNext = false) => {
    microGlitch();
    if (isNext) {
      setShowQuestion(false);
      setAnswered(false);
      setSelectedOption(null);
      setTimerActive(false);
      currentCell + 1 >= totalCells ? setGameOver(true) : setCurrentCell((c) => c + 1);
      return;
    }
    if (answered) return;
    setTimerActive(false);
    const correct = optionIndex === currentQuestion.correct;
    setSelectedOption(optionIndex);
    setIsCorrect(correct);
    setAnswered(true);
    setAnsweredCells((prev) => [...prev, currentCell]);
    if (correct) {
      setScore((s) => s + currentQuestion.points);
      flashHud("score");
    } else {
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(() => { setShowQuestion(false); setGameOver(true); }, 900);
        return next;
      });
    }
  };

  const handleInfoClose = () => {
    microGlitch();
    setShowInfo(false);
    currentCell + 1 >= totalCells ? setGameOver(true) : setCurrentCell((c) => c + 1);
  };

  const restartGame = () => {
    microGlitch();
    setScore(0); setLives(MAX_LIVES);
    setCurrentCell(0); setAnsweredCells([]);
    setGameOver(false); setShowQuestion(false); setShowInfo(false);
    setTimerActive(false); setTimeLeft(QUESTION_TIME);
    setPhase("intro"); setDenyMode(false);
  };

  const renderPaths = () =>
    pathCoordinates.slice(0, -1).map((start, i) => {
      const end = pathCoordinates[i + 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return (
        <div key={`path-${i}`} className="path-line" style={{
          left: `${start.x}px`, top: `${start.y}px`,
          width: `${length}px`, transform: `rotate(${angle}deg)`,
        }} />
      );
    });

  const half = CELL_SIZE / 2;
  const rabbitVisible = phase === "game" && !gameOver && !showQuestion && !showInfo;

  const getEndScreen = () => {
    const livesLost = MAX_LIVES - lives;
    if (lives <= 0) return { title: "GAME OVER", sub: "La Matrice t'a eu. Recommence." };
    if (livesLost === 0) return { title: "THE ONE", sub: "Tu vois le code. Tu es Neo." };
    if (livesLost === 1) return { title: "HACKEUR CONFIRME", sub: "La Matrice commence a se fissurer." };
    return { title: "ENCORE DANS LA MATRICE", sub: "La pilule bleue etait plus facile." };
  };
  const endScreen = getEndScreen();

  return (
    <div className={`app ${glitchPulse ? "glitch-pulse" : ""}`}>
      {bigGlitch && <div className="glitch-overlay" />}

      {/* LAPIN — enfant direct de .app */}
      {rabbitVisible && (
        <img
          src="/src/assets/rabbit.png"
          alt="White Rabbit"
          style={{
            position: "fixed",
            left: rabbitScreen.x - 40,
            top: rabbitScreen.y - 52,
            width: "80px",
            height: "auto",
            zIndex: 9995,
            pointerEvents: "none",
            opacity: 0.97,
            filter:
              "grayscale(1) brightness(2.8) contrast(1.1) " +
              "drop-shadow(0 0 14px rgba(255,255,255,0.9)) " +
              "drop-shadow(0 0 30px rgba(232,255,244,0.6))",
            animation: "rabbitBreath 2.8s ease-in-out infinite",
          }}
        />
      )}

      {/* Vies — fixed au-dessus de tout y compris les modals */}
      {phase === "game" && (
        <div className="lives-fixed">
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={`life-dot ${i < lives ? "alive" : "dead"}`}>■</span>
          ))}
        </div>
      )}

      {phase === "intro" && (
        <IntroScreen denyMode={denyMode} onYes={handleIntroYes} onNo={handleIntroNo} />
      )}

      {phase === "game" && (
        <div className="window">

          {/* Topbar */}
          <div className="topbar">
            <div className="brand">
              <span className="brand-dot">■</span>
              <span className="brand-text" data-scramble="FOLLOW THE WHITE RABBIT">
                FOLLOW THE WHITE RABBIT
              </span>
            </div>
            <div className="hud">
              <div className={`hud-line ${hudFlash.score ? "hud-flash" : ""}`}>SCORE: {score}</div>
              <div className="hud-line">NODE: {currentCell + 1}/{totalCells}</div>
            </div>
          </div>

          {!gameOver ? (
            <div className="content">
              <MatrixRain />
              <div className="board-viewport" ref={boardRef}>
                <div className="board-track">
                  {renderPaths()}
                  {pathCoordinates.map((pos, i) => {
                    const cellInfo = infoCells[i];
                    const isCurrent = i === currentCell;
                    return (
                      <div
                        key={i}
                        className={[
                          "cell",
                          isCurrent ? "current rabbit-here" : "",
                          answeredCells.includes(i) ? "answered" : "",
                          cellInfo ? `cell-${cellInfo.type}` : "cell-question",
                        ].join(" ")}
                        style={{ left: `${pos.x - half}px`, top: `${pos.y - half}px` }}
                        onClick={() => handleCellClick(i)}
                        title={cellInfo ? cellInfo.title : `Question ${i + 1}`}
                      >
                        {cellInfo ? (
                          <span className="cell-mark">{cellInfo.type === "bonus" ? "■" : "□"}</span>
                        ) : (
                          <span className="cell-num">{i + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="content">
              <MatrixRain />
              <div className="game-over">
                <div className="game-over-title" data-text={endScreen.title}>{endScreen.title}</div>
                <div className="game-over-sub">{endScreen.sub}</div>
                <div className="game-over-stats">
                  <div>SCORE: {score}</div>
                  <div>VIES RESTANTES: {lives < 0 ? 0 : lives}</div>
                </div>
                <div className="game-over-actions">
                  <button className="link-action" data-text="RESTART" onClick={restartGame}>RESTART</button>
                </div>
              </div>
            </div>
          )}

          {showQuestion && (
            <QuestionDialog
              question={currentQuestion}
              onAnswer={handleAnswer}
              answered={answered}
              selectedOption={selectedOption}
              isCorrect={isCorrect}
              timeLeft={timeLeft}
              totalTime={QUESTION_TIME}
            />
          )}
          {showInfo && <InfoDialog cellData={currentInfo} onClose={handleInfoClose} />}
        </div>
      )}
    </div>
  );
}

export default App;
