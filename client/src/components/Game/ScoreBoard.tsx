import { Volume2, VolumeX } from "lucide-react";

interface ScoreBoardProps {
  currentScore: number;
  highScore: number;
  onToggleMute: () => void;
  isMuted: boolean;
}

const ScoreBoard = ({ currentScore, highScore, onToggleMute, isMuted }: ScoreBoardProps) => {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-[#302519] rounded-lg border-2 border-[#c6a866] mb-2 text-[#c6a866]">
      <div className="flex items-center">
        <div className="mr-6">
          <p className="text-sm uppercase tracking-wider">Score</p>
          <p className="text-2xl font-bold">{currentScore}</p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-wider">Best</p>
          <p className="text-2xl font-bold">{highScore}</p>
        </div>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={onToggleMute}
          className="p-2 hover:bg-[#463828] rounded-full"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ScoreBoard;
