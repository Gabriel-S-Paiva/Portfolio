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
  let hovering = $state(false);
  let tiltX = $state(0);
  let tiltY = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);

  const isImage = /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(shot ?? '');

  function handleMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const MAX_TILT = 4;
    tiltY = (px - 0.5) * MAX_TILT * 2;
    tiltX = (0.5 - py) * MAX_TILT * 2;

    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleEnter() { hovering = true; }
  function handleLeave() {
    hovering = false;
    tiltX = 0;
    tiltY = 0;
  }
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
    hover the card — the preview tilts a little with your cursor
  </div>
</div>

{#if hovering && shot}
  <div
    class="fixed z-50 pointer-events-none rounded-lg border border-[var(--line)] shadow-xl overflow-hidden bg-[var(--surface)]"
    style="left: {mouseX + 20}px; top: {mouseY + 20}px; width: 260px;"
  >
    {#if isImage}
      <img src={shot} alt="{title} preview" class="w-full h-auto block" loading="lazy" />
    {:else}
      <div class="text-[var(--dim)] text-[11px] font-[family-name:var(--font-mono)] p-3">
        {shot}
      </div>
    {/if}
  </div>
{/if}