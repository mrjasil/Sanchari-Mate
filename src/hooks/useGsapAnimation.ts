import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useGsapAnimation = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Master timeline for sequenced animations
      const masterTL = gsap.timeline();

      // Text reveal animation with split text effect
      masterTL.fromTo(".hero-title-word", 
        { 
          opacity: 0, 
          y: 100,
          rotationX: 90,
          transformOrigin: "0% 50% -50"
        },
        { 
          opacity: 1, 
          y: 0,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out"
        }
      );

      // Gradient text animation
      masterTL.fromTo(".gradient-text",
        {
          backgroundPosition: "200% center"
        },
        {
          backgroundPosition: "0% center",
          duration: 2,
          ease: "power2.inOut"
        },
        "-=0.5"
      );

      // Subtitle typewriter effect
      masterTL.fromTo(".hero-subtitle",
        {
          width: "0%",
          opacity: 0
        },
        {
          width: "100%",
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut"
        }
      );

      // Buttons slide in with glow (no floating on emojis)
      masterTL.fromTo(".hero-button",
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );

      // Features grid animation (no floating on emojis)
      masterTL.fromTo(".feature-item",
        {
          opacity: 0,
          y: 30,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out"
        },
        "-=0.3"
      );

      // Magnetic button effect (only affects buttons, not emojis)
      const buttons = document.querySelectorAll('.magnetic-button');
      buttons.forEach(button => {
        button.addEventListener('mousemove', (e: any) => {
          const { left, top, width, height } = button.getBoundingClientRect();
          const x = (e.clientX - left) / width - 0.5;
          const y = (e.clientY - top) / height - 0.5;
          
          gsap.to(button, {
            x: x * 15,
            y: y * 15,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)"
          });
        });
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return { heroRef };
};