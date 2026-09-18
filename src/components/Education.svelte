<script lang="ts">
  import TimelineRow from './TimelineRow.svelte';
  import SectionHead from './SectionHead.svelte';

  interface EducationItem {
    id: string;
    degree: string;
    school: string;
    details: string;
    dates: string;
    order: number;
    commit: string;
  }

  let { educationList = [] }: { educationList: EducationItem[] } = $props();
  let sortedEdu = $derived([...educationList].sort((a, b) => b.order - a.order));
</script>

<section id="education" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-subitems=".timeline-row" data-commit='git commit -m "feat: education"'>
  <SectionHead addr="05" title="Education" />
  <div>
    {#each sortedEdu as edu}
      <TimelineRow
        title={edu.degree}
        subtitle={edu.school}
        note={edu.details}
        date={edu.dates}
        commit={edu.commit}
      />
    {/each}
  </div>
</section>