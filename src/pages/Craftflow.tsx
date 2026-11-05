import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { links } from "../tokens";
import { CraftflowArtwork, CraftflowMark } from "./CraftflowArtwork";
import "./craftflow.css";

const projects = [
  {
    name: "Offscript",
    category: "Culture, with character",
    scope: "Strategy / Identity / Art direction",
    description:
      "An independent culture journal with something to say. A vivid blue, a deliberately oversized wordmark and a flexible graphic system give every story its own space.",
    idea: "A voice that refuses to disappear into the feed.",
    tags: ["Brand positioning", "Visual identity", "Editorial direction"],
    className: "offscript",
  },
  {
    name: "Onda",
    category: "A quieter kind of confidence",
    scope: "Identity / Packaging / Digital",
    description:
      "A personal care concept built around a simple feeling: a little more space to be yourself. Soft lilac, sculptural packaging and expressive typography carry that feeling from shelf to screen.",
    idea: "Care that feels personal, before you even open it.",
    tags: ["Visual identity", "Packaging system", "Digital direction"],
    className: "onda",
  },
  {
    name: "Forme",
    category: "Objects of intention",
    scope: "Positioning / Identity / Website",
    description:
      "A design practice for people who notice the details. An architectural identity pairs tactile materials with a precise typographic system, giving the work room to speak.",
    idea: "The same care, from the first impression to the final detail.",
    tags: ["Brand strategy", "Art direction", "Website concept"],
    className: "forme",
  },
];
const services = [
  {
    name: "Brand strategy & identity",
    note: "Find what makes you, you.",
    description:
      "A clear point of view, made recognisable. We find the idea at the heart of your business and build a visual and verbal world around it.",
    items: [
      "Positioning & naming",
      "Logo & visual identity",
      "Tone of voice",
      "Brand guidelines",
      "Packaging & print",
    ],
  },
  {
    name: "Websites & digital experiences",
    note: "Make every interaction count.",
    description:
      "Thoughtful structure, distinctive design and a clear next step. We build websites that feel like your brand and work beautifully across screens.",
    items: [
      "Website strategy",
      "UI & UX design",
      "Web development",
      "Landing pages",
      "Design systems",
    ],
  },
  {
    name: "Campaigns & content",
    note: "Give people a reason to stop.",
    description:
      "Ideas with a reason to exist and a place to go. We connect art direction, content and digital marketing so your brand shows up with a consistent voice.",
    items: [
      "Campaign concepts",
      "Social media design",
      "Content direction",
      "Paid media creative",
      "Search strategy & SEO",
    ],
  },
];
const interests = [
  "A new brand",
  "A better website",
  "A campaign",
  "Something else",
];

