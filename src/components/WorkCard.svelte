<script lang="ts">
  interface Props {
    title: string;
    date: string;
    role: string;
    awardBadge?: string | undefined;
    stack: string[];
    repoUrl: string;
    commit: string;
    shot: string;
    descriptionHtml?: string | undefined;
  }

  let {
    title,
    date,
    role,
    awardBadge,
    stack,
    repoUrl,
    commit,
    shot,
    descriptionHtml = ''
  }: Props = $props();
</script>

<div class="project-card bg-[var(--surface)] border border-[var(--line)] rounded-xl p-7 mb-5" data-commit={commit} data-shot={shot}>
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
    <a href={repoUrl} target="_blank" rel="noopener" class="text-[var(--dim)] underline decoration-dotted decoration-[var(--dimmer)] hover:text-[var(--brass)] hover:decoration-[var(--brass)]">
      GitHub Repository ↗
    </a>
  </div>
  <div class="text-[10.5px] text-[var(--dimmer)] mt-2.5 font-[family-name:var(--font-mono)]">
    hover the card — the preview tilts a little with your cursor
  </div>
</div>