import { useRef } from "react";
import ControlPad from "./components/ControlPad";
import GameHud from "./components/GameHud";
import GameOverlay from "./components/GameOverlay";
import GameScene from "./components/GameScene";
import { enemyImage, spaceshipImage } from "./game/constants";
import { useGameAudio } from "./hooks/useGameAudio";
import { useGameEngine } from "./hooks/useGameEngine";

const SpaceInvaders = () => {
  const containerRef = useRef(null);
  const { muted, initAudio, playSound, toggleMuted } = useGameAudio();

  const {
    score,
    shipX,
    enemies,
    bullets,
    isPlaying,
    isGameOver,
    shipSize,
    enemySize,
    shipBottom,
    startGame,
    nudgeShip,
    setMoveLeft,
    setMoveRight,
    shoot,
  } = useGameEngine({
    containerRef,
    initAudio,
    playSound,
  });

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.2),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(14,165,233,0.14),transparent_45%)]" />
      </div>

      <main className="relative mx-auto h-full w-full max-w-6xl p-2 sm:p-4">
        <section
          ref={containerRef}
          className="relative h-full overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/85 via-slate-950/90 to-slate-950 shadow-[0_12px_60px_rgba(2,6,23,0.65)]"
        >
          <GameHud score={score} muted={muted} onToggleMute={toggleMuted} />

          <GameScene
            enemies={enemies}
            bullets={bullets}
            enemySize={enemySize}
            shipSize={shipSize}
            shipBottom={shipBottom}
            shipX={shipX}
            enemyImage={enemyImage}
            spaceshipImage={spaceshipImage}
          />

          <ControlPad
            onLeftTap={() => nudgeShip(-1)}
            onRightTap={() => nudgeShip(1)}
            onLeftStart={() => {
              initAudio();
              setMoveLeft(true);
            }}
            onLeftEnd={() => setMoveLeft(false)}
            onRightStart={() => {
              initAudio();
              setMoveRight(true);
            }}
            onRightEnd={() => setMoveRight(false)}
            onShoot={shoot}
          />

          {!isPlaying && <GameOverlay isGameOver={isGameOver} score={score} onStart={startGame} />}
        </section>
      </main>
    </div>
  );
};

export default SpaceInvaders;
