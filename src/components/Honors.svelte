<script lang="ts">
  import TimelineRow from './TimelineRow.svelte';
  import SectionHead from './SectionHead.svelte';

  interface AwardsItem {
    id: string;
    title: string;
    issuer: string;
    date: string;
    year: string;
    order: number;
    commit: string;
    body?: string;
  }

  let { awards = [] }: { awards: AwardsItem[] } = $props();
  let sortedAwards = $derived([...awards].sort((a, b) => b.order - a.order));
</script>

<section id="awards" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-subitems=".timeline-row" data-commit='git commit -m "feat: honors"'>
  <SectionHead addr="04" title="Honors & Awards" />
  <div>
    {#each sortedAwards as item}
      <TimelineRow
        title={item.title}
        subtitle={item.issuer}
        note={item.body}
        date={item.date}
        commit={item.commit}
      />
    {/each}
  </div>
</section>