<script lang="ts">
  import WorkCard from './WorkCard.svelte';

  interface Project {
    title: string;
    date: string;
    role: string;
    awardBadge?: string;
    stack: string[];
    repoUrl: string;
    body?: string;
  }

  let { projects = [] }: { projects: Project[] } = $props();
</script>

<section id="work" class="max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]">
  <div class="flex items-baseline gap-3 mb-8">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">03</span>
    <h2 class="font-[family-name:var(--font-display)] text-2xl text-[var(--text)]">Work</h2>
  </div>

  {#if projects.length === 0}
    <p class="text-[var(--dim)] font-mono text-sm">No projects found in collection.</p>
  {:else}
    {#each projects as p}
      <WorkCard 
        title={p.title}
        date={p.date}
        role={p.role}
        awardBadge={p.awardBadge ?? undefined}
        stack={p.stack}
        repoUrl={p.repoUrl}
        descriptionHtml={p.body ?? ''}
      />
    {/each}
  {/if}
</section>