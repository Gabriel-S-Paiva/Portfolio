<script lang="ts">
  let visible = $state(false);

  $effect(() => {
    function onScroll() {
      visible = window.scrollY > window.innerHeight * 0.6;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
</script>

{#if visible}
  <button
    onclick={scrollToTop}
    aria-label="Scroll to top"
    class="fixed bottom-5 right-5 z-40 flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-full pl-3 pr-4 py-2.5 shadow-lg hover:border-[var(--brass)] transition-colors group"
  >
    <span class="text-[var(--brass)] font-[family-name:var(--font-mono)] text-sm leading-none group-hover:-translate-y-0.5 transition-transform">↑</span>
    <span class="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dim)] group-hover:text-[var(--text)]">HEAD</span>
  </button>
{/if}