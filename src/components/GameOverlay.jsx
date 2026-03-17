/* eslint-disable react/prop-types */
const GameOverlay = ({ isGameOver, score, onStart }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-900/95 p-6 text-center shadow-2xl">
        <h1 className="text-3xl font-black uppercase tracking-[0.18em] text-cyan-300 sm:text-4xl">Space Invaders</h1>
        <p className="mt-3 text-sm text-slate-300">Move fast, destroy incoming enemies, and keep the line secure.</p>
        <div className="mt-6 space-y-2 rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-left text-sm text-slate-200">
          <p>Arrow Keys or On-screen Buttons: Move</p>
          <p>Spacebar or Rocket Button: Shoot</p>
          <p>Enemies reaching your line ends the run.</p>
        </div>
        {isGameOver && <p className="mt-5 text-lg font-semibold text-rose-400">Game Over - Final Score: {score}</p>}
        <button
          onClick={onStart}
          className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-cyan-300 active:scale-[0.99]"
        >
          {isGameOver ? "Play Again" : "Start Mission"}
        </button>
      </div>
    </div>
  );
};

export default GameOverlay;
