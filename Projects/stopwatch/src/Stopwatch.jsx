import { useEffect, useRef, useState } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatStopwatch = (milliseconds) => {
  const totalMs = Math.max(0, Math.floor(milliseconds));
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centiseconds = Math.floor((totalMs % 1000) / 10);

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  const cs = String(centiseconds).padStart(2, "0");

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${mm}:${ss}.${cs}`;
  }

  return `${mm}:${ss}.${cs}`;
};

const formatTimer = (totalSeconds) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
};

const Stopwatch = () => {
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const stopwatchStartRef = useRef(0);

  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  const timerTotal = timerMinutes * 60 + timerSeconds;

  useEffect(() => {
    if (!stopwatchRunning) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setStopwatchMs(Date.now() - stopwatchStartRef.current);
    }, 50);

    return () => window.clearInterval(intervalId);
  }, [stopwatchRunning]);

  useEffect(() => {
    if (!timerRunning) {
      setTimerRemaining(timerTotal);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimerRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setTimerRunning(false);
          setTimerFinished(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning, timerTotal]);

  const startStopwatch = () => {
    if (!stopwatchRunning) {
      stopwatchStartRef.current = Date.now() - stopwatchMs;
      setStopwatchRunning(true);
    }
  };

  const pauseStopwatch = () => {
    setStopwatchRunning(false);
  };

  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchMs(0);
    stopwatchStartRef.current = 0;
  };

  const startTimer = () => {
    if (timerTotal <= 0) {
      setTimerRemaining(0);
      setTimerFinished(false);
      return;
    }

    if (timerRemaining <= 0) {
      setTimerRemaining(timerTotal);
    }

    setTimerFinished(false);
    setTimerRunning(true);
  };

  const pauseTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerFinished(false);
    setTimerRemaining(timerTotal);
  };

  const clearTimer = () => {
    setTimerRunning(false);
    setTimerFinished(false);
    setTimerMinutes(0);
    setTimerSeconds(0);
    setTimerRemaining(0);
  };

  return (
    <main className="app-shell">
      <div
        className="app-shell__glow app-shell__glow--left"
        aria-hidden="true"
      />
      <div
        className="app-shell__glow app-shell__glow--right"
        aria-hidden="true"
      />

      <header className="hero">
        <p className="eyebrow eyebrow--center">Time tools</p>
        <h1>Stopwatch & Timer</h1>
        <p className="hero__copy">
          Track elapsed time or run a countdown with simple controls and a clear
          display.
        </p>
      </header>

      <div className="dashboard">
        <section className="panel panel--hero">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Stopwatch</p>
              <h2>Count up from zero</h2>
            </div>
            <span
              className={`status-badge ${stopwatchRunning ? "status-badge--live" : ""}`}
            >
              {stopwatchRunning
                ? "Running"
                : stopwatchMs > 0
                  ? "Paused"
                  : "Ready"}
            </span>
          </div>

          <div
            className="clock-display clock-display--stopwatch"
            aria-live="polite"
          >
            {formatStopwatch(stopwatchMs)}
          </div>

          <div className="panel__meta">
            <div className="stat-pill">
              <span className="stat-pill__label">Elapsed</span>
              <span className="stat-pill__value">
                {formatStopwatch(stopwatchMs)}
              </span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Mode</span>
              <span className="stat-pill__value">
                {stopwatchRunning ? "Counting up" : "Idle"}
              </span>
            </div>
          </div>

          <div className="controls">
            <button
              type="button"
              className="action-button action-button--primary"
              onClick={startStopwatch}
              disabled={stopwatchRunning}
            >
              Start
            </button>
            <button
              type="button"
              className="action-button"
              onClick={pauseStopwatch}
              disabled={!stopwatchRunning}
            >
              Pause
            </button>
            <button
              type="button"
              className="action-button"
              onClick={resetStopwatch}
            >
              Reset
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Timer</p>
              <h2>Set a countdown</h2>
            </div>
            <span
              className={`status-badge ${timerFinished ? "status-badge--alert" : ""}`}
            >
              {timerFinished
                ? "Time's up"
                : timerRunning
                  ? "Counting down"
                  : "Ready"}
            </span>
          </div>

          <div className="timer-inputs">
            <label className="field">
              <span>Minutes</span>
              <input
                type="number"
                min="0"
                max="999"
                value={timerMinutes}
                onChange={(event) =>
                  setTimerMinutes(
                    clamp(Number(event.target.value || 0), 0, 999),
                  )
                }
                disabled={timerRunning}
              />
            </label>

            <label className="field">
              <span>Seconds</span>
              <input
                type="number"
                min="0"
                max="59"
                value={timerSeconds}
                onChange={(event) =>
                  setTimerSeconds(clamp(Number(event.target.value || 0), 0, 59))
                }
                disabled={timerRunning}
              />
            </label>
          </div>

          <div className="clock-display" aria-live="polite">
            {formatTimer(timerRemaining)}
          </div>

          <div className="panel__meta">
            <div className="stat-pill">
              <span className="stat-pill__label">Remaining</span>
              <span className="stat-pill__value">
                {formatTimer(timerRemaining)}
              </span>
            </div>
            <div className="stat-pill">
              <span className="stat-pill__label">Input</span>
              <span className="stat-pill__value">
                {timerMinutes}m {timerSeconds}s
              </span>
            </div>
          </div>

          <div className="controls">
            <button
              type="button"
              className="action-button action-button--primary"
              onClick={startTimer}
              disabled={timerRunning || timerTotal <= 0}
            >
              Start
            </button>
            <button
              type="button"
              className="action-button"
              onClick={pauseTimer}
              disabled={!timerRunning}
            >
              Pause
            </button>
            <button
              type="button"
              className="action-button"
              onClick={resetTimer}
            >
              Reset
            </button>
            <button
              type="button"
              className="action-button action-button--ghost"
              onClick={clearTimer}
            >
              Clear
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Stopwatch;
