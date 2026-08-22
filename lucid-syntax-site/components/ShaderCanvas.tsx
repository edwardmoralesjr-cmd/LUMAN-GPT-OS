'use client';

import { useEffect, useRef } from 'react';
import { createProgram, resizeCanvasToDisplaySize, FULLSCREEN_VERTEX_SRC } from '@/lib/webgl';

type Props = {
  fragmentSrc: string;
  className?: string;
  /** Mouse position warps the field (hero use case). */
  mouseReactive?: boolean;
  /** External amplitude 0..1, read live from a ref each frame (audio use case). */
  levelRef?: React.MutableRefObject<number>;
  /** Fires once WebGL2 fails to initialize, so the caller can render a poster fallback. */
  onUnavailable?: () => void;
};

export function ShaderCanvas({ fragmentSrc, className, mouseReactive, levelRef, onUnavailable }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      onUnavailable?.();
      return;
    }

    let program: WebGLProgram;
    try {
      program = createProgram(gl, FULLSCREEN_VERTEX_SRC, fragmentSrc);
    } catch {
      onUnavailable?.();
      return;
    }
    gl.useProgram(program);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uLevel = gl.getUniformLocation(program, 'u_level');
    const uReduced = gl.getUniformLocation(program, 'u_reduced');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }
    if (mouseReactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    let raf = 0;
    const start = performance.now();

    function frame(now: number) {
      const canvasEl = canvasRef.current;
      if (!canvasEl || !gl) return;

      resizeCanvasToDisplaySize(canvasEl);
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      gl.useProgram(program);
      if (uResolution) gl.uniform2f(uResolution, canvasEl.width, canvasEl.height);
      if (uTime) gl.uniform1f(uTime, (now - start) / 1000);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uLevel) gl.uniform1f(uLevel, levelRef?.current ?? 0);
      if (uReduced) gl.uniform1f(uReduced, reduceMotion ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduceMotion) {
        raf = requestAnimationFrame(frame);
      }
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      if (mouseReactive) window.removeEventListener('pointermove', onPointerMove);
      gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fragmentSrc]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
