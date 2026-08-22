'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cx } from '@/lib/utils';

type Tag = 'h1' | 'h2' | 'h3';

/**
 * Headers assemble from displaced, glitched fragments into clean type as
 * they cross into view. Falls back to a plain fade under
 * prefers-reduced-motion — no per-character split, no displacement.
 */
export function GlitchText({
  children,
  as: Tag = 'h2',
  className,
  id,
}: {
  children: string;
  as?: Tag;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });
  const reduceMotion = useReducedMotion();

  const words = children.split(' ');

  if (reduceMotion) {
    return (
      <Tag id={id} ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag id={id} ref={ref as never} className={cx(className, 'overflow-hidden')}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex flex-wrap">
        {words.map((word, wi) => (
          <span key={wi} className="mr-[0.28em] inline-flex overflow-hidden">
            {word.split('').map((char, ci) => {
              const delay = (wi * word.length + ci) * 0.018;
              return (
                <motion.span
                  key={ci}
                  className="inline-block"
                  initial={{ opacity: 0, x: (ci % 2 === 0 ? -1 : 1) * 14, y: -6, skewX: -12, filter: 'blur(4px)' }}
                  animate={inView ? { opacity: 1, x: 0, y: 0, skewX: 0, filter: 'blur(0px)' } : undefined}
                  transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}
