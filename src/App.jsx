import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaRocket } from "react-icons/fa";

const spaceshipImage = "./spaceship.png";
const enemyImage = "./enenmy.png";

const SpaceInvaders = () => {
  const containerRef = useRef(null);
  const [spaceshipX, setSpaceshipX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(360); // default for mobile
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const animationFrameRef = useRef();

  const moveSmoothly = (newX) => {
    if (!gameOver) {
      cancelAnimationFrame(animationFrameRef.current);
      const start = spaceshipX;
      const target = Math.max(0, Math.min(newX, containerWidth - 128));
      const duration = 200;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        setSpaceshipX(start + (target - start) * ease);
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const moveLeft = () => moveSmoothly(spaceshipX - 30);
  const moveRight = () => moveSmoothly(spaceshipX + 30);
  const shootBullet = () => {
    if (!gameOver) {
      const bulletX = spaceshipX + 64;
      setBullets((prev) => [...prev, { x: bulletX, y: window.innerHeight - 170 }]);
    }
  };

  const restartGame = () => {
    cancelAnimationFrame(animationFrameRef.current);
    setGameOver(false);
    setEnemies([]);
    setBullets([]);
    setScore(0);
    setStartGame(false);
    setSpaceshipX(containerWidth / 2 - 64);
  };

  const startGameHandler = () => {
    setStartGame(true);
  };

  useEffect(() => {
    const img = new Image();
    img.src = enemyImage;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!startGame || gameOver) return;
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
      if (e.code === "Space") shootBullet();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [spaceshipX, gameOver, startGame]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setContainerWidth(width);
        setSpaceshipX(width / 2 - 64); // center ship
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        if (!gameOver && containerRef.current) {
          const width = containerRef.current.clientWidth;
          setEnemies((prev) => [
            ...prev,
            { x: Math.random() * (width - 80), y: 0 },
          ]);
        }
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [gameOver, startGame]);

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        if (!gameOver) {
          setEnemies((prev) =>
            prev
              .map((enemy) => ({ ...enemy, y: enemy.y + 10 }))
              .filter((enemy) => enemy.y < window.innerHeight)
          );
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameOver, startGame]);

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        setBullets((prev) =>
          prev
            .map((bullet) => ({ ...bullet, y: bullet.y - 15 }))
            .filter((bullet) => bullet.y > 0)
        );
      }, 50);
      return () => clearInterval(interval);
    }
  }, [startGame]);

  useEffect(() => {
    if (startGame) {
      bullets.forEach((bullet) => {
        enemies.forEach((enemy) => {
          const enemyWidth = 80, enemyHeight = 80, bulletWidth = 16, bulletHeight = 16;
          const bulletLeft = bullet.x - bulletWidth / 2;
          const bulletRight = bullet.x + bulletWidth / 2;
          const bulletTop = bullet.y - bulletHeight / 2;
          const bulletBottom = bullet.y + bulletHeight / 2;
          const enemyLeft = enemy.x;
          const enemyRight = enemy.x + enemyWidth;
          const enemyTop = enemy.y;
          const enemyBottom = enemy.y + enemyHeight;

          if (
            bulletRight > enemyLeft &&
            bulletLeft < enemyRight &&
            bulletBottom > enemyTop &&
            bulletTop < enemyBottom
          ) {
            setScore((prev) => prev + 1);
            setEnemies((prev) => prev.filter((e) => e !== enemy));
            setBullets((prev) => prev.filter((b) => b !== bullet));
          }
        });
      });
    }
  }, [bullets, enemies, startGame]);

  useEffect(() => {
    if (startGame) {
      enemies.forEach((enemy) => {
        if (enemy.y + 80 >= window.innerHeight - 100) {
          setGameOver(true);
        }
      });
    }
  }, [enemies, startGame]);

  return (
    <div className="overflow-hidden bg-black min-h-screen w-full flex items-center justify-center">
      <div ref={containerRef} className="relative bg-black border border-white w-full max-w-2xl h-screen mx-auto">
        {!startGame && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-center px-4">
            <h1 className="text-white text-5xl font-extrabold mb-8 tracking-widest">🚀 Space Invaders</h1>
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg shadow-2xl w-full max-w-sm">
              <h2 className="text-xl text-yellow-400 font-bold mb-4">How to Play</h2>
              <ul className="text-left space-y-3 text-gray-300 text-sm">
                <li><b>←</b> Move Left</li>
                <li><b>→</b> Move Right</li>
                <li><b>Spacebar</b> to Shoot</li>
                <li>Destroy enemies before they reach the bottom.</li>
              </ul>
              <button
                onClick={startGameHandler}
                className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-md text-lg font-bold hover:bg-yellow-500 transition duration-300 w-full"
              >
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90">
            <h1 className="text-red-500 text-4xl font-bold mb-6">Game Over</h1>
            <div className="text-white text-lg mb-4">Final Score: {score}</div>
            <button
              onClick={restartGame}
              className="bg-yellow-400 text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-500 transition duration-300"
            >
              Restart
            </button>
          </div>
        )}

        {startGame && !gameOver && (
          <>
            <div className="absolute top-5 left-4 text-sm font-bold text-white">Score: {score}</div>
            {enemies.map((enemy, index) => (
              <img
                key={index}
                src={enemyImage}
                alt="Enemy"
                className="absolute w-20 h-20"
                style={{ top: enemy.y, left: enemy.x }}
              />
            ))}
            {bullets.map((bullet, index) => (
              <div
                key={index}
                className="absolute bg-red-500 w-4 h-4 rounded-full"
                style={{ top: bullet.y, left: bullet.x }}
              />
            ))}
            <img
              src={spaceshipImage}
              alt="Spaceship"
              className="absolute w-32 h-32"
              style={{ left: spaceshipX, bottom: "100px" }}
            />
            <div className="absolute bottom-5 w-full flex justify-around px-4">
              <button onClick={moveLeft}>
                <FaArrowLeft size={24} className="text-white" />
              </button>
              <button onClick={shootBullet}>
                <FaRocket size={40} className="text-yellow-400" />
              </button>
              <button onClick={moveRight}>
                <FaArrowRight size={24} className="text-white" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpaceInvaders;
