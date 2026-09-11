<script lang="ts">
  interface EducationItem {
    degree: string;
    school: string;
    details: string;
    dates: string;
  }

  let { educationList = [] }: { educationList: EducationItem[] } = $props();
</script>

<section id="education" class="max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]">
  <div class="flex items-baseline gap-3 mb-8">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">05</span>
    <h2 class="font-[family-name:var(--font-display)] text-2xl text-[var(--text)]">Education</h2>
  </div>

  <div class="divide-y divide-[var(--line)]">
    {#each educationList as edu}
      <div class="flex justify-between items-baseline py-4 gap-4">
        <div>
          <strong class="block text-[15px] text-[var(--text)] font-semibold">{edu.degree}</strong>
          <span class="text-[13px] text-[var(--dim)]">{edu.school}</span>
          <p class="text-[12.5px] text-[var(--dimmer)] mt-1">{edu.details}</p>
        </div>
        <div class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)] whitespace-nowrap text-right">
          {edu.dates}
        </div>
      </div>
    {/each}
  </div>
</section>