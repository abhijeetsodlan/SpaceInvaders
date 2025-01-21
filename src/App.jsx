import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaRocket } from "react-icons/fa";

const SpaceInvaders = () => {
  const [spaceshipX, setSpaceshipX] = useState(window.innerWidth / 2 - 25);
  const [enemies, setEnemies] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);

  useEffect(() => {
    if (startGame) {
      const interval = setInterval(() => {
        if (!gameOver) {
          setEnemies((prev) => [
            ...prev,
            { x: Math.random() * (window.innerWidth - 50), y: 0 },
          ]);
        }
      }, 2000);

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

  const moveLeft = () => {
    if (!gameOver) {
      setSpaceshipX((prev) => Math.max(prev - 30, 0));
    }
  };

  const moveRight = () => {
    if (!gameOver) {
      setSpaceshipX((prev) => Math.min(prev + 30, window.innerWidth - 50));
    }
  };

  const shootBullet = () => {
    if (!gameOver) {
      setBullets((prev) => [
        ...prev,
        { x: spaceshipX + 20, y: window.innerHeight - 110 },
      ]);
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setSpaceshipX(window.innerWidth / 2 - 25);
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
          <p className="text-xl mb-5">Instructions:</p>
          <ul className="text-lg mb-5">
            <li>1. Use the <FaArrowLeft /> and <FaArrowRight /> buttons to move your spaceship left and right.</li>
            <li>2. Press the <FaRocket /> button to shoot bullets at the enemies.</li>
            <li>3. Your goal is to shoot as many enemies as possible before they reach the bottom of the screen.</li>
            <li>4. The game ends if an enemy reaches the bottom.</li>
          </ul>
          <button
            onClick={startGameHandler}
            className="bg-yellow-400 text-black px-6 py-3 rounded-md text-lg font-bold hover:bg-yellow-500"
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
            className="bg-yellow-400 text-black px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-500"
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
            <div
              key={index}
              className="absolute bg-red-500 w-12 h-12 rounded-lg"
              style={{ top: enemy.y, left: enemy.x }}
            ></div>
          ))}
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="absolute bg-yellow-400 w-4 h-4 rounded-full"
              style={{ top: bullet.y, left: bullet.x }}
            ></div>
          ))}
          <div
            className="absolute mb-14 bg-blue-500 w-12 h-12 rounded-lg"
            style={{ left: spaceshipX, bottom: "100px" }}
          ></div>
          <div className="absolute mb-14 bottom-5 w-full flex justify-around">
            <button
              onClick={moveLeft}
              className="text-white bg-gray-800 p-3 rounded-full hover:bg-gray-700"
            >
              <FaArrowLeft size={24} />
            </button>
            <button
              onClick={shootBullet}
              className="text-white bg-gray-800 p-3 rounded-full hover:bg-gray-700"
            >
              <FaRocket size={40} color={"yellow"} />
            </button>
            <button
              onClick={moveRight}
              className="text-white bg-gray-800 p-3 rounded-full hover:bg-gray-700"
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
