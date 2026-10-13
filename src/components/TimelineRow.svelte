<script lang="ts">
  let {
    title,
    subtitle,
    note,
    date,
    commit,
  }: { title: string; subtitle: string; note?: string; date: string; commit: string } = $props();
</script>

<div class="timeline-row flex justify-between items-baseline py-4 gap-4 border-b border-[var(--line)] last:border-none" data-commit={commit}>
  <div>
    <div class="commit-msg commit-branch"></div>
    <strong class="node-anchor block t-small text-[var(--text)] font-semibold">{title}</strong>
    <span class="t-caption text-[var(--dim)]">{subtitle}</span>
    {#if note}
      <p class="t-caption text-[var(--dimmer)] mt-1">{note}</p>
    {/if}
  </div>
  <div class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)] whitespace-nowrap text-right">
    {date}
  </div>
</div>