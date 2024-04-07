import { useRef, useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

const Pong = () => {
  const canvasRef = useRef(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const [ball, setBall] = useState({
    x: 400,
    y: 300,
    dx: 5,
    dy: 5,
    radius: 10,
  });

  const [paddleLeft, setPaddleLeft] = useState({
    y: 250,
    height: 100,
    width: 20,
  });

  const [paddleRight, setPaddleRight] = useState({
    y: 250,
    height: 100,
    width: 20,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    console.log("Initial ball state:", ball);

    const render = () => {
      console.log("Updating ball position:", ball);
      setBall((ball) => ({ ...ball, x: ball.x + ball.dx, y: ball.y + ball.dy }));

      if ((ball.x <= paddleLeft.width && ball.y > paddleLeft.y && ball.y < paddleLeft.y + paddleLeft.height) || (ball.x >= 800 - paddleRight.width && ball.y > paddleRight.y && ball.y < paddleRight.y + paddleRight.height)) {
        setBall((ball) => ({ ...ball, dx: -ball.dx }));
      }

      if (ball.y <= 0 || ball.y >= 600) {
        setBall((ball) => ({ ...ball, dy: -ball.dy }));
      }

      if (ball.x <= 0) {
        setScores((scores) => {
          const newScores = { ...scores, player2: scores.player2 + 1 };
          console.log("Player 2 scored, resetting ball. New scores:", newScores);
          return newScores;
        });
        resetBall();
      } else if (ball.x >= 800) {
        setScores((scores) => {
          const newScores = { ...scores, player1: scores.player1 + 1 };
          console.log("Player 1 scored, resetting ball. New scores:", newScores);
          return newScores;
        });
        resetBall();
      }

      ctx.clearRect(0, 0, 800, 600);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, paddleLeft.y, paddleLeft.width, paddleLeft.height);
      ctx.fillRect(800 - paddleRight.width, paddleRight.y, paddleRight.width, paddleRight.height);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${scores.player1} | ${scores.player2}`, 400, 50);
    };

    const resetBall = () => {
      setBall({
        x: 400,
        y: 300,
        dx: 5,
        dy: 5,
        radius: 10,
      });
    };

    const onKeyDown = (e) => {
      console.log("Key pressed:", e.key);
      if (e.key === "ArrowUp" && paddleRight.y > 0) {
        setPaddleRight((paddle) => {
          const newPaddle = { ...paddle, y: paddle.y - 20 };
          console.log("Updated right paddle:", newPaddle);
          return newPaddle;
        });
      } else if (e.key === "ArrowDown" && paddleRight.y < 500) {
        setPaddleRight((paddle) => {
          const newPaddle = { ...paddle, y: paddle.y + 20 };
          console.log("Updated right paddle:", newPaddle);
          return newPaddle;
        });
      } else if (e.key === "w" && paddleLeft.y > 0) {
        setPaddleLeft((paddle) => {
          const newPaddle = { ...paddle, y: paddle.y - 20 };
          console.log("Updated left paddle:", newPaddle);
          return newPaddle;
        });
      } else if (e.key === "s" && paddleLeft.y < 500) {
        setPaddleLeft((paddle) => {
          const newPaddle = { ...paddle, y: paddle.y + 20 };
          console.log("Updated left paddle:", newPaddle);
          return newPaddle;
        });
      }
    };

    const gameLoop = setInterval(render, 1000 / 60);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearInterval(gameLoop);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <Box borderWidth={1} borderRadius="lg">
      <canvas ref={canvasRef} width="800" height="600" />
    </Box>
  );
};

export default Pong;
