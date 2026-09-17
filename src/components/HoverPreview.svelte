<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let previewEl: HTMLDivElement;
  let labelEl: HTMLSpanElement;

  let pv = { curX: 0, curY: 0, curRotX: 0, curRotY: 0, curScale: 1 };
  let target = { x: 0, y: 0, rotX: 0, rotY: 0, scale: 1 };
  let last = { x: 0, y: 0, t: 0 };
  let raf: number | null = null;
  let active = false;
  let reduced = false;

  function loop() {
    if (!active) return;
    const ease = reduced ? 1 : 0.22;
    pv.curX += (target.x - pv.curX) * ease;
    pv.curY += (target.y - pv.curY) * ease;
    pv.curRotX += (target.rotX - pv.curRotX) * 0.18;
    pv.curRotY += (target.rotY - pv.curRotY) * 0.18;
    pv.curScale += (target.scale - pv.curScale) * 0.15;
    previewEl.style.left = `${pv.curX}px`;
    previewEl.style.top = `${pv.curY}px`;
    previewEl.style.transform = `perspective(480px) rotateX(${pv.curRotX}deg) rotateY(${pv.curRotY}deg) scale(${pv.curScale})`;
    raf = requestAnimationFrame(loop);
  }

  function attach(card: HTMLElement) {
    const shot = card.dataset.shot ?? '';

    card.addEventListener('mouseenter', (e) => {
      const me = e as MouseEvent;
      labelEl.textContent = shot;
      previewEl.classList.add('show');
      const w = 280, h = (w * 9) / 16, pad = 16, offset = 24;
      const x = Math.min(me.clientX + offset, window.innerWidth - w - pad);
      const y = Math.min(me.clientY + offset, window.innerHeight - h - pad);
      pv.curX = target.x = x; pv.curY = target.y = y;
      pv.curRotX = target.rotX = 0; pv.curRotY = target.rotY = 0;
      pv.curScale = target.scale = 1;
      last = { x: me.clientX, y: me.clientY, t: performance.now() };
      active = true;
      if (raf) cancelAnimationFrame(raf);
      loop();
    });

    card.addEventListener('mousemove', (e) => {
      const me = e as MouseEvent;
      const w = 280, h = (w * 9) / 16, pad = 16, offset = 24;
      target.x = Math.min(me.clientX + offset, window.innerWidth - w - pad);
      target.y = Math.min(me.clientY + offset, window.innerHeight - h - pad);

      const rect = card.getBoundingClientRect();
      const relX = (me.clientX - rect.left) / rect.width;
      const relY = (me.clientY - rect.top) / rect.height;
      target.rotY = reduced ? 0 : (relX - 0.5) * 14;
      target.rotX = reduced ? 0 : (0.5 - relY) * 14;

      const now = performance.now();
      const dt = Math.max(now - last.t, 8);
      const dist = Math.hypot(me.clientX - last.x, me.clientY - last.y);
      const speed = dist / dt;
      target.scale = reduced ? 1 : Math.min(1 + speed * 0.06, 1.12);
      last = { x: me.clientX, y: me.clientY, t: now };
    });

    card.addEventListener('mouseleave', () => {
      previewEl.classList.remove('show');
      target.scale = 1;
      active = false;
      if (raf) cancelAnimationFrame(raf);
    });
  }

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll<HTMLElement>('.project-card').forEach(attach);
  });

  onDestroy(() => {
    if (raf) cancelAnimationFrame(raf);
  });
</script>

<div class="hover-preview" bind:this={previewEl}>
  <span bind:this={labelEl}></span>
</div>

<style>
  .hover-preview {
    position: fixed;
    width: 280px;
    aspect-ratio: 16 / 9;
    background: repeating-linear-gradient(45deg, var(--surface-2) 0 10px, var(--surface) 10px 20px);
    border: 1px solid var(--line);
    border-radius: 10px;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    z-index: 45;
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;
    will-change: transform;
  }
  .hover-preview.show { opacity: 1; }
  .hover-preview span {
    font-family: var(--font-mono);
    font-size: 11.5px;
    color: var(--dimmer);
    text-align: center;
    border: 1px dashed var(--dimmer);
    padding: 8px 12px;
    border-radius: 6px;
  }
</style>