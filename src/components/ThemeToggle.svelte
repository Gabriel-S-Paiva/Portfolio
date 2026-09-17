<script lang="ts">
  import { onMount } from 'svelte';

  let theme = $state<'dark' | 'light'>('dark');

  function applyTheme(next: 'dark' | 'light') {
    theme = next;
    document.documentElement.setAttribute('data-theme', next);
  }

  onMount(() => {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  });
</script>

<button
  type="button"
  class="font-[family-name:var(--font-mono)] text-xs text-[var(--dim)] bg-[var(--surface)] border border-[var(--line)] rounded-full px-3 py-[5px] cursor-pointer hover:border-[var(--brass)] hover:text-[var(--brass)] transition-colors"
  onclick={() => applyTheme(theme === 'dark' ? 'light' : 'dark')}
>
  theme: {theme}
</button>