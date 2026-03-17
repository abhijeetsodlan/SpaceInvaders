/* eslint-disable react/prop-types */
import { BULLET_SIZE } from "../game/constants";

const GameScene = ({ enemies, bullets, enemySize, shipSize, shipBottom, shipX, enemyImage, spaceshipImage }) => {
  return (
    <div className="absolute inset-0 pt-16">
      {enemies.map((enemy) => (
        <img
          key={enemy.id}
          src={enemyImage}
          alt="Enemy"
          className="absolute select-none drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]"
          style={{
            width: enemySize,
            height: enemySize,
            top: enemy.y,
            left: enemy.x,
          }}
        />
      ))}

      {bullets.map((bullet) => (
        <div
          key={bullet.id}
          className="absolute rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)]"
          style={{
            width: BULLET_SIZE,
            height: BULLET_SIZE,
            top: bullet.y,
            left: bullet.x,
          }}
        />
      ))}

      <img
        src={spaceshipImage}
        alt="Spaceship"
        className="absolute select-none drop-shadow-[0_0_28px_rgba(59,130,246,0.6)]"
        style={{
          width: shipSize,
          height: shipSize,
          bottom: shipBottom,
          left: shipX,
        }}
      />
    </div>
  );
};

export default GameScene;
