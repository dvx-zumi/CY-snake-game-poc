import { SnakeSegment, SnakeFood } from "@/hooks/useSnakeGame";

/**
 * Generate a random position for food that's not on the snake
 */
export const getRandomFoodPosition = (
  gridWidth: number,
  gridHeight: number,
  snake: SnakeSegment[]
): SnakeFood => {
  // Generate random position
  let position: SnakeFood;
  
  // Keep generating positions until we find one that's not occupied by the snake
  do {
    position = {
      x: Math.floor(Math.random() * gridWidth),
      y: Math.floor(Math.random() * gridHeight),
    };
  } while (isPositionOnSnake(position, snake));
  
  return position;
};

/**
 * Check if a position is occupied by any part of the snake
 */
export const isPositionOnSnake = (
  position: SnakeFood,
  snake: SnakeSegment[]
): boolean => {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
};

/**
 * Calculate score based on snake length and game time
 */
export const calculateScore = (snakeLength: number, timeElapsed: number): number => {
  // Base score from snake length
  const baseScore = (snakeLength - 1) * 10;
  
  // Time bonus (decreases as time increases)
  const timeBonus = Math.max(0, 1000 - timeElapsed / 1000) / 10;
  
  return Math.floor(baseScore + timeBonus);
};

/**
 * Get appropriate message based on score
 */
export const getScoreMessage = (score: number): string => {
  if (score === 0) {
    return "Better luck next time!";
  } else if (score < 50) {
    return "Good effort!";
  } else if (score < 100) {
    return "Well played!";
  } else if (score < 200) {
    return "Impressive!";
  } else if (score < 500) {
    return "Amazing!";
  } else {
    return "You're a Mayan Snake Master!";
  }
};
