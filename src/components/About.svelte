<script lang="ts">
  import SectionHead from './SectionHead.svelte';
</script>

<section id="about" class="gitline max-w-[900px] mx-auto py-15 px-7 border-t border-[var(--line)]" data-commit='git commit -m "feat: about me"'>
  <div class="init-caption" id="initCaption"></div>
  <SectionHead addr="01" title="About" />
  <div class="text-[16px] text-[var(--dim)] max-w-[680px] space-y-4 leading-relaxed">
    <p>
      I focus on <strong class="text-[var(--text)] font-semibold">backend systems, REST APIs, and self-hosted infrastructure</strong>. While my degree coursework covers core web languages, UI/UX prototyping, and software design, I actively teach myself backend stack capabilities, building production-ready pipelines in <strong class="text-[var(--text)] font-semibold">Go, Node.js, and Docker</strong>.
    </p>
    <p>
      I build projects end-to-end: from designing multi-database architecture and session-handling schemas to setting up Caddy reverse proxies, CI/CD pipelines, and local homelab hardware. When I'm not writing server code, I'm competing in hackathons and coding challenges.
    </p>
  </div>
</section>