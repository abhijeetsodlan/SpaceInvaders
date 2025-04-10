import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaRocket } from "react-icons/fa";

// Reference spaceship image from public folder
const spaceshipImage = "./spaceship.png";
const enemyImage = "./enenmy.png";

const SpaceInvaders = () => {
  const [spaceshipX, setSpaceshipX] = useState(window.innerWidth / 2 - 64); // Adjusted for 128px width
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);


  // Ref for smooth movement
  const animationFrameRef = useRef();

  // Smooth movement logic
  const moveSmoothly = (newX) => {
    if (!gameOver) {
      cancelAnimationFrame(animationFrameRef.current);
      const start = spaceshipX;
      const target = Math.max(0, Math.min(newX, window.innerWidth - 128)); // 128px width
      const duration = 200; // Duration in milliseconds
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress; // Ease-in-out
        setSpaceshipX(start + (target - start) * ease);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        if (!gameOver) {
          setEnemies((prev) => [
            ...prev,
            { x: Math.random() * (window.innerWidth - 50), y: 0 },
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
          if (
            bullet.x < enemy.x + 50 &&
            bullet.x + 10 > enemy.x &&
            bullet.y < enemy.y + 50 &&
            bullet.y + 10 > enemy.y
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
        if (enemy.y + 50 >= window.innerHeight - 100) {
          setGameOver(true);
        }
      });
    }
  }, [enemies, startGame]);

  // Updated movement functions with smooth animation
  const moveLeft = () => {
    moveSmoothly(spaceshipX - 30);
  };

  const moveRight = () => {
    moveSmoothly(spaceshipX + 30);
  };

  const shootBullet = () => {
    if (!gameOver) {
      // Calculate bullet start position from the center of the spaceship
      const bulletX = spaceshipX + 64; // 64 is half of 128px width (center of spaceship)
      setBullets((prev) => [
        ...prev,
        { x: bulletX, y: window.innerHeight - 110 },
      ]);
    }
  };

  const restartGame = () => {
    cancelAnimationFrame(animationFrameRef.current); // Clean up animation
    setGameOver(false);
    setSpaceshipX(window.innerWidth / 2 - 64); // Reset to center
    setEnemies([]);
    setBullets([]);
    setScore(0);
    setStartGame(false);
  };

  const startGameHandler = () => {
    setStartGame(true);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center relative text-white">
      {!startGame && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
          <h1 className="text-white text-4xl font-bold mb-6">Space Invaders</h1>
          <p className="text-xl mb-5 text-gray-300">Instructions:</p>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
  <ol className="list-decimal list-inside space-y-3 text-gray-200">
    <li className="flex items-center">
      <span className="text-yellow-400 mr-2">1.</span>
      Use the <FaArrowLeft className="inline-block mx-1 text-yellow-400" /> and <FaArrowRight className="inline-block mx-1 text-yellow-400" /> keys to move your spaceship.
    </li>
    <li className="flex items-center">
      <span className="text-yellow-400 mr-2">2.</span>
      Press the <FaRocket className="inline-block mx-1 text-yellow-400" /> key to shoot.
    </li>
    <li className="flex items-center">
      <span className="text-yellow-400 mr-2">3.</span>
      Try to destroy the enemies before they reach the bottom.
    </li>
    <li className="flex items-center">
      <span className="text-yellow-400 mr-2">4.</span>
      The game ends if any enemy gets to the bottom.
    </li>
  </ol>
</div>

          <button
            onClick={startGameHandler}
            className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-md text-lg font-bold hover:bg-yellow-500 transition duration-300"
          >
            Start Game
          </button>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80">
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
          <div className="absolute top-5 left-5 text-lg font-bold">
            Score: {score}
          </div>
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
            className="absolute w-32 h-32 mb-14"
            style={{ left: spaceshipX, bottom: "100px" }}
          />
         <div className="absolute mb-14 bottom-5 w-full flex justify-around">
  <button
    onClick={moveLeft}
    className="text-white bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
  >
    <FaArrowLeft size={24} />
  </button>
  <button
    onClick={shootBullet}
    className="text-white bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
  >
    <FaRocket size={40} color={"yellow"} />
  </button>
  <button
    onClick={moveRight}
    className="text-white bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
  >
    <FaArrowRight size={24} />
  </button>
</div>
        </>
      )}
    </div>
  );
};

export default SpaceInvaders;