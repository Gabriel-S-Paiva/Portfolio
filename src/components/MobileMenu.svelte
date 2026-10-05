<script lang="ts">
  import { navLinks } from '../lib/nav-links';

  let open = $state(false);
  let menuBtn: HTMLButtonElement | undefined = $state();
  let closeBtn: HTMLButtonElement | undefined = $state();

  // Move the overlay under <body>. The navbar's backdrop-blur would otherwise
  // become the containing block for `fixed` and shrink the overlay to the bar.
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  $effect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
    return () => {
      document.body.style.overflow = prev;
      menuBtn?.focus({ preventScroll: true });
    };
  });
</script>

<svelte:window onkeydown={(e) => { if (open && e.key === 'Escape') open = false; }} />

<button
  bind:this={menuBtn}
  type="button"
  class="sm:hidden flex flex-col justify-center items-center gap-[4px] w-11 h-11 -mr-3 cursor-pointer bg-transparent border-none"
  aria-label="Open menu"
  aria-expanded={open}
  aria-controls="mobile-menu"
  onclick={() => (open = true)}
>
  <span class="h-[1.5px] bg-[var(--text)] w-5"></span>
  <span class="h-[1.5px] bg-[var(--text)] w-5"></span>
  <span class="h-[1.5px] bg-[var(--text)] w-5"></span>
</button>

{#if open}
  <div
    use:portal
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Navigation"
    class="fixed inset-0 bg-[var(--bg)] z-40 flex flex-col items-center justify-center gap-7 text-xl font-[family-name:var(--font-display)]"
  >
    <button
      bind:this={closeBtn}
      type="button"
      class="absolute top-2 right-4 w-11 h-11 text-3xl leading-none bg-transparent border-none text-[var(--text)] cursor-pointer"
      aria-label="Close menu"
      onclick={() => (open = false)}
    >×</button>

    {#each navLinks as link}
      <a
        href={link.href}
        class="text-[var(--text)] no-underline"
        onclick={() => (open = false)}
      >
        {link.label}
      </a>
    {/each}
  </div>
{/if}