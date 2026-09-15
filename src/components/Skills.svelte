<script lang="ts">
  import SectionHead from './SectionHead.svelte';

  const skillGroups = [
    {
      title: 'Languages',
      commit: 'git commit -m "add languages"',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'Go', 'Python', 'SQL (MySQL)', 'PHP', 'HTML5 / CSS3']
    },
    {
      title: 'Backend & Systems',
      commit: 'git commit -m "add backend & systems"',
      skills: ['Node.js', 'Express', 'REST APIs', 'WebSockets (Socket.IO)', 'SQLite', 'MySQL (Sequelize)', 'MongoDB (Mongoose)', 'JWT & Sessions']
    },
    {
      title: 'DevOps & Testing',
      commit: 'git commit -m "add devops & testing"',
      skills: ['Docker', 'Docker Compose', 'Caddy', 'GitHub Actions (CI/CD)', 'go test', 'Vitest', 'Git']
    },
    {
      title: 'Frontend & Prototyping',
      commit: 'git commit -m "add frontend & prototyping"',
      skills: ['SvelteKit 5', 'Vue.js (Pinia)', 'Three.js / Rapier.js', 'Tailwind CSS', 'Figma']
    }
  ];
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