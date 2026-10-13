<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import { navLinks, cvHref, cvFilename, isCurrent } from '../lib/nav-links';

  let { current = '/' }: { current?: string } = $props();

  const pill = "font-[family-name:var(--font-mono)] text-xs text-[var(--dim)] bg-[var(--surface)] border border-[var(--line)] rounded-full px-3 py-[5px] whitespace-nowrap no-underline transition-colors";
</script>

<nav class="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-md border-b border-[var(--line)]">
  <div class="max-w-[900px] mx-auto px-7 h-[60px] grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
    <a href="/" class="font-[family-name:var(--font-mono)] t-caption text-[var(--dim)] no-underline whitespace-nowrap">
      <b class="text-[var(--text)]">Gabriel Paiva</b><span class="hidden sm:inline">&nbsp;· backend & infra</span>
    </a>

    <div class="hidden lg:flex gap-[22px] t-caption">
      {#each navLinks as link}
        <a
          href={link.href}
          aria-current={isCurrent(link.href, current) ? 'page' : undefined}
          class="no-underline transition-colors hover:text-[var(--brass)] {isCurrent(link.href, current) ? 'text-[var(--text)]' : 'text-[var(--dim)]'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <div class="flex items-center justify-end gap-2">
      <div class="hidden lg:flex items-center gap-2">
        <a href={cvHref} download={cvFilename} class="{pill} hover:border-[var(--brass)] hover:text-[var(--brass)]">CV</a>
        <button
          type="button"
          disabled
          title="Portuguese version coming soon"
          aria-label="Language: English (Portuguese coming soon)"
          class="{pill} opacity-70 cursor-not-allowed"
        >EN</button>
      </div>
      <ThemeToggle />
      <MobileMenu {current} />
    </div>
  </div>
</nav>
