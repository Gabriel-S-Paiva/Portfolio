<script lang="ts">
  const skillGroups = [
    {
      title: 'Languages',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'Go', 'Python', 'SQL (MySQL)', 'PHP', 'HTML5 / CSS3']
    },
    {
      title: 'Backend & Systems',
      skills: ['Node.js', 'Express', 'REST APIs', 'WebSockets (Socket.IO)', 'SQLite', 'MySQL (Sequelize)', 'MongoDB (Mongoose)', 'JWT & Sessions']
    },
    {
      title: 'DevOps & Testing',
      skills: ['Docker', 'Docker Compose', 'Caddy', 'GitHub Actions (CI/CD)', 'go test', 'Vitest', 'Git']
    },
    {
      title: 'Frontend & Prototyping',
      skills: ['SvelteKit 5', 'Vue.js (Pinia)', 'Three.js / Rapier.js', 'Tailwind CSS', 'Figma']
    }
  ];
</script>

<section id="skills" class="max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]">
  <div class="flex items-baseline gap-3 mb-8">
    <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">02</span>
    <h2 class="font-[family-name:var(--font-display)] text-2xl text-[var(--text)]">Skills</h2>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-7">
    {#each skillGroups as group}
      <div>
        <h3 class="font-[family-name:var(--font-mono)] text-xs text-[var(--brass)] uppercase tracking-[0.05em] mb-3">
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