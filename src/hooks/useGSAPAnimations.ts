// 'use client';

// import { useGSAP } from '@gsap/react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useRef } from 'react';

// gsap.registerPlugin(ScrollTrigger);

// export const useGSAPAnimations = () => {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useGSAP(() => {
//     if (!containerRef.current) return;

//     // Animate memory cards on scroll
//     gsap.fromTo('.memory-card', 
//       { 
//         y: 100, 
//         opacity: 0,
//         scale: 0.8
//       },
//       {
//         y: 0,
//         opacity: 1,
//         scale: 1,
//         duration: 0.8,
//         stagger: 0.1,
//         ease: 'power3.out',
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: 'top 80%',
//           end: 'bottom 20%',
//           toggleActions: 'play none none reverse',
//         }
//       }
//     );

//     // Header animation
//     gsap.fromTo('.gallery-header',
//       { y: -50, opacity: 0 },
//       { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
//     );

//   }, { scope: containerRef });

//   return { containerRef };
// };