import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Heavy, deliberate — cubic-bezier(0.16, 1, 0.3, 1). The default everywhere
// except the magnetic-button pop, which keeps its own springy overshoot.
CustomEase.create('heavy', 'M0,0,C0.16,1,0.3,1,1,1');
gsap.defaults({ ease: 'heavy', duration: 1 });

export { gsap, ScrollTrigger };