export default function Craftflow() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [featured, setFeatured] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeService, setActiveService] = useState<number | null>(0);
  const [interest, setInterest] = useState("A new brand");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 700px)").matches,
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = activeProject === null ? null : projects[activeProject];
  const whatsapp = `https://wa.me/918008794433?text=${encodeURIComponent(`Hi Craftflow, I'd like to discuss a project. I'm thinking about: ${interest.toLowerCase()}.`)}`;

  useEffect(() => {
    document.title = "Craftflow by Grenwall | Independent Design Studio";
    const description =
      "Different looks good on you. Craftflow is an independent Grenwall studio for brand strategy, visual identity, websites and campaigns.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", "https://grenwall.org/craftflow");
    for (const [property, content] of Object.entries({
      "og:title": document.title,
      "og:description": description,
      "og:url": "https://grenwall.org/craftflow",
      "twitter:title": document.title,
      "twitter:description": description,
    })) {
      document
        .querySelector(`meta[property="${property}"], meta[name="${property}"]`)
        ?.setAttribute("content", content);
    }
    document.querySelector('script[type="application/ld+json"]')?.remove();
    return () => clearTimeout(copyTimer.current);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeProject !== null && !dialog?.open) dialog?.showModal();
    if (activeProject === null && dialog?.open) dialog.close();
    if (activeProject !== null) {
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [activeProject]);

  function changeTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % projects.length
        : event.key === "ArrowLeft"
          ? (index + projects.length - 1) % projects.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? projects.length - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setFeatured(next);
    tabRefs.current[next]?.focus();
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setCopyFailed(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyFailed(true);
    }
  }

  return (
    <div className="cf-page" id="top">
      <a className="cf-skip" href="#work">
        Skip to work
      </a>
      <header className="cf-header">
        <a href="/craftflow" className="cf-logo" aria-label="Craftflow home">
          <CraftflowMark />
          <span>
            craftflow<span className="cf-logo-period">↗</span>
          </span>
        </a>
        <a className="cf-parent" href="/">
          An independent
          <br />
          Grenwall studio
        </a>
        <button
          className="cf-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="cf-navigation"
          type="button"
        >
          {menuOpen ? "Close" : "Menu"}
          {menuOpen ? <X /> : <Plus />}
        </button>
        <nav
          id="cf-navigation"
          className={`cf-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Craftflow navigation"
        >
          <a href="#work" onClick={() => setMenuOpen(false)}>
            Work
          </a>
          <a href="#studio" onClick={() => setMenuOpen(false)}>
            Studio
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a
            className="cf-nav-cta"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Let's talk <ArrowUpRight />
          </a>
        </nav>
      </header>
      <main>
        <section className="cf-hero" aria-labelledby="cf-title">
          <div className="cf-hero-heading">
            <h1 id="cf-title">
              Different looks
              <br />
              good on you.
            </h1>
            <div className="cf-hero-intro">
              <span className="cf-status">
                <span /> Independent by nature.
              </span>
              <p>We turn what makes you different into a brand people feel.</p>
              <a className="cf-text-link" href="#work">
                Discover our approach <ArrowDown />
              </a>
            </div>
          </div>
          <div
            className="cf-featured"
            id="cf-featured-panel"
            role="tabpanel"
            aria-labelledby={`cf-tab-${featured}`}
          >
            <button
              className="cf-featured-art"
              type="button"
              onClick={() => setActiveProject(featured)}
              aria-label={`Explore ${projects[featured].name} studio concept`}
            >
              <CraftflowArtwork
                index={featured}
                instance="hero"
                compact={compact}
              />
              <span className="cf-art-open">
                Explore the concept <ArrowUpRight />
              </span>
            </button>
            <div className="cf-featured-controls">
              <div>
                <strong>{projects[featured].name}</strong>
                <span>{projects[featured].scope}</span>
              </div>
              <span className="cf-concept-note">A studio exploration</span>
              <div
                className="cf-project-tabs"
                role="tablist"
                aria-label="Featured studio concepts"
              >
                {projects.map((item, index) => (
                  <button
                    key={item.name}
                    id={`cf-tab-${index}`}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    role="tab"
                    aria-selected={featured === index}
                    aria-controls="cf-featured-panel"
                    tabIndex={featured === index ? 0 : -1}
                    onClick={() => setFeatured(index)}
                    onKeyDown={(event) => changeTab(event, index)}
                    aria-label={`Show ${item.name}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <i />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="cf-hero-foot">
            <p>Strategy. Identity. Digital. A little good trouble.</p>
            <a href="#studio">
              Meet your creative partners <ArrowDownLeft />
            </a>
          </div>
        </section>
        <section
          className="cf-studio cf-section"
          id="studio"
          aria-labelledby="cf-studio-title"
        >
          <div className="cf-section-heading">
            <span className="cf-section-name">
              <CraftflowMark /> The studio
            </span>
            <span>Built on curiosity. Backed by Grenwall.</span>
          </div>
          <div className="cf-studio-body">
            <h2 id="cf-studio-title">
              Your difference.
              <br />
              Our starting point.
            </h2>
            <div>
              <p className="cf-lead">
                The best thing about your brand is the thing only you can be.
              </p>
              <p>
                We’re a design and digital marketing studio for businesses ready
                to find that thing, and show it to the world. Strategy,
                identity, websites and campaigns, connected by one clear idea.
              </p>
              <p>
                You work directly with the people doing the thinking and making.
                A close collaboration, from the first conversation to the last
                detail.
              </p>
              <a className="cf-text-link" href="#contact">
                Good work starts with a conversation <ArrowUpRight />
              </a>
            </div>
          </div>
          <div className="cf-studio-bottom">
            <span>
              Small team.
              <br />
              Whole-picture thinking.
            </span>
            <div className="cf-studio-signature" aria-hidden="true">
              A different
              <br />
              state of flow.
              <CraftflowMark />
            </div>
            <span>
              Based in India.
              <br />
              Open to the world.
            </span>
          </div>
        </section>
        <section
          className="cf-work cf-section"
          id="work"
          aria-labelledby="cf-work-title"
        >
          <div className="cf-work-heading">
            <div>
              <span className="cf-section-name">
                <CraftflowMark /> From the drawing board
              </span>
              <h2 id="cf-work-title">
                A point of view.
                <br />
                In every detail.
              </h2>
            </div>
            <p>
              A few self-initiated explorations.
              <br />A glimpse of how we think and make.
            </p>
          </div>
          <div className="cf-work-grid">
            {projects.slice(1).map((item, index) => (
              <article
                className={`cf-work-item cf-work-item--${item.className}`}
                key={item.name}
              >
                <button
                  className="cf-work-art"
                  type="button"
                  onClick={() => setActiveProject(index + 1)}
                  aria-label={`Explore ${item.name} studio concept`}
                >
                  <CraftflowArtwork
                    index={index + 1}
                    instance={`work-${index}`}
                    compact
                  />
                  <span className="cf-round-arrow">
                    <ArrowUpRight />
                  </span>
                </button>
                <div className="cf-work-caption">
                  <h3>{item.name}</h3>
                  <span>{item.category}</span>
                  <span>Studio concept</span>
                </div>
              </article>
            ))}
          </div>
          <div className="cf-work-note">
            <span>Every brand has its own world. Let's find yours.</span>
            <a className="cf-text-link" href="#contact">
              Your project could be next <ArrowUpRight />
            </a>
          </div>
        </section>
        <section
          className="cf-services cf-section"
          id="services"
          aria-labelledby="cf-services-title"
        >
          <div className="cf-services-intro">
            <span className="cf-section-name">
              <CraftflowMark /> What we bring
            </span>
            <h2 id="cf-services-title">
              From the
              <br />
              first what if.
              <br />
              To the final
              <br />
              that's it.
            </h2>
            <p>
              One creative partner.
              <br />
              Everything your brand needs to show up.
            </p>
            <a className="cf-text-link" href="#contact">
              Find your starting point <ArrowUpRight />
            </a>
          </div>
          <div className="cf-service-list">
            {services.map((service, index) => (
              <article
                className={`cf-service${activeService === index ? " is-open" : ""}`}
                key={service.name}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={activeService === index}
                    aria-controls={`cf-service-${index}`}
                    onClick={() =>
                      setActiveService(activeService === index ? null : index)
                    }
                  >
                    <span>
                      <small>{service.note}</small>
                      {service.name}
                    </span>
                    {activeService === index ? <Minus /> : <Plus />}
                  </button>
                </h3>
                <div
                  className="cf-service-details"
                  hidden={activeService !== index}
                  id={`cf-service-${index}`}
                >
                  <p>{service.description}</p>
                  <ul>
                    {service.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="cf-process cf-section"
          aria-labelledby="cf-process-title"
        >
          <div className="cf-section-heading">
            <span className="cf-section-name">
              <CraftflowMark /> How we get there
            </span>
            <h2 id="cf-process-title">
              Good chemistry.
              <br />
              Great outcomes.
            </h2>
          </div>
          <div className="cf-process-steps">
            {[
              [
                "01",
                "Get to the heart.",
                "We listen, ask better questions and agree on what your brand needs to do. The brief comes from understanding you.",
              ],
              [
                "02",
                "Explore the possibilities.",
                "You see the thinking early. We explore directions, talk them through and refine the one that feels right.",
              ],
              [
                "03",
                "Make it real.",
                "We carry the idea into every detail, build what you need and help you bring it into the world.",
              ],
            ].map(([number, title, copy]) => (
              <div key={number}>
                <span className="cf-step-number">
                  {number}
                  <ArrowRight />
                </span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="cf-contact cf-section"
          id="contact"
          aria-labelledby="cf-contact-title"
        >
          <div className="cf-contact-top">
            <span className="cf-section-name">
              <CraftflowMark /> A good place to start
            </span>
            <a href={`mailto:${links.email}`}>
              Rather email? <ArrowUpRight />
            </a>
          </div>
          <div className="cf-contact-body">
            <h2 id="cf-contact-title">
              Something
              <br />
              on your mind?
            </h2>
            <div className="cf-contact-options">
              <p>
                A big idea. A fresh start. A brief that isn't quite a brief yet.
                We're listening.
              </p>
              <fieldset>
                <legend>I'm thinking about...</legend>
                <div>
                  {interests.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={interest === item}
                      onClick={() => setInterest(item)}
                    >
                      {item}
                      {interest === item && <Check />}
                    </button>
                  ))}
                </div>
              </fieldset>
              <a
                className="cf-contact-button"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                Let's make it happen <ArrowUpRight />
              </a>
              <small>Continue the conversation on WhatsApp.</small>
            </div>
          </div>
          <div className="cf-contact-email">
            <a href={`mailto:${links.email}?subject=Let's%20talk%20Craftflow`}>
              {links.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check /> : <Copy />}
            </button>
            <span role="status">
              {copied
                ? "Email copied"
                : copyFailed
                  ? "Select the email address to get in touch."
                  : ""}
            </span>
          </div>
        </section>
      </main>
      <footer className="cf-footer">
        <div className="cf-footer-top">
          <a href="/" className="cf-footer-parent">
            Part of Grenwall <ArrowUpRight />
          </a>
          <a href="#top">
            Back to top <ArrowUpRight />
          </a>
        </div>
        <a
          className="cf-footer-wordmark"
          href="#top"
          aria-label="Craftflow, back to top"
        >
          craftflow
          <CraftflowMark />
        </a>
        <div className="cf-footer-bottom">
          <span>© {new Date().getFullYear()} Craftflow by Grenwall</span>
          <span>Independent minds. Shared ambition.</span>
          <a href="/">
            Explore Grenwall <ArrowUpRight />
          </a>
        </div>
      </footer>
      <dialog
        className="cf-project-dialog"
        ref={dialogRef}
        aria-labelledby="cf-project-title"
        onCancel={() => setActiveProject(null)}
        onClose={() => setActiveProject(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveProject(null);
        }}
      >
        {project && (
          <div className="cf-project-detail">
            <div className="cf-dialog-bar">
              <span>Craftflow / Studio exploration</span>
              <button
                autoFocus
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label="Close project"
              >
                Close <X />
              </button>
            </div>
            <CraftflowArtwork
              index={activeProject!}
              instance="dialog"
              compact={compact}
            />
            <div className="cf-dialog-copy">
              <div>
                <span>{project.scope}</span>
                <h2 id="cf-project-title">{project.name}</h2>
                <p className="cf-dialog-idea">{project.idea}</p>
              </div>
              <div>
                <p>{project.description}</p>
                <ul>
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <small>
                  A self-initiated studio concept, not a client case study.
                </small>
                <a
                  className="cf-text-link"
                  href="#contact"
                  onClick={() => setActiveProject(null)}
                >
                  Let's create your brand's world <ArrowUpRight />
                </a>
              </div>
            </div>
            <div className="cf-dialog-pagination">
              <button
                type="button"
                onClick={() => setActiveProject((activeProject! + 2) % 3)}
              >
                <ChevronLeft /> Previous concept
              </button>
              <button
                type="button"
                onClick={() => setActiveProject((activeProject! + 1) % 3)}
              >
                Next concept <ChevronRight />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
