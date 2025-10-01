import { useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface MobileControlsProps {
  onDirectionChange: (direction: string) => void;
}

const MobileControls = ({ onDirectionChange }: MobileControlsProps) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Function to handle direction changes with logging
  const handleDirectionChange = (direction: string) => {
    console.log(`Mobile - Direction changed to: ${direction}`);
    onDirectionChange(direction);
  };
  
  // Handle touch events for swipe controls
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      console.log("Touch start at:", touch.clientX, touch.clientY);
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.touches[0];
      const startX = touchStartRef.current.x;
      const startY = touchStartRef.current.y;
      const currentX = touch.clientX;
      const currentY = touch.clientY;
      
      // Calculate swipe distance
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      
      console.log("Touch move delta:", deltaX, deltaY);
      
      // Minimum swipe distance to register as a swipe
      const minSwipeDistance = 30;
      
      // Determine swipe direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            console.log("Swipe detected: RIGHT");
            handleDirectionChange("right");
          } else {
            console.log("Swipe detected: LEFT");
            handleDirectionChange("left");
          }
          touchStartRef.current = null;
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            console.log("Swipe detected: DOWN");
            handleDirectionChange("down");
          } else {
            console.log("Swipe detected: UP");
            handleDirectionChange("up");
          }
          touchStartRef.current = null;
        }
      }
    };
    
    console.log("Adding touch event listeners");
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    
    return () => {
      console.log("Removing touch event listeners");
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onDirectionChange]);
  
  return (
    <div className="block md:hidden mb-6">
      <div className="text-center text-[#c6a866] mb-3">
        Swipe or tap arrows to control
      </div>
      
      <div className="grid grid-cols-3 gap-2 place-items-center">
        <div></div>
        <button
          onClick={() => handleDirectionChange("up")}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-[#302519] text-[#c6a866] active:bg-[#463828]"
          aria-label="Move Up"
          type="button"
        >
          <ArrowUp size={28} />
        </button>
        <div></div>
        
        <button
          onClick={() => handleDirectionChange("left")}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-[#302519] text-[#c6a866] active:bg-[#463828]"
          aria-label="Move Left"
          type="button"
        >
          <ArrowLeft size={28} />
        </button>
        
        <button
          onClick={() => handleDirectionChange("down")}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-[#302519] text-[#c6a866] active:bg-[#463828]"
          aria-label="Move Down"
          type="button"
        >
          <ArrowDown size={28} />
        </button>
        
        <button
          onClick={() => handleDirectionChange("right")}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-[#302519] text-[#c6a866] active:bg-[#463828]"
          aria-label="Move Right"
          type="button"
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default MobileControls;
