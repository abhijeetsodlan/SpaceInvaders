/* eslint-disable react/prop-types */
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const GameHud = ({ score, muted, onToggleMute }) => {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-slate-700/70 bg-slate-900/55 px-3 py-3 backdrop-blur-md sm:px-5">
      <div className="text-left">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-300/85">Space Defense</p>
        <p className="text-sm font-semibold text-slate-100 sm:text-base">Score: {score}</p>
      </div>
      <button
        onClick={onToggleMute}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-500/70 bg-slate-800/80 text-slate-200 transition hover:border-slate-300 hover:text-white"
        aria-label={muted ? "Unmute sound" : "Mute sound"}
      >
        {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
      </button>
    </div>
  );
};

export default GameHud;
