export const skillGroups = [
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

export function slugify(s: string): string {
  return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}