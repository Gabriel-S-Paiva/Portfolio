<script lang="ts">
  import { onMount } from 'svelte';

  type Segment = { text: string; emphasis?: boolean };
  let { segments, class: className = '' }: { segments: Segment[]; class?: string } = $props();

  let spans: HTMLElement[] = [];

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // full text is already rendered server-side — leave it as-is

    // clear the server-rendered text, then type it back in
    spans.forEach(el => { if (el) el.textContent = ''; });

    let segIndex = 0, charIndex = 0;
    const step = () => {
      if (segIndex >= segments.length) return;
      const seg = segments[segIndex];
      charIndex++;
      spans[segIndex].textContent = seg.text.slice(0, charIndex);
      if (charIndex >= seg.text.length) { segIndex++; charIndex = 0; }
      setTimeout(step, 26);
    };
    step();
  });
</script>

<h1 class={className}>
  {#each segments as seg, i}
    {#if seg.emphasis}
      <em bind:this={spans[i]} class="text-[var(--brass)] not-italic">{seg.text}</em>
    {:else}
      <span bind:this={spans[i]}>{seg.text}</span>
    {/if}
  {/each}
  <span class="cursor">&nbsp;</span>
</h1>

<style>
  .cursor {
    display: inline-block;
    width: 0.5ch;
    background: var(--brass);
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .cursor { animation: none; }
  }
</style>