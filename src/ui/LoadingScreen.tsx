import type { LoadProgress } from "../lib/preload";

export function LoadingScreen({
  progress,
  kit,
  kind,
  seed,
}: {
  progress: LoadProgress;
  kit: string;
  kind: string;
  seed: string;
}) {
  return (
    <div className="boot">
      <div className="boot-card">
        <div className="boot-kicker">GRUDGE TERRAIN</div>
        <h1>Entering the island</h1>
        <p>
          {kit} · {kind} · seed {seed}
        </p>
        <div className="boot-bar">
          <i style={{ width: `${progress.pct}%` }} />
        </div>
        <div className="boot-meta">
          <span>{progress.pct}%</span>
          <span>{progress.label}</span>
        </div>
        <div className="boot-hint">Toon RTS bake · Super Terrain textures · Rapier CCT</div>
      </div>
    </div>
  );
}
