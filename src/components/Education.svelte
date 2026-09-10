<script lang="ts">
  const educationList = [
    {
      degree: 'BSc, Web Information Systems and Technologies',
      school: 'ESMAD / Politécnico do Porto',
      dates: '2024 — Present',
      details: 'Current Grade: 18.08 / 20. Coursework focus: HTML5, CSS3, JavaScript, Python, UI/UX, Object-Oriented Programming.'
    },
    {
      degree: 'Advanced Website Design and Programming',
      school: 'MasterD',
      dates: '2023 — 2025',
      details: 'Completed with 98% (20/20).'
    },
    {
      degree: 'Wind and Percussion Instrumental Performance',
      school: 'Academia de Música de Costa Cabral',
      dates: '2020 — 2023',
      details: 'Completed with 15/20.'
    }
  ];
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