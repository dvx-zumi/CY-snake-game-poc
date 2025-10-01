import { Howl, HowlOptions } from "howler";

// Sound effect configuration
interface SoundEffect {
  src: string;
  options?: HowlOptions;
}

// Define sound effects with their configurations
export const SOUND_EFFECTS: Record<string, SoundEffect> = {
  eat: {
    src: "/sounds/success.mp3",
    options: {
      volume: 0.3,
    },
  },
  gameOver: {
    src: "/sounds/hit.mp3",
    options: {
      volume: 0.4,
    },
  },
  background: {
    src: "/sounds/background.mp3",
    options: {
      loop: true,
      volume: 0.2,
    },
  },
};

// Sound manager for handling game sounds
class SoundManager {
  private sounds: Record<string, Howl> = {};
  private muted: boolean = false;

  constructor() {
    this.initSounds();
  }

  private initSounds() {
    Object.entries(SOUND_EFFECTS).forEach(([key, sound]) => {
      this.sounds[key] = new Howl({
        src: [sound.src],
        ...sound.options,
      });
    });
  }

  play(soundName: string) {
    if (this.muted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }

  stop(soundName: string) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    
    if (this.muted) {
      // Mute all sounds
      Howler.volume(0);
    } else {
      // Restore volume
      Howler.volume(1);
    }
    
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}

export const soundManager = new SoundManager();
