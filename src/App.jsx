import { useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import "./index.css";

const techTrivia = [
  "El primer sitio web aún está en línea: info.cern.ch",
  "El nombre original de JavaScript era Mocha",
  "Linux se usa en el 100% de las supercomputadoras top",
  "El correo electrónico existía antes que la web: 1971",
  "El primer virus informático fue creado en 1986"
];

function Card({ title, children, titleColor }) {
  return (
    <div className="rounded shadow-xl transition-all duration-300 transform p-4 hover:scale-105 hover:rotate-1 hover:shadow-2xl hover:glow-card card-glow bg-slate-800 dark:bg-slate-800">
      <h2 className={`text-xl font-semibold mb-2 transition-colors duration-300 ease-in-out ${titleColor}`}>{title}</h2>
      {children}
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [retroMode, setRetroMode] = useState(false);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [inputName, setInputName] = useState("");
  const [catGif, setCatGif] = useState("");
  const [showEaster, setShowEaster] = useState(false);
  const [counter, setCounter] = useState(0);
  const [toggleInfo, setToggleInfo] = useState(false);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [editingName, setEditingName] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("retro", retroMode);
  }, [theme, retroMode]);

  useEffect(() => {
    fetch("https://api.thecatapi.com/v1/images/search?mime_types=gif")
      .then((res) => res.json())
      .then((data) => setCatGif(data[0].url))
      .catch(() => setCatGif("https://cataas.com/cat/gif"));
  }, []);

  useEffect(() => {
    const soundHandler = () => {
      const clickAudio = new Audio("/portafolioweb/click.mp3");
      clickAudio.volume = 0.4;
      clickAudio.play();
    };
    document.addEventListener("click", soundHandler);
    return () => document.removeEventListener("click", soundHandler);
  }, []);

  useEffect(() => {
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    document.body.appendChild(trail);

    const moveTrail = (e) => {
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveTrail);
    return () => {
      window.removeEventListener("mousemove", moveTrail);
      trail.remove();
    };
  }, []);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const startPortfolio = () => {
    setName(inputName || "Usuario");
    const selectedMode = document.querySelector('input[name="modo"]:checked')?.value || "dark";
    setTheme(selectedMode);
    setShowModal(false);
  };

  const toggleRetro = () => {
    const synth = document.getElementById("synth-audio");
    if (!retroMode) {
      synth.currentTime = 0;
      synth.volume = 0.5;
      synth.play().catch((err) => {
        console.warn("No se pudo reproducir el audio:", err);
      });
    } else {
      synth.pause();
    }
    setRetroMode(!retroMode);
  };

  return (
    <div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-700 ease-in-out ${theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"}`}>
      {retroMode && (
        <div
          className="fixed top-0 left-0 w-full h-full z-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/portafolioweb/synthwave-bg.gif')" }}
        />
      )}

      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 -z-10 pointer-events-none"
        options={{
          fullScreen: { enable: false },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            number: { value: 100 },
            size: { value: 3 },
            move: { enable: true, speed: 0.5 },
            links: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
            shape: { type: "circle" },
            color: { value: "#ffffff" },
            opacity: { value: 0.5 },
          },
        }}
      />

      <audio id="synth-audio" loop src="/portafolioweb/synthwave.mp3" className="hidden" />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-gray-900 text-white p-6 rounded shadow-xl w-80">
            <h2 className="text-xl mb-4">¡Bienvenido!</h2>
            <label className="block mb-2">¿Cuál es tu nombre?</label>
            <input
              className="w-full p-2 mb-4 border rounded text-black"
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
            <label className="block mb-2">¿Modo oscuro o claro?</label>
            <div className="flex gap-4 mb-4">
              <label><input type="radio" name="modo" value="dark" defaultChecked /> Oscuro</label>
              <label><input type="radio" name="modo" value="light" /> Claro</label>
            </div>
            <button
              onClick={startPortfolio}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Empezar
            </button>
          </div>
        </div>
      )}

      {!showModal && (
        <>
          <header className="z-10 flex justify-between items-center w-full max-w-6xl mb-6 px-4">
            <h1 className="text-3xl font-mono animate-typing whitespace-nowrap overflow-hidden border-r-4 pr-2">
              Portafolio de Wilson
            </h1>
            <div className="flex items-center gap-4">
              {editingName ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  className="p-1 text-black rounded"
                  autoFocus
                />
              ) : (
                <span onClick={() => setEditingName(true)} className="cursor-pointer underline hover:text-yellow-400">
                  Bienvenido, {name} ✏️
                </span>
              )}
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="glow-button">
                {theme === "dark" ? "Claro" : "Oscuro"}
              </button>
              <button onClick={toggleRetro} className="glow-button">Retro Mode</button>
            </div>
          </header>

          <main className="z-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            <Card title="Proyecto: Calculadora" titleColor="hover:text-red-600">
              <iframe src="https://wicald.github.io/ProyectoCalcu/" title="Calculadora" className="w-full h-96 border rounded"></iframe>
            </Card>
            <Card title="HTML" titleColor="hover:text-green-500">
              <p>Lenguaje de marcado para estructura básica.</p>
              <a href="/demo.html" target="_blank" className="underline text-blue-300">Ver ejemplo</a>
            </Card>
            <Card title="CSS" titleColor="hover:text-blue-500">
              <p>Estilos visuales y presentación.</p>
              <a href="/CSS.html" target="_blank" className="underline text-blue-500">Ver archivo CSS</a>
            </Card>
            <Card title="JavaScript" titleColor="hover:text-yellow-400">
              <p>Interactividad con el DOM.</p>
              <img src={catGif} alt="Gato JS" className="rounded mt-2" />
            </Card>
            <Card title="API" titleColor="hover:text-purple-400">
              <p className="italic">{techTrivia[triviaIndex]}</p>
              <button onClick={() => setTriviaIndex((triviaIndex + 1) % techTrivia.length)} className="mt-2 glow-button">Otro dato</button>
            </Card>
            <Card title="React" titleColor="hover:text-pink-400">
              <p>Hooks y componentes funcionales.</p>
              <button onClick={() => setCounter(counter + 1)} className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded">Contador: {counter}</button>
              <button onClick={() => setToggleInfo(!toggleInfo)} className="mt-2 ml-2 bg-green-600 text-white px-2 py-1 rounded">{toggleInfo ? "Ocultar" : "Mostrar"} info</button>
              {toggleInfo && <p className="mt-2 text-sm">React permite crear interfaces reactivas fácilmente.</p>}
            </Card>
            <Card title="Contacto" titleColor="hover:text-cyan-400">
              <p>Correo: cal22018@uvg.edu.gt</p>
              <p>Discord: <strong>lune7997</strong></p>
              <form className="flex flex-col gap-2 mt-2" onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado!"); }}>
                <input placeholder="Correo" className="p-2 border rounded text-black" required />
                <textarea placeholder="Mensaje" rows="3" className="p-2 border rounded text-black" required></textarea>
                <button type="submit" className="glow-button">Enviar</button>
              </form>
            </Card>
          </main>

          <footer className="text-center text-xs text-gray-400 mt-10">
            <p className="italic">"El aprendizaje nunca se detiene, incluso al crear un portafolio."</p>
          </footer>

          <div className="fixed bottom-2 left-2 text-white text-xs cursor-pointer opacity-30 hover:opacity-100" onClick={() => setShowEaster(true)}>👾</div>
          {showEaster && (
            <div className="fixed inset-0 bg-black/80 text-white flex flex-col items-center justify-center text-2xl z-50" onClick={() => setShowEaster(false)}>
              <p className="animate-bounce">¡Has desbloqueado el huevo de pascua!</p>
              <img src="https://cataas.com/cat/says/Retro!" alt="Easter Cat" className="w-48 mt-4 rounded shadow-lg" />
            </div>
          )}
        </>
      )}
    </div>
  );
}
