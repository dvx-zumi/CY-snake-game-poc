import { useEffect, useRef, useState } from "react";
import { useAudio } from "@/lib/stores/useAudio";
import { useGame } from "@/lib/stores/useGame";
import useSnakeGame from "@/hooks/useSnakeGame";
import ScoreBoard from "./ScoreBoard";
import GameControls from "./GameControls";
import MobileControls from "./MobileControls";
import { isMobile } from "@/hooks/use-is-mobile";
import { CELL_SIZE, GRID_SIZE } from "@/lib/constants";

interface CanvasGameProps {
  onGameOver: (score: number) => void;
}

const CanvasGame = ({ onGameOver }: CanvasGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { phase, start, end } = useGame();
  const { toggleMute, isMuted, playHit, playSuccess } = useAudio();
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const mobile = isMobile();
  
  console.log("CanvasGame rendering, phase:", phase);

  // Create snake game hook
  const {
    snake,
    food,
    foodType,
    direction,
    score,
    gameOver,
    setDirection,
    resetGame,
  } = useSnakeGame({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    onFoodCollected: () => {
      console.log("Food collected! Playing success sound");
      playSuccess();
    },
    onGameOver: () => {
      console.log("Game over! Score:", score);
      playHit();
      end();
      onGameOver(score);
    },
  });

  // Handle direction changes
  const handleDirectionChange = (newDirection: string) => {
    console.log("CanvasGame - Direction change requested:", newDirection);
    setDirection(newDirection);
  };

  // Set up canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!canvasRef.current) return;
      
      // Make the canvas size responsive but maintain grid cells
      const maxWidth = Math.min(window.innerWidth - 40, 600);
      const maxHeight = Math.min(window.innerHeight - 200, 600);
      
      // Make sure we have whole cells
      const width = Math.floor(maxWidth / CELL_SIZE) * CELL_SIZE;
      const height = Math.floor(maxHeight / CELL_SIZE) * CELL_SIZE;
      
      console.log("Setting canvas size to:", width, height);
      setCanvasSize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  // Start game when canvas is sized
  useEffect(() => {
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      console.log("Canvas sized, starting game");
      start();
      // Load high score from local storage
      const savedHighScore = localStorage.getItem("coyaSnakeHighScore");
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, [canvasSize, start]);

  // Handle score changes
  useEffect(() => {
    setCurrentScore(score);
    
    // Update high score if needed
    if (score > highScore) {
      console.log("New high score:", score);
      setHighScore(score);
      localStorage.setItem("coyaSnakeHighScore", score.toString());
    }
  }, [score, highScore]);

  // Draw the game on canvas
  useEffect(() => {
    if (!canvasRef.current || canvasSize.width === 0 || canvasSize.height === 0) return;
    
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      
      // Draw background pattern
      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      const patternCtx = patternCanvas.getContext("2d");
      
      if (patternCtx) {
        // Draw Mayan-inspired pattern
        patternCtx.fillStyle = "#302519";
        patternCtx.fillRect(0, 0, 100, 100);
        
        patternCtx.strokeStyle = "#c6a866";
        patternCtx.lineWidth = 1;
        patternCtx.beginPath();
        patternCtx.moveTo(0, 0);
        patternCtx.lineTo(100, 0);
        patternCtx.lineTo(100, 100);
        patternCtx.lineTo(0, 100);
        patternCtx.lineTo(0, 0);
        patternCtx.stroke();
        
        // Add some Mayan-style details
        patternCtx.beginPath();
        patternCtx.moveTo(25, 25);
        patternCtx.lineTo(75, 25);
        patternCtx.lineTo(75, 75);
        patternCtx.lineTo(25, 75);
        patternCtx.lineTo(25, 25);
        patternCtx.stroke();
        
        patternCtx.beginPath();
        patternCtx.moveTo(50, 0);
        patternCtx.lineTo(50, 100);
        patternCtx.stroke();
        
        patternCtx.beginPath();
        patternCtx.moveTo(0, 50);
        patternCtx.lineTo(100, 50);
        patternCtx.stroke();
      }
      
      const pattern = ctx.createPattern(patternCanvas, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }
      
      // Draw snake
      ctx.fillStyle = "#c6a866"; // Gold color for snake body
      snake.forEach((segment, i) => {
        const x = segment.x * CELL_SIZE;
        const y = segment.y * CELL_SIZE;
        
        // Draw the snake segment with rounded corners for head
        if (i === 0) {
          // This is the head
          ctx.fillStyle = "#dbb870"; // Slightly lighter gold for head
          ctx.beginPath();
          ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, [6, 6, 6, 6]);
          ctx.fill();
          
          // Add eyes to the snake head
          ctx.fillStyle = "#302519";
          
          // Position eyes based on direction
          let leftEyeX = x + CELL_SIZE * 0.25;
          let leftEyeY = y + CELL_SIZE * 0.25;
          let rightEyeX = x + CELL_SIZE * 0.75;
          let rightEyeY = y + CELL_SIZE * 0.25;
          
          if (direction === "left") {
            leftEyeX = x + CELL_SIZE * 0.25;
            leftEyeY = y + CELL_SIZE * 0.25;
            rightEyeX = x + CELL_SIZE * 0.25;
            rightEyeY = y + CELL_SIZE * 0.75;
          } else if (direction === "right") {
            leftEyeX = x + CELL_SIZE * 0.75;
            leftEyeY = y + CELL_SIZE * 0.25;
            rightEyeX = x + CELL_SIZE * 0.75;
            rightEyeY = y + CELL_SIZE * 0.75;
          } else if (direction === "up") {
            leftEyeX = x + CELL_SIZE * 0.25;
            leftEyeY = y + CELL_SIZE * 0.25;
            rightEyeX = x + CELL_SIZE * 0.75;
            rightEyeY = y + CELL_SIZE * 0.25;
          } else if (direction === "down") {
            leftEyeX = x + CELL_SIZE * 0.25;
            leftEyeY = y + CELL_SIZE * 0.75;
            rightEyeX = x + CELL_SIZE * 0.75;
            rightEyeY = y + CELL_SIZE * 0.75;
          }
          
          ctx.beginPath();
          ctx.arc(leftEyeX, leftEyeY, CELL_SIZE * 0.1, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(rightEyeX, rightEyeY, CELL_SIZE * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Body segments
          ctx.fillStyle = "#c6a866";
          ctx.beginPath();
          ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, [3, 3, 3, 3]);
          ctx.fill();
          
          // Add a pattern to body segments
          ctx.strokeStyle = "#a18a55";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + CELL_SIZE * 0.2, y + CELL_SIZE * 0.5);
          ctx.lineTo(x + CELL_SIZE * 0.8, y + CELL_SIZE * 0.5);
          ctx.stroke();
        }
      });

      // Draw food with different styles based on type
      if (food) {
        const x = food.x * CELL_SIZE;
        const y = food.y * CELL_SIZE;
        
        // Draw different food types
        switch (foodType) {
          case 0: // Ceviche
            ctx.fillStyle = "#e9d8a6";
            ctx.beginPath();
            ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = "#c6811f";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.4);
            ctx.quadraticCurveTo(
              x + CELL_SIZE / 2, 
              y + CELL_SIZE * 0.6, 
              x + CELL_SIZE * 0.7, 
              y + CELL_SIZE * 0.4
            );
            ctx.stroke();
            
            // Some garnish
            ctx.fillStyle = "#5ca35c";
            ctx.beginPath();
            ctx.arc(x + CELL_SIZE * 0.4, y + CELL_SIZE * 0.5, CELL_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          case 1: // Guacamole
            ctx.fillStyle = "#7fa85b";
            ctx.beginPath();
            ctx.ellipse(
              x + CELL_SIZE / 2, 
              y + CELL_SIZE / 2, 
              CELL_SIZE / 2, 
              CELL_SIZE / 3, 
              0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Bowl
            ctx.strokeStyle = "#9c7d39";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.2, y + CELL_SIZE * 0.6);
            ctx.quadraticCurveTo(
              x + CELL_SIZE / 2, 
              y + CELL_SIZE * 0.8, 
              x + CELL_SIZE * 0.8, 
              y + CELL_SIZE * 0.6
            );
            ctx.stroke();
            break;
            
          case 2: // Empanada
            ctx.fillStyle = "#c6811f";
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.2, y + CELL_SIZE * 0.65);
            ctx.quadraticCurveTo(
              x + CELL_SIZE / 2, 
              y + CELL_SIZE * 0.2, 
              x + CELL_SIZE * 0.8, 
              y + CELL_SIZE * 0.65
            );
            ctx.closePath();
            ctx.fill();
            
            // Crimp pattern
            ctx.strokeStyle = "#8c5b30";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.6);
            ctx.lineTo(x + CELL_SIZE * 0.7, y + CELL_SIZE * 0.6);
            ctx.stroke();
            break;
            
          case 3: // Cocktail
            // Glass
            ctx.fillStyle = "#f2cc8f";
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.2);
            ctx.lineTo(x + CELL_SIZE * 0.7, y + CELL_SIZE * 0.2);
            ctx.lineTo(x + CELL_SIZE * 0.6, y + CELL_SIZE * 0.7);
            ctx.quadraticCurveTo(
              x + CELL_SIZE / 2, 
              y + CELL_SIZE * 0.8, 
              x + CELL_SIZE * 0.4, 
              y + CELL_SIZE * 0.7
            );
            ctx.closePath();
            ctx.fill();
            
            // Garnish
            ctx.strokeStyle = "#c6a866";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x + CELL_SIZE * 0.3, y + CELL_SIZE * 0.2);
            ctx.lineTo(x + CELL_SIZE * 0.7, y + CELL_SIZE * 0.2);
            ctx.stroke();
            
            ctx.fillStyle = "#c6811f";
            ctx.beginPath();
            ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE * 0.3, CELL_SIZE * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;
            
          default:
            // Default food
            ctx.fillStyle = "#dbb870";
            ctx.beginPath();
            ctx.arc(x + CELL_SIZE / 2, y + CELL_SIZE / 2, CELL_SIZE / 2, 0, Math.PI * 2);
            ctx.fill();
        }
      }
    };
    
    draw();
  }, [snake, food, foodType, direction, canvasSize]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4">
      <ScoreBoard 
        currentScore={currentScore} 
        highScore={highScore} 
        onToggleMute={() => toggleMute()}
        isMuted={isMuted}
      />
      
      <div className="relative mt-4 mb-6">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="border-4 border-[#c6a866] rounded-lg shadow-lg"
        />
      </div>
      
      {mobile ? (
        <MobileControls onDirectionChange={handleDirectionChange} />
      ) : (
        <GameControls onDirectionChange={handleDirectionChange} />
      )}
    </div>
  );
};

export default CanvasGame;
