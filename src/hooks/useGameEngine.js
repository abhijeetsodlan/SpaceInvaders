import { useCallback, useEffect, useRef, useState } from "react";
import {
  BULLET_SIZE,
  DESKTOP_CONTROL_HEIGHT,
  MOBILE_CONTROL_HEIGHT,
  SHOT_COOLDOWN_MS,
  clamp,
  enemyImage,
} from "../game/constants";

export const useGameEngine = ({ containerRef, initAudio, playSound }) => {
  const gameFrameRef = useRef(0);
  const previousTimeRef = useRef(0);
  const spawnAccumulatorRef = useRef(0);
  const shipTargetXRef = useRef(0);
  const shipCurrentXRef = useRef(0);
  const pressedKeysRef = useRef({ left: false, right: false, shoot: false });
  const lastShotTimeRef = useRef(0);
  const nextEnemyIdRef = useRef(1);
  const nextBulletIdRef = useRef(1);
  const enemiesRef = useRef([]);
  const bulletsRef = useRef([]);
  const scoreRef = useRef(0);
  const playingRef = useRef(false);

  const [phase, setPhase] = useState("menu");
  const [score, setScore] = useState(0);
  const [shipX, setShipX] = useState(0);
  const [bounds, setBounds] = useState({ width: 360, height: 640 });
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);

  const isPlaying = phase === "playing";
  const isGameOver = phase === "gameover";
  const isMobile = bounds.width < 640;
  const shipSize = isMobile ? 76 : 92;
  const enemySize = isMobile ? 54 : 64;
  const controlHeight = isMobile ? MOBILE_CONTROL_HEIGHT : DESKTOP_CONTROL_HEIGHT;
  const shipBottom = controlHeight + 8;
  const bulletSpeed = 680;
  const shipSpeed = isMobile ? 360 : 460;

  const centerShip = useCallback(
    (widthValue = bounds.width) => {
      const centered = widthValue / 2 - shipSize / 2;
      shipTargetXRef.current = centered;
      shipCurrentXRef.current = centered;
      setShipX(centered);
    },
    [bounds.width, shipSize]
  );

  const syncBounds = useCallback(() => {
    if (!containerRef.current) return;
    const nextWidth = containerRef.current.clientWidth;
    const nextHeight = containerRef.current.clientHeight;
    setBounds({ width: nextWidth, height: nextHeight });
  }, [containerRef]);

  const spawnBullet = useCallback(() => {
    const now = performance.now();
    if (now - lastShotTimeRef.current < SHOT_COOLDOWN_MS || !playingRef.current) return;

    const bullet = {
      id: nextBulletIdRef.current++,
      x: shipCurrentXRef.current + shipSize / 2,
      y: bounds.height - shipBottom - shipSize + 2,
    };

    lastShotTimeRef.current = now;
    const nextBullets = [...bulletsRef.current, bullet];
    bulletsRef.current = nextBullets;
    setBullets(nextBullets);
    playSound("shoot");
  }, [bounds.height, playSound, shipBottom, shipSize]);

  const nudgeShip = useCallback(
    (direction) => {
      if (!playingRef.current) return;
      initAudio();
      const maxX = bounds.width - shipSize;
      const nextTarget = shipTargetXRef.current + direction * (isMobile ? 42 : 54);
      shipTargetXRef.current = clamp(nextTarget, 0, maxX);
    },
    [bounds.width, initAudio, isMobile, shipSize]
  );

  const setMoveLeft = useCallback((active) => {
    pressedKeysRef.current.left = active;
  }, []);

  const setMoveRight = useCallback((active) => {
    pressedKeysRef.current.right = active;
  }, []);

  const shoot = useCallback(() => {
    initAudio();
    spawnBullet();
  }, [initAudio, spawnBullet]);

  const startGame = useCallback(() => {
    initAudio();
    setPhase("playing");
    playingRef.current = true;
    setScore(0);
    scoreRef.current = 0;
    setEnemies([]);
    enemiesRef.current = [];
    setBullets([]);
    bulletsRef.current = [];
    spawnAccumulatorRef.current = 0;
    previousTimeRef.current = 0;
    lastShotTimeRef.current = 0;
    centerShip();
  }, [centerShip, initAudio]);

  const endGame = useCallback(() => {
    playingRef.current = false;
    setPhase("gameover");
    playSound("gameover");
  }, [playSound]);

  useEffect(() => {
    const imagePreload = new Image();
    imagePreload.src = enemyImage;
  }, []);

  useEffect(() => {
    syncBounds();
    const observer = new ResizeObserver(() => syncBounds());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef, syncBounds]);

  useEffect(() => {
    centerShip(bounds.width);
  }, [bounds.width, centerShip, shipSize]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!playingRef.current) return;
      if (event.key === "ArrowLeft") pressedKeysRef.current.left = true;
      if (event.key === "ArrowRight") pressedKeysRef.current.right = true;
      if (event.code === "Space") {
        event.preventDefault();
        initAudio();
        pressedKeysRef.current.shoot = true;
      }
    };

    const onKeyUp = (event) => {
      if (event.key === "ArrowLeft") pressedKeysRef.current.left = false;
      if (event.key === "ArrowRight") pressedKeysRef.current.right = false;
      if (event.code === "Space") pressedKeysRef.current.shoot = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [initAudio]);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(gameFrameRef.current);
      return undefined;
    }

    const tick = (time) => {
      if (!previousTimeRef.current) previousTimeRef.current = time;
      const deltaSeconds = Math.min((time - previousTimeRef.current) / 1000, 0.033);
      previousTimeRef.current = time;

      const keys = pressedKeysRef.current;
      const maxX = bounds.width - shipSize;
      let nextTargetX = shipTargetXRef.current;

      if (keys.left) nextTargetX -= shipSpeed * deltaSeconds;
      if (keys.right) nextTargetX += shipSpeed * deltaSeconds;
      shipTargetXRef.current = clamp(nextTargetX, 0, maxX);

      const blend = 1 - Math.exp(-14 * deltaSeconds);
      const nextShipX = shipCurrentXRef.current + (shipTargetXRef.current - shipCurrentXRef.current) * blend;
      shipCurrentXRef.current = nextShipX;
      setShipX(nextShipX);

      if (keys.shoot) {
        spawnBullet();
      }

      spawnAccumulatorRef.current += deltaSeconds;
      const spawnEvery = Math.max(0.5, 1.2 - scoreRef.current * 0.01);
      const nextEnemies = [...enemiesRef.current];

      while (spawnAccumulatorRef.current >= spawnEvery) {
        spawnAccumulatorRef.current -= spawnEvery;
        nextEnemies.push({
          id: nextEnemyIdRef.current++,
          x: Math.random() * Math.max(0, bounds.width - enemySize),
          y: -enemySize,
        });
      }

      const enemyFallSpeed = 95 + Math.min(scoreRef.current * 2.2, 120);
      let updatedEnemies = nextEnemies
        .map((enemy) => ({ ...enemy, y: enemy.y + enemyFallSpeed * deltaSeconds }))
        .filter((enemy) => enemy.y <= bounds.height);

      let updatedBullets = bulletsRef.current
        .map((bullet) => ({ ...bullet, y: bullet.y - bulletSpeed * deltaSeconds }))
        .filter((bullet) => bullet.y >= -BULLET_SIZE);

      let hitCount = 0;
      const removedEnemies = new Set();
      const removedBullets = new Set();

      for (const bullet of updatedBullets) {
        for (const enemy of updatedEnemies) {
          if (removedEnemies.has(enemy.id)) continue;

          const collides =
            bullet.x + BULLET_SIZE > enemy.x &&
            bullet.x - BULLET_SIZE < enemy.x + enemySize &&
            bullet.y + BULLET_SIZE > enemy.y &&
            bullet.y - BULLET_SIZE < enemy.y + enemySize;

          if (collides) {
            removedEnemies.add(enemy.id);
            removedBullets.add(bullet.id);
            hitCount += 1;
            break;
          }
        }
      }

      if (hitCount > 0) {
        playSound("hit");
        scoreRef.current += hitCount;
        setScore(scoreRef.current);
      }

      if (removedEnemies.size > 0) {
        updatedEnemies = updatedEnemies.filter((enemy) => !removedEnemies.has(enemy.id));
      }

      if (removedBullets.size > 0) {
        updatedBullets = updatedBullets.filter((bullet) => !removedBullets.has(bullet.id));
      }

      const gameOverLine = bounds.height - shipBottom - shipSize / 2;
      const touchedBottom = updatedEnemies.some((enemy) => enemy.y + enemySize >= gameOverLine);

      enemiesRef.current = updatedEnemies;
      bulletsRef.current = updatedBullets;
      setEnemies(updatedEnemies);
      setBullets(updatedBullets);

      if (touchedBottom) {
        endGame();
        return;
      }

      if (!playingRef.current) return;
      gameFrameRef.current = requestAnimationFrame(tick);
    };

    gameFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(gameFrameRef.current);
  }, [bounds.height, bounds.width, bulletSpeed, enemySize, endGame, isPlaying, playSound, shipBottom, shipSize, shipSpeed, spawnBullet]);

  return {
    phase,
    score,
    shipX,
    bounds,
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
  };
};
