<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type SubItem = {
    title: HTMLElement | null;
    node: SVGCircleElement;
    caption: HTMLElement | null;
    text: string;
    done: boolean;
  };

  type SectionGraph = {
    section: HTMLElement;
    H: number;
    lineEls: SVGGeometryElement[];
    mainTitleEl: HTMLElement;
    mainNode: SVGCircleElement;
    mainCaption: HTMLElement | null;
    mainText: string;
    mainDone: boolean;
    initNode: SVGCircleElement | null;
    initCaption: HTMLElement | null;
    initDone: boolean;
    subData: SubItem[];
  };

  let sectionGraphs: SectionGraph[] = [];
  let reduced = false;
  let resizeTimer: ReturnType<typeof setTimeout>;
  let ticking = false;

  function curvePath(x1: number, y1: number, x2: number, y2: number) {
    const midY = (y1 + y2) / 2;
    return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
  }

  function buildGraphs() {
    sectionGraphs = [];
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.gitline'));

    sections.forEach((section, idx) => {
      section.querySelector('.graph-svg')?.remove();

      const secRect = section.getBoundingClientRect();
      const H = section.offsetHeight;
      const mainX = 10, branchX = 38;
      const isLast = idx === sections.length - 1;

      const mainTitle = section.querySelector<HTMLElement>('.section-head .node-anchor');
      if (!mainTitle) return;
      const mtRect = mainTitle.getBoundingClientRect();
      const mainY = (mtRect.top - secRect.top) + mtRect.height / 2;

      let inner = '';
      let trunkStartY = 0;

      if (section.id === 'about') {
        const initY = Math.max(mainY - 50, 10);
        inner += `<circle class="node init-node" cx="${mainX}" cy="${initY}" r="3.5" />`;
        trunkStartY = initY;
      }

      inner += `<line class="main-line" x1="${mainX}" y1="${trunkStartY}" x2="${mainX}" y2="${isLast ? mainY : H}" />`;
      inner += `<circle class="node main-node" cx="${mainX}" cy="${mainY}" r="5" />`;

      const subSelector = section.dataset.subitems;
      const subEls = subSelector ? Array.from(section.querySelectorAll<HTMLElement>(subSelector)) : [];
      const subTitles = subEls
        .map(el => el.querySelector<HTMLElement>('.node-anchor'))
        .filter((t): t is HTMLElement => !!t);

      if (subTitles.length) {
        const ys = subTitles.map(t => {
          const r = t.getBoundingClientRect();
          return (r.top - secRect.top) + r.height / 2;
        });
        const firstY = ys[0], lastY = ys[ys.length - 1];
        const mergeEndY = Math.min(H - 10, lastY + 40);

        inner += `<path class="branch-line" d="${curvePath(mainX, mainY, branchX, firstY)}" />`;
        if (ys.length > 1) inner += `<path class="branch-line" d="M ${branchX} ${firstY} L ${branchX} ${lastY}" />`;
        inner += `<path class="branch-line" d="${curvePath(branchX, lastY, mainX, mergeEndY)}" />`;
        ys.forEach(y => { inner += `<circle class="node branch-node" cx="${branchX}" cy="${y}" r="4" />`; });
      }

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'graph-svg');
      svg.setAttribute('width', '52');
      svg.setAttribute('height', String(H));
      svg.innerHTML = inner;
      section.insertBefore(svg, section.firstChild);

      const lineEls = Array.from(svg.querySelectorAll<SVGGeometryElement>('.main-line, .branch-line'));
      lineEls.forEach(el => {
        const len = el.getTotalLength();
        const bbox = el.getBBox();
        el.dataset.len = String(len);
        el.dataset.y0 = String(bbox.y);
        el.dataset.y1 = String(bbox.y + bbox.height);
        el.style.strokeDasharray = String(len);
        el.style.strokeDashoffset = reduced ? '0' : String(len);
      });

      const branchNodes = Array.from(svg.querySelectorAll<SVGCircleElement>('.branch-node'));
      const subData: SubItem[] = subEls.map((el, i) => ({
        title: subTitles[i] ?? null,
        node: branchNodes[i],
        caption: el.querySelector<HTMLElement>('.commit-msg'),
        text: el.dataset.commit ?? '',
        done: false,
      }));

      sectionGraphs.push({
        section, H, lineEls,
        mainTitleEl: mainTitle,
        mainNode: svg.querySelector('.main-node') as SVGCircleElement,
        mainCaption: section.querySelector<HTMLElement>('.section-head .commit-msg'),
        mainText: section.dataset.commit ?? '',
        mainDone: false,
        initNode: section.id === 'about' ? (svg.querySelector('.init-node') as SVGCircleElement) : null,
        initCaption: section.id === 'about' ? document.getElementById('initCaption') : null,
        initDone: false,
        subData,
      });
    });

    if (reduced) { revealAllImmediately(); return; }
    onScrollFrame();
  }

  function revealAllImmediately() {
    sectionGraphs.forEach(g => {
      if (g.initCaption) { g.initCaption.textContent = 'git init'; g.initNode?.classList.add('in'); }
      if (g.mainCaption) g.mainCaption.textContent = g.mainText;
      g.mainNode.classList.add('in');
      g.subData.forEach(s => {
        if (s.caption) s.caption.textContent = s.text;
        s.node?.classList.add('in');
      });
    });
  }

  function typeAndReveal(
    captionEl: HTMLElement | null,
    text: string,
    node: SVGCircleElement | null,
    onDone?: () => void
  ) {
    if (!captionEl) { node?.classList.add('in'); onDone?.(); return; }
    let i = 0;
    const step = () => {
      i++;
      captionEl.innerHTML = text.slice(0, i) + '<span class="commit-cursor"></span>';
      if (i < text.length) { setTimeout(step, 15); }
      else {
        captionEl.textContent = text;
        node?.classList.add('in');
        onDone?.();
      }
    };
    step();
  }

  function triggerMain(g: SectionGraph) {
    if (g.mainDone) return;
    g.mainDone = true;
    typeAndReveal(g.mainCaption, g.mainText, g.mainNode);
  }

  function onScrollFrame() {
    const refY = window.innerHeight * 0.72;
    sectionGraphs.forEach(g => {
      const rect = g.section.getBoundingClientRect();
      if (rect.bottom < -400 || rect.top > window.innerHeight + 400) return;

      // each line draws based on its OWN y-span, not the section's — this is the fix
      g.lineEls.forEach(el => {
        const y0 = parseFloat(el.dataset.y0 ?? '0');
        const y1 = parseFloat(el.dataset.y1 ?? '0');
        const span = Math.max(y1 - y0, 1);
        const lineProgress = Math.min(1, Math.max(0, (refY - rect.top - y0) / span));
        const len = parseFloat(el.dataset.len ?? '0');
        el.style.strokeDashoffset = String(len * (1 - lineProgress));
      });

      if (g.initCaption && !g.initDone) {
        if (rect.top < refY) {
          g.initDone = true;
          typeAndReveal(g.initCaption, 'git init', g.initNode, () => {
            setTimeout(() => triggerMain(g), 200);
          });
        }
      } else if (!g.mainDone && g.mainTitleEl.getBoundingClientRect().top < refY) {
        triggerMain(g);
      }

      g.subData.forEach(s => {
        if (!s.done && s.title && s.title.getBoundingClientRect().top < refY) {
          s.done = true;
          typeAndReveal(s.caption, s.text, s.node);
        }
      });
    });
  }

  function onScroll() {
    if (reduced) return;
    if (!ticking) {
      requestAnimationFrame(() => { onScrollFrame(); ticking = false; });
      ticking = true;
    }
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGraphs, 200);
  }

  onMount(() => {
    reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    buildGraphs();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    if (typeof window === 'undefined') return;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    clearTimeout(resizeTimer);
  });
