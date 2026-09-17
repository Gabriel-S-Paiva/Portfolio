<script lang="ts">
  import WorkCard from './WorkCard.svelte';
  import SectionHead from './SectionHead.svelte';

  interface Project {
    title: string;
    date: string;
    role: string;
    awardBadge?: string;
    stack: string[];
    repoUrl: string;
    commit?: string;
    shot?: string;
    body?: string;
  }

  let { projects = [] }: { projects: Project[] } = $props();

  function fallbackCommit(title: string) {
    return `git commit -m "feat: ${title.toLowerCase()}"`;
  }
</script>

<section id="work" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-subitems=".project-card" data-commit='git commit -m "feat: work"'>
  <SectionHead addr="03" title="Work" />

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
        commit={p.commit ?? fallbackCommit(p.title)}
        shot={p.shot ?? `[ screenshot placeholder — ${p.title} ]`}
        descriptionHtml={p.body ?? ''}
      />
    {/each}
  {/if}
</section>