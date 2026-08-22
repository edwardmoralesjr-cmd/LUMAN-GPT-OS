'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Crossfade fallback for page transitions. Next.js remounts `template.tsx`
 * on every navigation, so this simply fades/lifts each page in. Where the
 * browser supports the native View Transitions API (wired through
 * TransitionLink in the primary nav), that runs instead and this becomes
 * a no-op fade underneath it. Reduced motion renders instantly.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
