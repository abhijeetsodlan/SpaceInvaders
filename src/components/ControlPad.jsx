/* eslint-disable react/prop-types */
import { FaArrowLeft, FaArrowRight, FaRocket } from "react-icons/fa";

const ControlPad = ({ onLeftTap, onRightTap, onLeftStart, onLeftEnd, onRightStart, onRightEnd, onShoot }) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.65rem)] pt-3 sm:px-6">
      <div className="grid w-full max-w-md grid-cols-3 gap-3 rounded-2xl border border-slate-600/70 bg-slate-900/70 p-2 backdrop-blur-md">
        <button
          onTouchStart={onLeftStart}
          onTouchEnd={onLeftEnd}
          onTouchCancel={onLeftEnd}
          onMouseDown={onLeftTap}
          className="flex h-14 items-center justify-center rounded-xl border border-slate-500/70 bg-slate-800/75 text-white transition active:scale-[0.98]"
          aria-label="Move left"
        >
          <FaArrowLeft size={20} />
        </button>

        <button
          onClick={onShoot}
          className="flex h-14 items-center justify-center rounded-xl border border-cyan-400/70 bg-cyan-500/20 text-cyan-300 transition hover:bg-cyan-500/30 active:scale-[0.98]"
          aria-label="Shoot"
        >
          <FaRocket size={26} />
        </button>

        <button
          onTouchStart={onRightStart}
          onTouchEnd={onRightEnd}
          onTouchCancel={onRightEnd}
          onMouseDown={onRightTap}
          className="flex h-14 items-center justify-center rounded-xl border border-slate-500/70 bg-slate-800/75 text-white transition active:scale-[0.98]"
          aria-label="Move right"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ControlPad;
