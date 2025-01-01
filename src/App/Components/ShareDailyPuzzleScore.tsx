import { Timestamp } from 'firebase/firestore';
import { useRef } from 'react';
import { DisplayFunctions } from '../../Background/Utils/DisplayFunctions';
import { Button } from '@mui/material';
import ShareIcon from './SiteIcons/ShareIcon';
import baseImageUrl from '../../assets/sharescoreimage.png';

interface ScoreImageGeneratorProps {
  score: number;
  timestamp?: Timestamp;
  username?: string;
  lastPuzzlePlayedDate?: string | null;
}
export default function ScoreImageGenerator({ score, timestamp, username, lastPuzzlePlayedDate }: ScoreImageGeneratorProps) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // const generateImage = async () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext('2d');
  //   if (!ctx) return;

  //   // Load the base image
  //   const baseImage = new Image();
  //   baseImage.src = baseImageUrl;

  //   baseImage.onload = async () => {
  //     canvas.width = baseImage.width;
  //     canvas.height = baseImage.height;

  //     // Draw the base image onto the canvas
  //     ctx.drawImage(baseImage, 0, 0);

  //     // Add additional drawing logic here (e.g., score, username, etc.)

  //     // Convert canvas to data URL
  //     const dataUrl = canvas.toDataURL('image/png');

  //     // Create a temporary link element for downloading the image
  //     const link = document.createElement('a');
  //     link.href = dataUrl;
  //     link.download = 'score.png';
  //     link.click();
  //   };
  // };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load the base image
    const baseImage = new Image();
    baseImage.src = baseImageUrl;

    baseImage.onload = async () => {
      canvas.width = baseImage.width;
      canvas.height = baseImage.height;

      // Draw the base image onto the canvas
      ctx.drawImage(baseImage, 0, 0);

      // Define text styles
      ctx.font = 'bolder 70px Calibri';
      ctx.fillStyle = '#000000'; // Text color
      ctx.textAlign = 'center';

      // Add text overlay
      const text = `${score} points`;
      // const text2 = `on today's Daily Puzzle.`;
      let date = "";
      if (timestamp) {
        date = DisplayFunctions.displayPuzzleDateShort(timestamp);
      } else if (lastPuzzlePlayedDate) {
        date = lastPuzzlePlayedDate;
      }

      if (username) {
        ctx.fillText(username.toUpperCase(), canvas.width / 2, 200);
      }
      ctx.fillText(date, canvas.width / 2, 120);
      ctx.fillText(text, canvas.width / 2, canvas.height - 80);
      // ctx.fillText(text2, canvas.width / 2, canvas.height - 80);

      // Convert the canvas to a data URL
      const imageDataUrl = canvas.toDataURL();

      // Copy to clipboard
      try {
        const blob = await (await fetch(imageDataUrl)).blob();

        const clipboardItem = new ClipboardItem({
          'image/png': blob,
        });

        await navigator.clipboard.write([clipboardItem]);
        alert('Image copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy image: ', err);
      }
    };

    baseImage.onerror = () => {
      console.error('Failed to load the base image.');
    };
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <Button onClick={shareImage}>
        <ShareIcon />
      </Button>
    </div>
  );
};

// export default ScoreImageGenerator;
