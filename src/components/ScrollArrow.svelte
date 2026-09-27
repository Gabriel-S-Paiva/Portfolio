<script lang="ts">
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let visible = $state(false);
  let progress = $state(0);

  let btnW = $state(0);
  let btnH = $state(0);
  let rectEl: SVGRectElement | undefined = $state();
  let perimeter = $state(0);

  function onScroll() {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    visible = window.scrollY > window.innerHeight * 0.6;
  }

  $effect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });

  // Recompute the traced path length whenever the button's measured size changes
  // (text content, font-load reflow, viewport resize affecting layout, etc.)
  $effect(() => {
    if (rectEl && btnW > 0 && btnH > 0) {
      perimeter = rectEl.getTotalLength();
    }
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  const strokeW = 2;
</script>

{#if visible}
  <div
    in:fly={{ y: 10, duration: 220, easing: quintOut }}
    out:fly={{ y: 10, duration: 160 }}
    class="fixed bottom-5 right-5 z-40"
  >
    <button
      bind:clientWidth={btnW}
      bind:clientHeight={btnH}
      onclick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to HEAD"
      class="relative h-12 flex items-center gap-2 pl-4 pr-3.5 rounded-full bg-[var(--surface-2)] shadow-lg transition-colors group"
    >
      {#if btnW > 0 && btnH > 0}
        <svg
          class="absolute inset-0 pointer-events-none"
          width={btnW} height={btnH}
          viewBox="0 0 {btnW} {btnH}"
        >
          <!-- base track, always fully visible -->
          <rect
            x={strokeW / 2} y={strokeW / 2}
            width={btnW - strokeW} height={btnH - strokeW}
            rx={(btnH - strokeW) / 2}
            fill="none" stroke="var(--line)" stroke-width={strokeW}
          />
          <!-- progress trace, same path, revealed by dashoffset -->
          <rect
            bind:this={rectEl}
            x={strokeW / 2} y={strokeW / 2}
            width={btnW - strokeW} height={btnH - strokeW}
            rx={(btnH - strokeW) / 2}
            fill="none" stroke="var(--brass)" stroke-width={strokeW}
            stroke-linecap="round"
            stroke-dasharray={perimeter}
            stroke-dashoffset={perimeter * (1 - progress)}
            style="transition: stroke-dashoffset 100ms linear;"
          />
        </svg>
      {/if}

      <span class="relative font-[family-name:var(--font-mono)] text-[11px] tracking-wide text-[var(--dim)] group-hover:text-[var(--text)] transition-colors">HEAD</span>
      <span class="relative text-[var(--brass)] font-[family-name:var(--font-mono)] text-sm leading-none group-hover:-translate-y-0.5 transition-transform">↑</span>
    </button>
  </div>
{/if}