</script>

<style>
  :global(.gitline) { position: relative; }
  @media (min-width: 820px) {
    :global(.gitline) { padding-left: 84px; }
  }
  :global(.graph-svg) {
    position: absolute; top: 0; left: 18px; width: 52px; height: 100%;
    pointer-events: none; display: none; overflow: visible;
  }
  @media (min-width: 820px) {
    :global(.graph-svg) { display: block; }
  }
  :global(.graph-svg .main-line) { stroke: var(--dimmer); stroke-width: 1.5; fill: none; }
  :global(.graph-svg .branch-line) { stroke: var(--dimmer); stroke-width: 1.5; fill: none; opacity: .75; }
  :global(.graph-svg circle.node) { transition: fill .3s ease, stroke .3s ease; }
  :global(.graph-svg circle.main-node),
  :global(.graph-svg circle.init-node) { fill: var(--bg); stroke: var(--dimmer); }
  :global(.graph-svg circle.main-node.in),
  :global(.graph-svg circle.init-node.in) { fill: var(--green); stroke: var(--green); }
  :global(.graph-svg circle.branch-node) { fill: var(--bg); stroke: var(--dimmer); }
  :global(.graph-svg circle.branch-node.in) { fill: var(--brass); stroke: var(--brass); }

  :global(.commit-msg) {
    font-family: var(--font-mono); font-size: 11.5px; min-height: 1.4em;
    margin-bottom: 4px; display: block;
  }
  :global(.commit-msg.commit-main) { color: var(--green); }
  :global(.commit-msg.commit-branch) { color: var(--brass); }
  :global(.commit-cursor) {
    display: inline-block; width: .5ch; height: 1em; background: currentColor;
    vertical-align: -2px; animation: commit-blink 1s step-end infinite;
  }
  :global(.init-caption) {
    color: var(--green); font-family: var(--font-mono); font-size: 11.5px;
    min-height: 1.4em; margin-bottom: 8px; display: block;
  }
  @keyframes commit-blink { 50% { opacity: 0; } }
</style>