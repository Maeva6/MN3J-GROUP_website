import { motion } from "framer-motion";
import { siteConfig } from "../data/siteConfig";

// lucide-react n'inclut plus les logos de marques (retraits pour raisons de
// marque déposée) : les 5 icônes réseaux sociaux sont donc définies en SVG brut.

const YoutubeIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5c-1.1.3-1.9 1.1-2.2 2.2C0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
  </svg>
);

const LinkedinIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.5V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.6 0 4.1 2.4 4.1 5.4v6.2zM5.3 7.4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM7 20.4H3.5V9H7v11.4z" />
  </svg>
);

const TiktokIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M16.6 5.8c-.9-.9-1.4-2.1-1.4-3.4h-3.2v14.2c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V10.5c-.3 0-.6-.1-.9-.1-3.4 0-6.1 2.7-6.1 6.1s2.7 6.1 6.1 6.1 6.1-2.7 6.1-6.1V8.9c1.3.9 2.9 1.5 4.6 1.5V7.2c-1 0-1.9-.3-2.6-.9-.2-.1-.4-.3-.6-.5z" />
  </svg>
);

const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M22 12a10 10 0 10-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.7-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0022 12z" />
  </svg>
);

const links = [
  { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: siteConfig.social.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
];

export default function SocialIcons({ variant = "dark", size = "md", animated = false }) {
  const base =
    variant === "dark"
      ? "bg-white/10 text-white hover:bg-green hover:text-[#12310F] hover:shadow-lg hover:shadow-green/20"
      : "bg-navy/5 text-navy hover:bg-green hover:text-white hover:shadow-lg hover:shadow-green/20";

  const sizes = {
    md: { wrap: "w-11 h-11", icon: 20 },
    lg: { wrap: "w-14 h-14", icon: 24 },
  };
  const { wrap, icon } = sizes[size] ?? sizes.md;
  const Tag = animated ? motion.a : "a";

  return (
    <div className="flex items-center gap-4">
      {links.map(({ href, label, Icon }, i) => (
        <Tag
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className={`${wrap} rounded-full flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-0.5 ${base}`}
          {...(animated
            ? {
                initial: { opacity: 0, y: 12, scale: 0.8 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, margin: "-40px" },
                transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
              }
            : {})}
        >
          <Icon width={icon} height={icon} />
        </Tag>
      ))}
    </div>
  );
}
