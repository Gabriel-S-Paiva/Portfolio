<script lang="ts">
  import { onMount } from 'svelte';

  let theme = $state<'dark' | 'light'>('dark');

  function applyTheme(next: 'dark' | 'light') {
    theme = next;
    document.documentElement.setAttribute('data-theme', next);
  }

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch {}
  }

  onMount(() => {
    // The inline script in Layout.astro already set data-theme; just sync state.
    theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  });
</script>

<button
  type="button"
  class="font-[family-name:var(--font-mono)] text-xs text-[var(--dim)] bg-[var(--surface)] border border-[var(--line)] rounded-full px-3 py-[5px] cursor-pointer hover:border-[var(--brass)] hover:text-[var(--brass)] transition-colors"
  onclick={toggle}
>
  theme: {theme}
</button>