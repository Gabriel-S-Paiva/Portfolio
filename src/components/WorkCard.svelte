<script lang="ts">
  interface Props {
    title: string;
    date: string;
    role: string;
    awardBadge?: string | undefined;
    stack: string[];
    repoUrl?: string;
    commit: string;
    shot: string;
    descriptionHtml?: string | undefined;
  }

  let {
    title, date, role, awardBadge, stack, repoUrl, commit, shot,
    descriptionHtml = ''
  }: Props = $props();

  let cardEl: HTMLDivElement | undefined = $state();
  let previewEl: HTMLDivElement | undefined = $state();
  let hovering = $state(false);

  const isImage = /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(shot ?? '');

  // Preview position/tilt live outside Svelte state: they change every frame,
  // and re-rendering on each mousemove is what made the old version janky.
  const PREVIEW_W = 280;
  const OFFSET = 24;
  const MAX_TILT = 7;
  let target = { x: 0, y: 0, rx: 0, ry: 0 };
  let current = { x: 0, y: 0, rx: 0, ry: 0 };
  let raf = 0;
  let reduceMotion = false;

  // Move the preview under <body> so no ancestor transform/filter can
  // become the containing block for `position: fixed`.
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return { destroy: () => node.remove() };
  }

  function place(clientX: number, clientY: number) {
    const h = previewEl?.offsetHeight ?? 180;
    let x = clientX + OFFSET;
    let y = clientY + OFFSET;
    if (x + PREVIEW_W > window.innerWidth - 12) x = clientX - OFFSET - PREVIEW_W;
    if (y + h > window.innerHeight - 12) y = window.innerHeight - 12 - h;
    target.x = Math.max(12, x);
    target.y = Math.max(12, y);
  }

  function tick() {
    const k = reduceMotion ? 1 : 0.2;
    current.x += (target.x - current.x) * k;
    current.y += (target.y - current.y) * k;
    current.rx += (target.rx - current.rx) * k;
    current.ry += (target.ry - current.ry) * k;
    if (previewEl) {
      previewEl.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      const inner = previewEl.firstElementChild as HTMLElement | null;
      if (inner) inner.style.setProperty('--tilt', `rotateX(${current.rx}deg) rotateY(${current.ry}deg)`);
    }
    raf = requestAnimationFrame(tick);
  }

  function handleMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    target.ry = reduceMotion ? 0 : (px - 0.5) * MAX_TILT * 2;
    target.rx = reduceMotion ? 0 : (0.5 - py) * MAX_TILT * 2;
    place(e.clientX, e.clientY);
  }

  function handleEnter(e: MouseEvent) {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    place(e.clientX, e.clientY);
    // Start at the cursor so the preview does not fly in from the last card.
    current = { ...target };
    hovering = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function handleLeave() {
    hovering = false;
    target.rx = 0;
    target.ry = 0;
    // Keep the loop alive just long enough for the fade-out to finish.
    setTimeout(() => { if (!hovering) cancelAnimationFrame(raf); }, 250);
  }

  $effect(() => () => cancelAnimationFrame(raf));
</script>

<div
  bind:this={cardEl}
  onmousemove={handleMove}
  onmouseenter={handleEnter}
  onmouseleave={handleLeave}
  class="project-card relative bg-[var(--surface)] border border-[var(--line)] rounded-xl p-7 mb-5"
  data-commit={commit}
  data-shot={shot}
  role="group"
  aria-labelledby="project-title-{commit}"
>
  <div class="commit-msg commit-branch"></div>
  <div class="flex justify-between items-baseline mb-2.5 flex-wrap gap-2">
    <h3 class="node-anchor text-[19px] text-[var(--text)] font-semibold">{title}</h3>
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">{date}</span>
  </div>

  <div class="text-xs text-[var(--brass)] mb-3.5 flex items-center gap-2">
    {role}
    {#if awardBadge}
      <span class="font-[family-name:var(--font-mono)] text-[10px] text-[var(--brass)] bg-[#c99a5b15] border border-[#c99a5b30] px-1.5 py-0.5 rounded">
        {awardBadge}
      </span>
    {/if}
  </div>

  {#if descriptionHtml}
    <div class="text-[var(--dim)] text-[14.5px] mb-4 [&_ul]:list-disc [&_ul]:ml-4 [&_li]:mb-1">
      {@html descriptionHtml}
    </div>
  {/if}

  <div class="flex flex-wrap gap-1.5 mb-3.5">
    {#each stack as tag}
      <span class="font-[family-name:var(--font-mono)] text-[11px] text-[var(--green)] bg-[#6fcf9714] border border-[#6fcf9730] px-2 py-0.5 rounded">
        {tag}
      </span>
    {/each}
  </div>

  <div class="flex gap-4 text-sm">
    {#if repoUrl}
      <a href={repoUrl} target="_blank" rel="noopener" class="text-[var(--dim)] underline decoration-dotted decoration-[var(--dimmer)] hover:text-[var(--brass)] hover:decoration-[var(--brass)]">
        GitHub Repository ↗
      </a>
    {/if}
  </div>
  <div class="text-[10.5px] text-[var(--dimmer)] mt-2.5 font-[family-name:var(--font-mono)]">
    hover the card to preview the project
  </div>
</div>

{#if shot}
  <div
    use:portal
    bind:this={previewEl}
    aria-hidden="true"
    class="work-preview fixed top-0 left-0 z-50 pointer-events-none"
    class:is-visible={hovering}
    style="width: {PREVIEW_W}px; perspective: 800px;"
  >
    <div class="work-preview-inner rounded-lg border border-[var(--line)] overflow-hidden bg-[var(--surface)] aspect-[16/10]">
      {#if isImage}
        <img src={shot} alt="" class="w-full h-full object-cover object-top block" />
      {:else}
        <div class="h-full text-[var(--dim)] text-[11px] font-[family-name:var(--font-mono)] p-3 overflow-hidden">
          {shot}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .work-preview { opacity: 0; transition: opacity 0.2s ease; will-change: transform, opacity; }
  .work-preview.is-visible { opacity: 1; }
  .work-preview-inner {
    transform: var(--tilt, none);
    scale: 0.94;
    transition: scale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 18px 40px -12px color-mix(in srgb, var(--brass) 28%, rgb(0 0 0 / 0.55));
    transform-origin: center;
  }
  .work-preview.is-visible .work-preview-inner {
    scale: 1;
  }
  :global(.project-card) { transition: border-color 0.2s ease; }
  :global(.project-card:hover) { border-color: var(--brass); }
  @media (hover: none) { .work-preview { display: none; } }
  @media (prefers-reduced-motion: reduce) {
    .work-preview, .work-preview-inner { transition: none; }
  }
</style>
