<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let { target = 'about' }: { target?: string } = $props();
  let hidden = $state(false);

  function onScroll() {
    hidden = window.scrollY > 80;
  }

  function scrollToTarget() {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  }

  onMount(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
  onDestroy(() => {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', onScroll);
  });
</script>

<button
  type="button"
  onclick={scrollToTarget}
  class="fixed left-1/2 -translate-x-1/2 bottom-[104px] z-[26] font-[family-name:var(--font-mono)] text-[11px] text-[var(--dimmer)] inline-flex items-center gap-2 cursor-pointer bg-[var(--surface)] border border-[var(--line)] rounded-full px-3.5 py-[7px] transition-opacity"
  class:opacity-0={hidden}
  class:pointer-events-none={hidden}
>
  <span class="inline-block animate-bounce">↓</span> scroll
</button>