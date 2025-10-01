import { useState, useEffect, useCallback } from "react";
import { CELL_SIZE, GRID_SIZE, INITIAL_SPEED } from "@/lib/constants";
import { getRandomFoodPosition } from "@/lib/utils/gameUtils";

export interface SnakeSegment {
  x: number;
  y: number;
}

export interface SnakeFood {
  x: number;
  y: number;
}

interface UseSnakeGameProps {
  canvasWidth: number;
  canvasHeight: number;
  onFoodCollected?: () => void;
  onGameOver?: () => void;
}

const useSnakeGame = ({
  canvasWidth,
  canvasHeight,
  onFoodCollected,
  onGameOver,
}: UseSnakeGameProps) => {
  // Calculate grid dimensions based on canvas size
  const gridWidth = Math.floor(canvasWidth / CELL_SIZE);
  const gridHeight = Math.floor(canvasHeight / CELL_SIZE);
  
  // Game state
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) }, // Head
  ]);
  const [food, setFood] = useState<SnakeFood | null>(null);
  const [foodType, setFoodType] = useState(0); // 0-3 different food types
  const [direction, setDirection] = useState("right");
  const [nextDirection, setNextDirection] = useState("right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize the game
  useEffect(() => {
    if (gridWidth > 0 && gridHeight > 0 && !food) {
      // Generate initial food
      setFood(getRandomFoodPosition(gridWidth, gridHeight, snake));
      setFoodType(Math.floor(Math.random() * 4)); // Random food type (0-3)
    }
  }, [gridWidth, gridHeight, snake, food]);
  
  // Handle direction changes
  const changeDirection = useCallback((newDirection: string) => {
    console.log("useSnakeGame - Direction change requested:", newDirection, "Current direction:", direction);
    
    // Prevent 180-degree turns
    if (
      (direction === "up" && newDirection === "down") ||
      (direction === "down" && newDirection === "up") ||
      (direction === "left" && newDirection === "right") ||
      (direction === "right" && newDirection === "left")
    ) {
      console.log("Prevented 180-degree turn");
      return;
    }
    
    console.log("Setting next direction to:", newDirection);
    setNextDirection(newDirection);
  }, [direction]);
  
  // Reset the game
  const resetGame = useCallback(() => {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    
    setSnake([
      { x: Math.floor(gridWidth / 2), y: Math.floor(gridHeight / 2) },
    ]);
    setFood(getRandomFoodPosition(gridWidth, gridHeight, []));
    setFoodType(Math.floor(Math.random() * 4));
    setDirection("right");
    setNextDirection("right");
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, [gridWidth, gridHeight, gameInterval]);
  
  // Game loop
  useEffect(() => {
    if (gameOver || gridWidth === 0 || gridHeight === 0) return;
    
    // Store interval reference
    let interval: NodeJS.Timeout | null = null;
    
    const moveSnake = () => {
      // Update direction first
      setDirection(nextDirection);
      
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        
        // Move head in the current direction
        switch (nextDirection) {
          case "up":
            head.y = (head.y - 1 + gridHeight) % gridHeight; // Wrap around top/bottom
            break;
          case "down":
            head.y = (head.y + 1) % gridHeight;
            break;
          case "left":
            head.x = (head.x - 1 + gridWidth) % gridWidth; // Wrap around left/right
            break;
          case "right":
            head.x = (head.x + 1) % gridWidth;
            break;
        }
        
        // Check if snake hits itself
        const hitSelf = prevSnake.some(
          (segment, i) => i > 0 && segment.x === head.x && segment.y === head.y
        );
        
        if (hitSelf) {
          console.log("Snake hit itself! Game over.");
          setGameOver(true);
          
          // Clear the interval inside the state update to prevent racing condition
          if (interval) {
            clearInterval(interval);
          }
          
          if (onGameOver) {
            // Use setTimeout to ensure this runs after the state updates
            setTimeout(() => onGameOver(), 0);
          }
          
          return prevSnake; // Don't move if game over
        }
        
        // Check if snake eats food
        if (food && head.x === food.x && head.y === food.y) {
          console.log("Food collected at position:", food.x, food.y);
          // Snake grows
          const newSnake = [head, ...prevSnake];
          
          // Increase score
          setScore((prevScore) => {
            const newScore = prevScore + 1;
            
            // Increase speed every 5 points
            if (newScore % 5 === 0 && newScore > 0) {
              setSpeed((prevSpeed) => Math.max(prevSpeed - 10, 50)); // Min 50ms
            }
            
            return newScore;
          });
          
          // Generate new food
          setFood(getRandomFoodPosition(gridWidth, gridHeight, newSnake));
          setFoodType(Math.floor(Math.random() * 4));
          
          // Trigger food collected callback - with setTimeout to prevent update loops
          if (onFoodCollected) {
            setTimeout(() => onFoodCollected(), 0);
          }
          
          return newSnake;
        }
        
        // Normal movement (no food eaten)
        return [head, ...prevSnake.slice(0, -1)];
      });
    };
    
    // Set up game interval
    console.log("Setting up game interval with speed:", speed);
    interval = setInterval(moveSnake, speed);
    setGameInterval(interval);
    
    return () => {
      console.log("Cleaning up game interval");
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [
    nextDirection, 
    gameOver, 
    food, 
    gridWidth, 
    gridHeight, 
    speed
  ]); // Removed dependencies that can cause circular updates
  
  return {
    snake,
    food,
    foodType,
    direction,
    score,
    gameOver,
    setDirection: changeDirection,
    resetGame,
  };
};

export default useSnakeGame;
