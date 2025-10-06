import { gsap } from 'gsap';

export const advancedAnimations = {
  // Text reveal with morphing effect
  textReveal: (element: any, delay: number = 0) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        y: 100,
        scale: 1.2,
        filter: "blur(10px)"
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.5,
        delay,
        ease: "power4.out"
      }
    );
  },

  // Staggered grid animation
  staggeredGrid: (selector: string, delay: number = 0) => {
    return gsap.fromTo(selector,
      {
        opacity: 0,
        scale: 0,
        rotation: -180
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: {
          grid: "auto",
          from: "center",
          amount: 1.5
        },
        delay,
        ease: "back.out(1.7)"
      }
    );
  },

  // Wave animation for multiple elements
  waveEffect: (selector: string, amplitude: number = 20) => {
    return gsap.fromTo(selector,
      {
        y: (i: number) => Math.sin(i * 0.5) * amplitude,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)"
      }
    );
  },

  // 3D flip animation
  flip3D: (element: any, duration: number = 1) => {
    return gsap.fromTo(element,
      {
        rotationX: -90,
        opacity: 0,
        scale: 0.8
      },
      {
        rotationX: 0,
        opacity: 1,
        scale: 1,
        duration,
        ease: "power3.out"
      }
    );
  },

  // Particle explosion
  particleExplosion: (container: any, count: number = 12) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const particle = document.createElement('div');
      particle.className = 'absolute w-2 h-2 bg-blue-500 rounded-full';
      container.appendChild(particle);
      
      particles.push(
        gsap.fromTo(particle,
          {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1
          },
          {
            x: Math.cos(angle) * 100,
            y: Math.sin(angle) * 100,
            opacity: 0,
            scale: 0,
            duration: 1,
            ease: "power2.out"
          }
        )
      );
    }
    return particles;
  }
};

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInUp: (element: any) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        y: 100
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        ease: "power2.out"
      }
    );
  },

  scaleIn: (element: any) => {
    return gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.5
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        ease: "back.out(1.7)"
      }
    );
  }
};