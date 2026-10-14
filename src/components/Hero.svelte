<script lang="ts">
  import TypedHeadline from './TypedHeadline.svelte';
  import ScrollCue from './ScrollCue.svelte';

  const headlineSegments = [
    { text: 'I build ' },
    { text: 'backend systems', emphasis: true },
    { text: ' & self-hosted infrastructure.' },
  ];
</script>

<header class="min-h-[calc(100svh-3.75rem)] flex flex-col justify-center pt-12 pb-[120px] max-w-[900px] mx-auto px-7">
  <span class="font-[family-name:var(--font-mono)] text-xs text-[var(--green)] tracking-[0.04em] mb-[18px] block before:content-['branch:_'] before:text-[var(--dimmer)]">
    main
  </span>
  <TypedHeadline
    segments={headlineSegments}
    class="t-display text-[var(--text)] mb-5 min-h-[2.2em]"
  />
  <p class="t-lead text-[var(--dim)] max-w-[600px] mb-7">
    Web Information Systems and Technologies student at ESMAD / Politécnico do Porto. Winner of 4 coding competitions & hackathons, focused on REST APIs, backend architecture, and self-hosting services on a repurposed laptop in my home.
  </p>
  <div class="flex gap-3.5">
    <a href="#work" class="text-sm px-5 py-2.5 rounded-md no-underline border border-[var(--brass)] bg-[var(--brass)] text-[#161310] font-semibold hover:bg-[#dcae72] transition-colors">
      See my work
    </a>
    <a href="#contact" class="text-sm px-5 py-2.5 rounded-md no-underline border border-[var(--line)] text-[var(--text)] hover:border-[var(--dim)] transition-colors">
      Get in touch
    </a>
  </div>
</header>

<ScrollCue target="about" />