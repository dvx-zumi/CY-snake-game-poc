import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import CanvasGame from "./components/Game/CanvasGame";
import GameStart from "./components/Game/GameStart";
import GameOver from "./components/Game/GameOver";
import { useAudio } from "./lib/stores/useAudio";
import { Howl } from "howler";
import "@fontsource/inter";
import "./index.css";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    // Initialize audio
    const backgroundMusic = new Howl({
      src: ["/sounds/background.mp3"],
      loop: true,
      volume: 0.2,
    });

    const hitSound = new Howl({
      src: ["/sounds/hit.mp3"],
      volume: 0.3,
    });

    const successSound = new Howl({
      src: ["/sounds/success.mp3"],
      volume: 0.3,
    });

    setBackgroundMusic(backgroundMusic);
    setHitSound(hitSound);
    setSuccessSound(successSound);

    return () => {
      backgroundMusic.stop();
      hitSound.stop();
      successSound.stop();
    };
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  const handleGameOver = (score: number) => {
    setGameOver(true);
    setFinalScore(score);
  };

  const handleRestartGame = () => {
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <>
      <Helmet>
        <title>COYA Snake - A Mayan Adventure</title>
        <meta name="description" content="COYA Restaurant presents a Mayan-inspired Snake game" />
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      </Helmet>

      <div className="min-h-screen bg-[#1a140e] flex flex-col items-center justify-center overflow-hidden">
        {!gameStarted && !gameOver && (
          <GameStart onStartGame={handleStartGame} />
        )}
        
        {gameStarted && !gameOver && (
          <CanvasGame onGameOver={handleGameOver} />
        )}
        
        {gameOver && (
          <GameOver score={finalScore} onRestart={handleRestartGame} />
        )}
      </div>
    </>
  );
}

export default App;
