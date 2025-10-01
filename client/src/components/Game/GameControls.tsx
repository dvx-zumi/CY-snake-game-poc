import { useEffect } from "react";
import { ArrowUpCircle, ArrowDownCircle, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface GameControlsProps {
  onDirectionChange: (direction: string) => void;
}

const GameControls = ({ onDirectionChange }: GameControlsProps) => {
  // Function to handle direction changes with logging
  const handleDirectionChange = (direction: string) => {
    console.log(`Direction changed to: ${direction}`);
    onDirectionChange(direction);
  };

  // Keyboard controls for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log("Key pressed:", e.code);
      
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      
      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          handleDirectionChange("up");
          break;
        case "ArrowDown":
        case "KeyS":
          handleDirectionChange("down");
          break;
        case "ArrowLeft":
        case "KeyA":
          handleDirectionChange("left");
          break;
        case "ArrowRight":
        case "KeyD":
          handleDirectionChange("right");
          break;
      }
    };

    console.log("Adding keyboard event listener");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      console.log("Removing keyboard event listener");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onDirectionChange]);

  return (
    <div className="hidden md:block mb-6">
      <div className="text-center text-[#c6a866] mb-2">
        Use arrow keys or WASD to control the snake
      </div>
      <div className="flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleDirectionChange("up")}
            className="p-2 text-[#c6a866] hover:text-[#e9d8a6] focus:outline-none"
            aria-label="Move Up"
            type="button"
          >
            <ArrowUpCircle size={32} />
          </button>
          
          <div className="flex gap-2 my-1">
            <button
              onClick={() => handleDirectionChange("left")}
              className="p-2 text-[#c6a866] hover:text-[#e9d8a6] focus:outline-none"
              aria-label="Move Left"
              type="button"
            >
              <ArrowLeftCircle size={32} />
            </button>
            
            <button
              onClick={() => handleDirectionChange("down")}
              className="p-2 text-[#c6a866] hover:text-[#e9d8a6] focus:outline-none"
              aria-label="Move Down"
              type="button"
            >
              <ArrowDownCircle size={32} />
            </button>
            
            <button
              onClick={() => handleDirectionChange("right")}
              className="p-2 text-[#c6a866] hover:text-[#e9d8a6] focus:outline-none"
              aria-label="Move Right"
              type="button"
            >
              <ArrowRightCircle size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
