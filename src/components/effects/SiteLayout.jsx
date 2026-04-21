import CanvasWavesBackground from "./CanvasWavesBackground";
import SiteFooter from "./SiteFooter";
import SiteNav from "../SiteNav";
import { useEffect } from "react";

export default function SiteLayout({
  theme,
  currentUser,
  go,
  onLogout,
  accountItems,
  children,
}) {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!elements.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [theme, children]);

  return (
    <div className={`app-shell theme-${theme}`}>
      <CanvasWavesBackground theme={theme} />
      <SiteNav
        currentUser={currentUser}
        go={go}
        onLogout={onLogout}
        accountItems={accountItems}
      />
      <main className="page-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
