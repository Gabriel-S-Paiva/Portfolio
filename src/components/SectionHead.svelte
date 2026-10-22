<script lang="ts">
  let { addr, title }: { addr: string; title: string } = $props();
</script>

<div class="section-head">
  <div class="commit-msg commit-main"></div>
  <div class="flex items-baseline gap-3">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">{addr}</span>
    <h2 class="node-anchor t-h2 text-[var(--text)]">{title}</h2>
  </div>
</div> 