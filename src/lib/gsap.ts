import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);

// Heavy, deliberate — cubic-bezier(0.16, 1, 0.3, 1). The one ease used
// everywhere; the controlled feel comes from never deviating from it.
CustomEase.create('heavy', 'M0,0,C0.16,1,0.3,1,1,1');
gsap.defaults({ ease: 'heavy', duration: 1 });

export { gsap, ScrollTrigger, SplitText };
