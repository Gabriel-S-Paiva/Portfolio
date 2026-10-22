<script lang="ts">
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { navLinks, cvHref, cvFilename, isCurrent } from '../lib/nav-links';

  let { current = '/' }: { current?: string } = $props();

  let open = $state(false);
  let menuBtn: HTMLButtonElement | undefined = $state();

  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const contacts = [
    { label: 'Email', href: 'mailto:mr.sousapaiva@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/Gabriel-S-Paiva' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/gabriel-s-paiva' },
  ];

  // The panel sits inside the sticky nav (absolute, below the bar), so the toggle stays
  // visible and keyboard order is bar -> panel -> page.
  $effect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  });

  // Reset when the viewport grows into the desktop nav.
  $effect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => { if (mq.matches) open = false; };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  });

  function close(restoreFocus = false) {
    open = false;
    if (restoreFocus) menuBtn?.focus({ preventScroll: true });
  }
</script>

<svelte:window onkeydown={(e) => { if (open && e.key === 'Escape') close(true); }} />

<button
  bind:this={menuBtn}
  type="button"
  class="lg:hidden relative w-11 h-11 -mr-3 cursor-pointer bg-transparent border-none"
  aria-label={open ? 'Close menu' : 'Open menu'}
  aria-expanded={open}
  aria-controls="mobile-menu"
  onclick={() => (open ? close() : (open = true))}
>
  <span class="bar top" class:open></span>
  <span class="bar bottom" class:open></span>
</button>

{#if open}
  <div
    id="mobile-menu"
    class="lg:hidden absolute left-0 right-0 top-full h-[calc(100dvh-60px)] overflow-y-auto bg-[var(--bg)] border-t border-[var(--line)]"
    transition:fly={{ y: -10, duration: reduced() ? 0 : 220, easing: cubicOut }}
  >
    <div class="min-h-full px-7 pt-4 pb-10 flex flex-col">
      <nav aria-label="Primary">
        <ul>
          {#each navLinks as link}
            {@const active = isCurrent(link.href, current)}
            <li class="border-b border-[var(--line)]">
              <a
                href={link.href}
                aria-current={active ? 'page' : undefined}
                onclick={() => close()}
                class="flex items-center justify-between py-4 t-h1 no-underline transition-colors {active ? 'text-[var(--brass)]' : 'text-[var(--text)] hover:text-[var(--brass)]'}"
              >
                <span>{link.label}</span>
                {#if active}<span class="t-caption font-[family-name:var(--font-mono)] text-[var(--dim)]">you are here</span>{/if}
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <div class="mt-auto pt-10">
        <a
          href={cvHref}
          download={cvFilename}
          class="block text-center t-small font-semibold px-5 py-3 rounded-md no-underline border border-[var(--brass)] bg-[var(--brass)] text-[#161310] active:scale-[0.98] transition-transform"
        >Download CV</a>

        <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-mono)] t-caption">
          {#each contacts as c}
            <li>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener' : undefined}
                class="text-[var(--dim)] no-underline hover:text-[var(--brass)] transition-colors"
              >{c.label}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
  .bar {
    position: absolute; left: 12px; width: 20px; height: 1.5px;
    background: var(--text);
    transition: transform .22s cubic-bezier(.16, 1, .3, 1);
  }
  .top { top: 17px; }
  .bottom { top: 25px; }
  .top.open { transform: translateY(4px) rotate(45deg); }
  .bottom.open { transform: translateY(-4px) rotate(-45deg); }
  @media (prefers-reduced-motion: reduce) { .bar { transition: none; } }
</style>
