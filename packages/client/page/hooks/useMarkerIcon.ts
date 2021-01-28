import { useEffect, useRef } from 'react';

const size = 104;

export function useMarkerIcon(fillColor: string, ringColor: string = 'black') {
  const canvasRef = useRef<HTMLCanvasElement>();
  const ctxRef = useRef<CanvasRenderingContext2D | null>();

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.className = 'sr-only';
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    canvas.width = size;
    canvas.height = size;
    document.body.append(canvas);

    canvasRef.current = canvas;
    ctxRef.current = ctx;

    return () => {
      canvas.remove();
      canvasRef.current = undefined;
      ctxRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 16;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }, [fillColor, ringColor]);

  return canvasRef.current;
}
