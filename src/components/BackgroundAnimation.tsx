import { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > this.canvasWidth) this.x = 0;
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.y > this.canvasHeight) this.y = 0;
        if (this.y < 0) this.y = this.canvasHeight;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(147, 51, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Butterfly {
      x: number;
      y: number;
      size: number;
      angle: number;
      speed: number;
      wingAngle: number;
      wingSpeed: number;
      color: string;
      canvasWidth: number;
      canvasHeight: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * this.canvasWidth;
        this.y = Math.random() * this.canvasHeight;
        this.size = Math.random() * 5 + 3;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.5;
        this.wingAngle = 0;
        this.wingSpeed = Math.random() * 0.1 + 0.05;
        this.color = `hsl(${Math.random() * 60 + 240}, 70%, 70%)`;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.wingAngle += this.wingSpeed;

        if (this.x > this.canvasWidth) this.x = 0;
        if (this.x < 0) this.x = this.canvasWidth;
        if (this.y > this.canvasHeight) this.y = 0;
        if (this.y < 0) this.y = this.canvasHeight;

        if (Math.random() < 0.02) {
          this.angle += Math.random() * 0.5 - 0.25;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(
          0, 0,
          this.size * 2 * Math.abs(Math.sin(this.wingAngle)),
          this.size,
          0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    const butterflies: Butterfly[] = [];
    const numParticles = 50;
    const numButterflies = 15;

    // Initialize particles and butterflies
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    for (let i = 0; i < numButterflies; i++) {
      butterflies.push(new Butterfly(canvas.width, canvas.height));
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      butterflies.forEach(butterfly => {
        butterfly.update();
        butterfly.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
      particles.forEach(particle => {
        particle.canvasWidth = canvas.width;
        particle.canvasHeight = canvas.height;
      });
      butterflies.forEach(butterfly => {
        butterfly.canvasWidth = canvas.width;
        butterfly.canvasHeight = canvas.height;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ background: 'linear-gradient(to bottom, #f3e8ff, #f0f9ff)' }}
    />
  );
};

export default BackgroundAnimation;