import { useReducedMotion } from './useReducedMotion';
import { useIsMobile } from './useIsMobile';

/** Whether the animated, traveling 3D crystal should run — false on mobile and under reduced motion, where a static monogram stands in for it instead. */
export function useShowCrystal(): boolean {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  return !reducedMotion && !isMobile;
}
