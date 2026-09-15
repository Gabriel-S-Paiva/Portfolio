<script lang="ts">
  import SectionHead from './SectionHead.svelte';
</script>

<section id="contact" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-commit='git commit -m "feat: contact"'>
  <SectionHead addr="06" title="Contact" />

  <div class="flex gap-3.5 flex-wrap">
    <a href="mailto:mr.sousapaiva@gmail.com" class="flex-1 min-w-[180px] bg-[var(--surface)] border border-[var(--line)] rounded-lg p-4.5 no-underline hover:border-[var(--brass)] transition-colors">
      <div class="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dimmer)] uppercase mb-1.5">Email</div>
      <div class="text-sm text-[var(--text)] break-all">mr.sousapaiva@gmail.com</div>
    </a>
    <a href="https://github.com/Gabriel-S-Paiva" target="_blank" rel="noopener" class="flex-1 min-w-[180px] bg-[var(--surface)] border border-[var(--line)] rounded-lg p-4.5 no-underline hover:border-[var(--brass)] transition-colors">
      <div class="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dimmer)] uppercase mb-1.5">GitHub</div>
      <div class="text-sm text-[var(--text)] break-all">Gabriel-S-Paiva</div>
    </a>
    <a href="https://linkedin.com/in/gabriel-s-paiva" target="_blank" rel="noopener" class="flex-1 min-w-[180px] bg-[var(--surface)] border border-[var(--line)] rounded-lg p-4.5 no-underline hover:border-[var(--brass)] transition-colors">
      <div class="font-[family-name:var(--font-mono)] text-[11px] text-[var(--dimmer)] uppercase mb-1.5">LinkedIn</div>
      <div class="text-sm text-[var(--text)] break-all">gabriel-s-paiva</div>
    </a>
  </div>
</section>