/**
 * Fundo do Hero — réplica fiel da referência:
 * grade sutil, circuitos nos cantos, HUD, névoa atrás do nome.
 */

const stroke = (opacity = 0.42) => `rgba(16, 185, 129, ${opacity})`;
const strokeCyan = (opacity = 0.28) => `rgba(6, 182, 212, ${opacity})`;
const nodeFill = "rgba(16, 185, 129, 0.55)";
const nodeGlow = "rgba(16, 185, 129, 0.25)";

function Node({ cx, cy, r = 3 }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r + 3} fill={nodeGlow} />
      <circle cx={cx} cy={cy} r={r} fill={nodeFill} />
    </>
  );
}

/** Circuito canto superior esquerdo — igual referência */
function CircuitTopLeft() {
  return (
    <svg className="hero-circuit hero-circuit-tl" viewBox="0 0 360 220" fill="none" aria-hidden>
      <path d="M0 72 H96" stroke={stroke(0.5)} strokeWidth="1" />
      <path d="M96 72 V128" stroke={stroke(0.5)} strokeWidth="1" />
      <path d="M96 128 H192" stroke={strokeCyan(0.45)} strokeWidth="1" />
      <path d="M192 128 V168" stroke={strokeCyan(0.4)} strokeWidth="1" />
      <path d="M32 72 V108" stroke={stroke(0.35)} strokeWidth="1" />
      <path d="M32 108 H68" stroke={stroke(0.35)} strokeWidth="1" />
      <Node cx={0} cy={72} r={2.5} />
      <Node cx={96} cy={72} />
      <Node cx={96} cy={128} />
      <Node cx={192} cy={128} />
      <Node cx={192} cy={168} r={2.5} />
      <Node cx={32} cy={108} r={2} />
    </svg>
  );
}

/** Circuito canto inferior direito — zigue-zague da referência */
function CircuitBottomRight() {
  return (
    <svg className="hero-circuit hero-circuit-br" viewBox="0 0 340 260" fill="none" aria-hidden>
      <path d="M24 236 H108" stroke={stroke(0.5)} strokeWidth="1" />
      <path d="M108 236 V188" stroke={stroke(0.5)} strokeWidth="1" />
      <path d="M108 188 H188" stroke={strokeCyan(0.45)} strokeWidth="1" />
      <path d="M188 188 V132" stroke={strokeCyan(0.42)} strokeWidth="1" />
      <path d="M188 132 H268" stroke={stroke(0.48)} strokeWidth="1" />
      <path d="M268 132 V72" stroke={stroke(0.45)} strokeWidth="1" />
      <path d="M268 72 H316" stroke={stroke(0.4)} strokeWidth="1" />
      <path d="M60 236 V204" stroke={stroke(0.3)} strokeWidth="1" />
      <path d="M60 204 H96" stroke={stroke(0.3)} strokeWidth="1" />
      <Node cx={24} cy={236} r={2.5} />
      <Node cx={108} cy={236} />
      <Node cx={108} cy={188} />
      <Node cx={188} cy={188} />
      <Node cx={188} cy={132} />
      <Node cx={268} cy={132} />
      <Node cx={268} cy={72} />
      <Node cx={316} cy={72} r={2.5} />
      <Node cx={60} cy={204} r={2} />
    </svg>
  );
}

export default function HeroBackground() {
  return (
    <div className="hero-bg absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <div className="hero-grid absolute inset-0" />
      <div className="hero-particles absolute inset-0" />
      <div className="hero-name-glow absolute" />
      <div className="hero-vignette absolute inset-0" />

      <CircuitTopLeft />
      <CircuitBottomRight />
    </div>
  );
}
