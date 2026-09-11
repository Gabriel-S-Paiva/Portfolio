<script lang="ts">
  interface AwardsItem {
    title: string;
    issuer: string;
    date: string;
    year: string;
    order: number;
    description?: string;
  }

  let { awards = [] }: { awards: AwardsItem[] } = $props();

  let sortedAwards = $derived([...awards].sort((a, b) => b.order - a.order));
</script>

<section id="awards" class="max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]">
  <div class="flex items-baseline gap-3 mb-8">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">04</span>
    <h2 class="font-[family-name:var(--font-display)] text-2xl text-[var(--text)]">Honors & Awards</h2>
  </div>

  <div class="divide-y divide-[var(--line)]">
    {#each sortedAwards as item}
      <div class="flex justify-between items-baseline py-4 gap-4">
        <div>
          <strong class="block text-[15px] text-[var(--text)] font-semibold">{item.title}</strong>
          <span class="text-[13px] text-[var(--dim)]">{item.issuer}</span>
          <p class="text-[12.5px] text-[var(--dimmer)] mt-1">{item.description}</p>
        </div>
        <div class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)] whitespace-nowrap text-right">
          {item.date}
        </div>
      </div>
    {/each}
  </div>
</section>