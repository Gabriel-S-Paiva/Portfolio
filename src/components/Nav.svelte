<script lang="ts">
  import ThemeToggle from './ThemeToggle.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import { navLinks } from '../lib/nav-links';
</script>

<nav class="sticky top-0 z-20 bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-md border-b border-[var(--line)]">
    <div class="max-w-[900px] mx-auto px-7 h-[60px] flex justify-between items-center">
    <div class="font-[family-name:var(--font-mono)] text-[13px] text-[var(--dim)]">
      <b class="text-[var(--text)]">Gabriel Paiva</b> · backend & infra
    </div>
    <div class="flex items-center gap-4">
      <div class="hidden sm:flex gap-[22px] text-[13px]">
        {#each navLinks as link}
          <a href={link.href} class="text-[var(--dim)] no-underline hover:text-[var(--brass)] transition-colors">
            {link.label}
          </a>
        {/each}
      </div>
      <ThemeToggle />
      <MobileMenu />
    </div>
  </div>
</nav>