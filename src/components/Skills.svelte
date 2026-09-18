<script lang="ts">
  import SectionHead from './SectionHead.svelte';
  import { skillGroups } from '../lib/skills';
</script>

<section id="skills" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-subitems=".skill-group" data-commit='git commit -m "feat: skills"'>
  <SectionHead addr="02" title="Skills" />

  <div class="flex flex-col gap-7">
    {#each skillGroups as group}
      <div class="skill-group" data-commit={group.commit}>
        <div class="commit-msg commit-branch"></div>
        <h3 class="node-anchor font-[family-name:var(--font-mono)] text-xs text-[var(--brass)] uppercase tracking-[0.05em] mb-3">
          {group.title}
        </h3>
        <div class="flex flex-wrap gap-2">
          {#each group.skills as skill}
            <span class="text-[13px] px-3 py-[6px] bg-[var(--surface)] border border-[var(--line)] rounded-full text-[var(--text)]">
              {skill}
            </span>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>