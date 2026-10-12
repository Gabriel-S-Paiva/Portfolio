export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/showcase', label: 'Showcase' },
  { href: '/blog', label: 'Blog' },
];

// Drop the PDF at public/cv.pdf; nothing else needs to change.
export const cvHref = '/cv.pdf';
export const cvFilename = 'Gabriel-Paiva-CV.pdf';

export function isCurrent(href: string, current: string) {
  const path = current.length > 1 ? current.replace(/\/$/, '') : current;
  return href === '/' ? path === '/' : path === href || path.startsWith(href + '/');
}
