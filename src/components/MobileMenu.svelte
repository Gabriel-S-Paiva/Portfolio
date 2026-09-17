<script lang="ts">
  import { navLinks } from '../lib/nav-links';
  let open = $state(false);
</script>

<button
  type="button"
  class="sm:hidden flex flex-col gap-[4px] w-5 cursor-pointer bg-transparent border-none"
  aria-label="Open menu"
  onclick={() => (open = true)}
>
  <span class="h-[1.5px] bg-[var(--text)] w-full"></span>
  <span class="h-[1.5px] bg-[var(--text)] w-full"></span>
  <span class="h-[1.5px] bg-[var(--text)] w-full"></span>
</button>

{#if open}
  <div class="fixed inset-0 bg-[var(--bg)] z-40 flex flex-col items-center justify-center gap-7 text-xl font-[family-name:var(--font-display)]">
    <button
      type="button"
      class="absolute top-5 right-7 text-3xl bg-transparent border-none text-[var(--text)]"
      onclick={() => (open = false)}
      aria-label="Close menu"
    ></button>
    {#each navLinks as link}
      <a>
        href={link.href}
        class="text-[var(--text)] no-underline"
        onclick={() => (open = false)}
      
        {link.label}
      </a>
    {/each}
  </div>
{/if}