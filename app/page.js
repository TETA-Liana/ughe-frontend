"use client";
// Homepage: only visible after login. Loads all content from Django (/api/homepage/).
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HeroSlideshow from "@/components/HeroSlideshow";
import FactsStats from "@/components/FactsStats";
import { UnauthorizedError, clearSession, fetchHomepage, getToken, getUsername, logout } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const load = () => {
    setError("");
    fetchHomepage()
      .then(setData)
      .catch((err) => {
        if (err instanceof UnauthorizedError) {
          clearSession();
          router.replace("/login");
        } else {
          setError(`Could not load the page content: ${err.message}`);
        }
      });
  };

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUsername(getUsername());
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (error) {
    return (
      <div className="page-message">
        <p>{error}</p>
        <button onClick={load}>Try again</button>
      </div>
    );
  }
  if (!data) return <div className="page-message">Loading…</div>;

  return (
    <main>
      <div className="container session-bar">
        <span>Signed in as {username}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
      <Header settings={data.settings} topButtons={data.top_buttons} navItems={data.nav_items} />
      <HeroSlideshow slides={data.slides} />
      <FactsStats heading={data.settings.stats_heading} stats={data.stats} />
    </main>
  );
}
