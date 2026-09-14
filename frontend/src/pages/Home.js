import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutMe from "../components/AboutMe";
import Skills from "../components/Skills";
import Certifications from "../components/Certifications";
import GitHubRepos from "../components/GitHubRepos";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import api from "../api";

export default function Home() {
  const [content, setContent] = useState({ badges: [], hardSkills: [], softSkills: [] });
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    api.get("/content").then((r) => setContent(r.data)).catch(() => {});
    api.get("/projects").then((r) => setProjects(r.data)).catch(() => {});
    api.get("/certifications").then((r) => setCertifications(r.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero content={content} />
        <AboutMe content={content} />
        <Skills content={content} />
        <Certifications certifications={certifications} />
        <GitHubRepos />
        <Projects projects={projects} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
