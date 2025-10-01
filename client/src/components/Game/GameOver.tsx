import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver = ({ score, onRestart }: GameOverProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Set a message based on the score
    if (score === 0) {
      setMessage("Better luck next time!");
    } else if (score < 10) {
      setMessage("Good effort!");
    } else if (score < 20) {
      setMessage("Well played!");
    } else if (score < 30) {
      setMessage("Impressive!");
    } else if (score < 50) {
      setMessage("Amazing!");
    } else {
      setMessage("You're a Mayan Snake Master!");
    }
  }, [score]);

  return (
    <motion.div
      className="p-8 bg-[#302519] rounded-lg border-4 border-[#c6a866] shadow-2xl max-w-lg mx-auto text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-[#c6a866] mb-2">Game Over</h2>
      <p className="text-[#e9d8a6] mb-6">{message}</p>
      
      <div className="mb-8 p-6 bg-[#1a140e] rounded-lg">
        <p className="text-[#a18a55] text-lg">Your Score</p>
        <p className="text-[#c6a866] text-5xl font-bold">{score}</p>
      </div>
      
      <div className="mb-6">
        <p className="text-[#a18a55] mb-4">
          Indulge in the thrill of the hunt once more, navigate the ancient Mayan maze with precision and grace.
        </p>
      </div>
      
      <button
        onClick={onRestart}
        className="px-8 py-3 bg-[#c6a866] text-[#1a140e] rounded-md text-lg font-semibold hover:bg-[#dbb870] transition-colors"
      >
        Play Again
      </button>
    </motion.div>
  );
};

export default GameOver;
