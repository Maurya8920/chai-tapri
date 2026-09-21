import React, { useEffect, useRef } from 'react';

interface RainEngineProps {
  isActive: boolean;
}

/**
 * RainEngine Component
 * 
 * Generates realistic raindrops and water splashes on HTML5 Canvas
 * accompanied by synthesized Web Audio API white noise rain and occasional thunderclaps.
 */
export const RainEngine: React.FC<RainEngineProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flashOverlayRef = useRef<HTMLDivElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lightningTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const flashOverlay = flashOverlayRef.current;
    if (!canvas || !flashOverlay) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    class Drop {
      x = 0;
      y = 0;
      z = 0;
      speed = 0;
      len = 0;
      wind = 0;
      alpha = 0;
      thickness = 0;

      constructor() {
        this.reset(true);
      }

      reset(randomY: boolean) {
        this.x = Math.random() * (width + 200) - 100;
        this.y = randomY ? Math.random() * height : -20 - Math.random() * 50;
        this.z = Math.random() * 0.8 + 0.2;
        this.speed = (18 + Math.random() * 10) * this.z;
        this.len = (15 + Math.random() * 15) * this.z;
        this.wind = -2.5 * this.z;
        this.alpha = 0.2 + this.z * 0.45;
        this.thickness = 0.8 + this.z * 1.1;
      }

      update(splashes: Splash[]) {
        this.x += this.wind;
        this.y += this.speed;
        if (this.y > height - 30) {
          if (Math.random() < 0.35 && splashes.length < 120) {
            splashes.push(new Splash(this.x, height - 10, this.z));
          }
          this.reset(false);
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + this.wind * 1.5, this.y + this.len);
        c.strokeStyle = `rgba(180, 215, 255, ${this.alpha})`;
        c.lineWidth = this.thickness;
        c.stroke();
      }
    }

    class Splash {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      gravity = 0.25;
      life = 1;
      decay: number;
      radius: number;

      constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = (Math.random() - 0.5) * 4 * z;
        this.vy = -(1.5 + Math.random() * 3) * z;
        this.decay = 0.08 + Math.random() * 0.06;
        this.radius = (1.2 + Math.random() * 1.5) * z;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life -= this.decay;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.life <= 0) return;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = `rgba(195, 225, 255, ${this.life * 0.5})`;
        c.fill();
      }
    }

    const dropCount = Math.min(250, Math.floor(width * 0.22));
    const drops: Drop[] = Array.from({ length: dropCount }, () => new Drop());
    let splashes: Splash[] = [];

    const drawLightning = (startX: number, startY: number, endX: number, endY: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(240, 248, 255, 0.95)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = 'rgba(147, 197, 253, 1)';
      ctx.shadowBlur = 18;

      ctx.beginPath();
      let curX = startX;
      let curY = startY;
      ctx.moveTo(curX, curY);

      const steps = 14 + Math.floor(Math.random() * 8);
      for (let i = 0; i < steps; i++) {
        const t = (i + 1) / steps;
        const targetX = startX + (endX - startX) * t + (Math.random() - 0.5) * 70;
        const targetY = startY + (endY - startY) * t;
        ctx.lineTo(targetX, targetY);
      }
      ctx.stroke();
      ctx.restore();
    };

    const triggerLightning = () => {
      if (!isActive) return;
      const flash = flashOverlayRef.current;
      if (!flash) return;

      const intensity = 0.65 + Math.random() * 0.35;
      flash.style.opacity = intensity.toString();

      const boltStartX = Math.random() * width * 0.8 + width * 0.1;
      const boltEndX = boltStartX + (Math.random() - 0.5) * 200;
      drawLightning(boltStartX, 0, boltEndX, height * 0.7);

      setTimeout(() => {
        flash.style.opacity = '0.15';
        setTimeout(() => {
          flash.style.opacity = '0';
        }, 50);
      }, 50);

      const nextDelay = 7000 + Math.random() * 10000;
      lightningTimeoutRef.current = window.setTimeout(triggerLightning, nextDelay);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      drops.forEach((d) => {
        d.update(splashes);
        d.draw(ctx);
      });

      for (let i = splashes.length - 1; i >= 0; i--) {
        splashes[i].update();
        splashes[i].draw(ctx);
        if (splashes[i].life <= 0) {
          splashes.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    if (isActive) {
      canvas.classList.add('active');
      render();
      lightningTimeoutRef.current = window.setTimeout(triggerLightning, 1200);

      // Start Synthesized Rain Audio
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();

          const bufferSize = audioCtxRef.current.sampleRate * 2;
          const noiseBuffer = audioCtxRef.current.createBuffer(1, bufferSize, audioCtxRef.current.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 2.5;
          }

          const noiseSource = audioCtxRef.current.createBufferSource();
          noiseSource.buffer = noiseBuffer;
          noiseSource.loop = true;

          const filter = audioCtxRef.current.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1000;

          const gain = audioCtxRef.current.createGain();
          gain.gain.setValueAtTime(0.001, audioCtxRef.current.currentTime);
          gain.gain.linearRampToValueAtTime(0.25, audioCtxRef.current.currentTime + 1.2);

          noiseSource.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          noiseSource.start(0);

          rainGainRef.current = gain;
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
          if (rainGainRef.current) {
            rainGainRef.current.gain.linearRampToValueAtTime(0.25, audioCtxRef.current.currentTime + 1.0);
          }
        }
      } catch (e) {
        console.warn('Web Audio rain notice:', e);
      }
    } else {
      canvas.classList.remove('active');
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (lightningTimeoutRef.current) clearTimeout(lightningTimeoutRef.current);
      ctx.clearRect(0, 0, width, height);

      if (rainGainRef.current && audioCtxRef.current) {
        rainGainRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (lightningTimeoutRef.current) clearTimeout(lightningTimeoutRef.current);
    };
  }, [isActive]);

  return (
    <>
      <canvas id="rainCanvas" ref={canvasRef} />
      <div id="lightningFlashOverlay" ref={flashOverlayRef} />
    </>
  );
};
