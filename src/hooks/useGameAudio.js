import { useCallback, useEffect, useRef, useState } from "react";

export const useGameAudio = () => {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const [muted, setMuted] = useState(false);

  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    const context = new window.AudioContext();
    const gain = context.createGain();
    gain.gain.value = muted ? 0 : 0.12;
    gain.connect(context.destination);
    audioContextRef.current = context;
    masterGainRef.current = gain;
  }, [muted]);

  const playSound = useCallback(
    (type) => {
      const context = audioContextRef.current;
      const gain = masterGainRef.current;
      if (!context || !gain || muted) return;

      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const nodeGain = context.createGain();
      oscillator.connect(nodeGain);
      nodeGain.connect(gain);

      if (type === "shoot") {
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(320, now);
        oscillator.frequency.exponentialRampToValueAtTime(160, now + 0.08);
        nodeGain.gain.setValueAtTime(0.18, now);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        oscillator.start(now);
        oscillator.stop(now + 0.09);
        return;
      }

      if (type === "hit") {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(620, now);
        oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.12);
        nodeGain.gain.setValueAtTime(0.22, now);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        oscillator.start(now);
        oscillator.stop(now + 0.13);
        return;
      }

      if (type === "gameover") {
        oscillator.type = "sawtooth";
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.45);
        nodeGain.gain.setValueAtTime(0.3, now);
        nodeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        oscillator.start(now);
        oscillator.stop(now + 0.45);
      }
    },
    [muted]
  );

  const toggleMuted = useCallback(() => {
    initAudio();
    setMuted((previous) => !previous);
  }, [initAudio]);

  useEffect(() => {
    if (!audioContextRef.current || !masterGainRef.current) return;
    masterGainRef.current.gain.setValueAtTime(muted ? 0 : 0.12, audioContextRef.current.currentTime);
  }, [muted]);

  return {
    muted,
    initAudio,
    playSound,
    toggleMuted,
  };
};
