<script lang="ts">
  const awards = [
    {
      title: 'Best WebPII Project Award — 1st Place',
      issuer: 'ESMAD, Politécnico do Porto',
      date: '2026',
      description: 'Awarded for backend architecture and implementation on Project SAM (Sistema de Apoio Municipal).'
    },
    {
      title: 'TeamGreen4All Hackathon — 1st Place',
      issuer: 'Serviços de Ação Social do Politécnico do Porto (SAS P.PORTO)',
      date: '2026',
      description: '1st place winner in the student wellbeing and sustainability hackathon as part of the 4BEST initiative.'
    },
    {
      title: 'Invited Speaker — ESMAD Academic Seminar',
      issuer: 'ESMAD, Licenciatura em TSIW',
      date: '2026',
      description: 'Talk: "Sucesso Académico em Contexto de Grupos de Trabalho." Invited following 1st place win in ESMAD Best Project Award.'
    },
    {
      title: '3.ª Edição Concurso de Programação madJS — 1st Place',
      issuer: 'ESMAD, Politécnico do Porto',
      date: '2025',
      description: '1st place in JavaScript/Web programming challenge.'
    },
    {
      title: 'ESMAD Best Project Award — 1st Place',
      issuer: 'ESMAD, Politécnico do Porto',
      date: '2025',
      description: '1st place recognition awarded for PlanIt application development.'
    }
  ];
</script>

<section id="awards" class="max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]">
  <div class="flex items-baseline gap-3 mb-8">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">04</span>
    <h2 class="font-[family-name:var(--font-display)] text-2xl text-[var(--text)]">Honors & Awards</h2>
  </div>

  <div class="divide-y divide-[var(--line)]">
    {#each awards as item}
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