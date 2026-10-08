import { useEffect, useRef, useState } from 'react';
import '../styles/components/BackToTop.css';

const BackToTop = ({ showAfter = 0 }) => {
  const buttonRef = useRef(null);
  const containersRef = useRef([]);
  const [scroll, setScroll] = useState({ top: 0, progress: 0 });

  useEffect(() => {
    // Solo los antecesores del botón: no confundir carruseles o paneles.
    const containers = [];
    let element = buttonRef.current?.parentElement;
    while (element) {
      containers.push(element);
      element = element.parentElement;
    }
    containersRef.current = containers;
    let frame = 0;

    const update = () => {
      frame = 0;
      const root = document.scrollingElement;
      // body puede desplazarse independientemente del documento.
      const active = containers.reduce((current, candidate) => (
        candidate.scrollTop > (current?.scrollTop || 0) ? candidate : current
      ), root);
      const top = Math.max(0, active?.scrollTop || 0);
      const max = Math.max(0, (active?.scrollHeight || 0) - (active?.clientHeight || 0));
      setScroll({ top, progress: max > 0 ? Math.min(1, top / max) : 0 });
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Captura también eventos de scroll de body y contenedores internos.
    document.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true });
    window.addEventListener('resize', scheduleUpdate);
    const observer = new ResizeObserver(scheduleUpdate);
    containers.forEach(container => observer.observe(container));
    update();

    return () => {
      document.removeEventListener('scroll', scheduleUpdate, true);
      window.removeEventListener('resize', scheduleUpdate);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const goToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant' : 'smooth';
    // Si hay varios antecesores desplazados, volver al inicio de todos.
    containersRef.current.forEach(container => {
      if (container.scrollTop > 0) container.scrollTo({ top: 0, behavior });
    });
    window.scrollTo({ top: 0, behavior });
  };

  const visible = scroll.top > Math.max(0, showAfter);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`back-to-top${visible ? ' back-to-top--visible' : ''}`}
      onClick={goToTop}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      disabled={!visible}
    >
      <svg className="back-to-top__ring" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
        <circle className="back-to-top__track" cx="28" cy="28" r="24" />
        <circle
          className="back-to-top__progress"
          cx="28" cy="28" r="24"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset={100 - scroll.progress * 100}
          transform="rotate(-90 28 28)"
        />
      </svg>
      <svg className="back-to-top__arrow" width="23" height="23" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="m6 12 6-6 6 6M12 6v13" />
      </svg>
    </button>
  );
};

export default BackToTop;
