import { motion } from "framer-motion";

interface GameStartProps {
  onStartGame: () => void;
}

const GameStart = ({ onStartGame }: GameStartProps) => {
  return (
    <motion.div
      className="p-8 bg-[#302519] rounded-lg border-4 border-[#c6a866] shadow-2xl max-w-lg mx-auto text-center"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">
        <svg 
          viewBox="0 0 100 100" 
          className="w-24 h-24 text-[#c6a866]"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M50 10 L53 23 L65 17 L60 30 L73 30 L63 40 L73 50 L60 50 L65 63 L53 57 L50 70 L47 57 L35 63 L40 50 L27 50 L37 40 L27 30 L40 30 L35 17 L47 23 Z"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="10"/>
          <path d="M24 24 L76 76 M24 76 L76 24" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-[#c6a866] mb-1">COYA</h1>
      <h2 className="text-2xl font-bold text-[#c6a866] mb-4">Mayan Snake</h2>
      
      <p className="text-[#e9d8a6] mb-6">
        Navigate through the ancient Mayan grounds, collect exquisite culinary treasures and grow your serpent's stature.
      </p>
      
      <div className="mb-8 bg-[#1a140e] p-4 rounded-lg">
        <h3 className="text-[#c6a866] font-semibold mb-2">How to Play:</h3>
        <ul className="text-[#a18a55] text-sm text-left list-disc pl-4 space-y-1">
          <li>Use arrow keys or WASD to navigate (Desktop)</li>
          <li>Swipe or use on-screen controls (Mobile)</li>
          <li>Collect Peruvian delicacies to grow</li>
          <li>Avoid colliding with yourself or the walls</li>
          <li>The snake gets faster as you collect more food</li>
        </ul>
      </div>
      
      <button
        onClick={onStartGame}
        className="px-8 py-3 bg-[#c6a866] text-[#1a140e] rounded-md text-lg font-semibold hover:bg-[#dbb870] transition-colors"
      >
        Begin Your Journey
      </button>
    </motion.div>
  );
};

export default GameStart;
