"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PurpleIcon from "./ReusableComponent/PurpleIcon";
import Link from "next/link";

export default function SpotLightLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isTouchingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setIsMobile(window.innerWidth < 768);
    };

    updateCanvasSize();

    let particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      scatteredColor: string;
      life: number;
    }[] = [];

    let textImageData: ImageData | null = null;

    function createTextImage() {
      if (!ctx || !canvas) return 0;

      ctx.fillStyle = "white";
      ctx.save();

      // Set font size based on screen size
      const fontSize = isMobile ? 48 : 96;
      ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // Calculate text metrics
      const text = "Spotlight";
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      // Triangle dimensions (match lucide-react Triangle: equilateral, pointing up)
      const triangleSize = fontSize * 0.6; // width of triangle
      const triangleHeight = (triangleSize * Math.sqrt(3)) / 2; // height of equilateral triangle
      const gap = fontSize * 0.3;

      // Total width including triangle, gap, and text
      const totalWidth = triangleSize + gap + textWidth;

      // Center everything
      const startX = (canvas.width - totalWidth) / 2;
      const centerY = canvas.height / 2;

      // Draw triangle (equilateral, pointing up)
      ctx.beginPath();
      ctx.moveTo(startX + triangleSize / 2, centerY - triangleHeight / 2); // top
      ctx.lineTo(startX, centerY + triangleHeight / 2); // bottom left
      ctx.lineTo(startX + triangleSize, centerY + triangleHeight / 2); // bottom right
      ctx.closePath();
      ctx.fill();

      // Draw "Spotlight" text
      ctx.fillText(text, startX + triangleSize + gap, centerY);

      ctx.restore();

      textImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      return fontSize / 96; // Return scale factor
    }

    function createParticle(scale: number) {
      if (!ctx || !canvas || !textImageData) return null;

      const data = textImageData.data;

      for (let attempt = 0; attempt < 100; attempt++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);

        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          return {
            x: x,
            y: y,
            baseX: x,
            baseY: y,
            size: Math.random() * 1.5 + 0.5,
            color: "white",
            scatteredColor: "#8B5CF6", // Purple color matching your app's theme
            life: Math.random() * 100 + 50,
          };
        }
      }

      return null;
    }

    function createInitialParticles(scale: number) {
      if (!canvas) return;
      const baseParticleCount = 6000;
      const particleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      );
      for (let i = 0; i < particleCount; i++) {
        const particle = createParticle(scale);
        if (particle) particles.push(particle);
      }
    }

    let animationFrameId: number;

    function animate(scale: number) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0a0a0a"; // Dark background matching your app
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { x: mouseX, y: mouseY } = mousePositionRef.current;
      const maxDistance = 200;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < maxDistance &&
          (isTouchingRef.current || !("ontouchstart" in window))
        ) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          const moveX = Math.cos(angle) * force * 50;
          const moveY = Math.sin(angle) * force * 50;
          p.x = p.baseX - moveX;
          p.y = p.baseY - moveY;

          ctx.fillStyle = p.scatteredColor;
        } else {
          p.x += (p.baseX - p.x) * 0.1;
          p.y += (p.baseY - p.y) * 0.1;
          ctx.fillStyle = "white";
        }

        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.life--;
        if (p.life <= 0) {
          const newParticle = createParticle(scale);
          if (newParticle) {
            particles[i] = newParticle;
          } else {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      const baseParticleCount = 6000;
      const targetParticleCount = Math.floor(
        baseParticleCount *
          Math.sqrt((canvas.width * canvas.height) / (1920 * 1080))
      );
      while (particles.length < targetParticleCount) {
        const newParticle = createParticle(scale);
        if (newParticle) particles.push(newParticle);
      }

      animationFrameId = requestAnimationFrame(() => animate(scale));
    }

    const scale = createTextImage();
    createInitialParticles(scale);
    animate(scale);

    const handleResize = () => {
      updateCanvasSize();
      const newScale = createTextImage();
      particles = [];
      createInitialParticles(newScale);
    };

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = () => {
      isTouchingRef.current = true;
    };

    const handleTouchEnd = () => {
      isTouchingRef.current = false;
      mousePositionRef.current = { x: 0, y: 0 };
    };

    const handleMouseLeave = () => {
      if (!("ontouchstart" in window)) {
        mousePositionRef.current = { x: 0, y: 0 };
      }
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  const handleLogin = () => {
    // Replace with your actual login logic or navigation
    window.location.href = "/sign-in";
  };

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-[#0a0a0a]">
      <canvas
        ref={canvasRef}
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="Interactive particle effect with Spotlight logo"
      />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        {/* Spacer to push content down slightly */}
        <div className="flex-1" />

        {/* Login button positioned below the animated text */}
        <div className="flex-1 flex items-start justify-center pt-36">
          {" "}
          {/* Increased pt-24 to pt-36 for more padding */}
          <PurpleIcon className="mt-20">
            <Link href={"/sign-in"}>
              <Button
                onClick={handleLogin}
                className="pointer-events-auto bg-transparent hover:bg-transparent cursor-pointer text-white px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Login to Spotlight
              </Button>
            </Link>
          </PurpleIcon>
        </div>
      </div>

      {/* Tagline at the bottom */}
      <div className="absolute bottom-8 text-center z-10 pointer-events-none">
        <p className="font-mono text-gray-400 text-xs sm:text-sm">
          Get maximum conversion from your webinars
        </p>
        <p className="mt-2 text-[11px] sm:text-xs text-muted-foreground">
          Built with ♡ by
          <a
            href="https://instagram.com/rehman_waraich7"
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto underline underline-offset-4 ml-1 text-primary hover:text-primary/90"
          >
            M.Rehman
          </a>
        </p>
      </div>
    </div>
  );
}
