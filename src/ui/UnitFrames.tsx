import type { PlaySnapshot, UnitTarget } from "../play/input";
import { PLAYER_SLOTS, WEAPON_SKILLS, type WeaponSkillId } from "../play/weaponSkill";

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

function UnitFrame({
  side,
  name,
  sub,
  letter,
  hp,
  resource,
  poise,
  slots,
  active,
  empty,
  onSlot,
}: {
  side: "player" | "target";
  name: string;
  sub: string;
  letter: string;
  hp: number;
  resource: number;
  poise: number;
  slots: Array<{ key: string; glyph: string; label: string; skill?: string }>;
  active?: string;
  empty?: boolean;
  onSlot?: (skill: string) => void;
}) {
  return (
    <div className={`uf uf-${side} ${empty ? "is-empty" : ""}`} data-unit-frame={side}>
      <div className="uf-art" />
      <div className="uf-portrait" title={name}>
        <span>{letter}</span>
      </div>
      <div className="uf-badge">{side === "player" ? "WL" : "TG"}</div>
      <div className="uf-name">{name}</div>
      <div className="uf-sub">{sub}</div>
      <div className="uf-bar uf-poise" title="Poise / stamina">
        <i style={{ width: `${clampPct(poise)}%` }} />
        <em>{Math.round(poise)}</em>
      </div>
      <div className={`uf-bar uf-hp ${side === "target" ? "is-target" : ""}`} title="Health">
        <i style={{ width: `${clampPct(hp)}%` }} />
        <em>{Math.round(hp)}</em>
      </div>
      <div className="uf-bar uf-mp" title={side === "player" ? "Mana" : "Resource"}>
        <i style={{ width: `${clampPct(resource)}%` }} />
        <em>{Math.round(resource)}</em>
      </div>
      <div className="uf-slots">
        {slots.map((s) => (
          <button
            key={s.key + s.label}
            type="button"
            className={`uf-slot ${active === s.label || active === s.skill ? "is-on" : ""}`}
            title={`${s.label} — ${s.key}`}
            onClick={() => s.skill && onSlot?.(s.skill)}
          >
            <b>{s.glyph}</b>
            <small>{s.key}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

const TARGET_SLOTS = [
  { key: "1", glyph: "·", label: "Mark" },
  { key: "2", glyph: "·", label: "Dot" },
  { key: "3", glyph: "·", label: "Slow" },
  { key: "4", glyph: "·", label: "Bleed" },
  { key: "5", glyph: "·", label: "Fear" },
];

export function UnitFrames({
  snap,
  onSlot,
}: {
  snap: PlaySnapshot;
  onSlot: (skill: string) => void;
}) {
  const letter = (snap.kit || "Warlord").slice(0, 2).toUpperCase();
  const t: UnitTarget = snap.target;
  const tLetter = t ? t.name.slice(0, 2).toUpperCase() : "—";
  const tHp = t && t.maxHp > 0 ? (t.hp / t.maxHp) * 100 : 0;

  return (
    <div className="uf-pair" data-tight-hud>
      <UnitFrame
        side="player"
        name={snap.kit || "Warlord"}
        sub={`${snap.clip}${snap.grounded ? "" : " · air"}`}
        letter={letter}
        hp={snap.hp}
        resource={snap.mana}
        poise={snap.stamina}
        slots={PLAYER_SLOTS}
        active={snap.skill}
        onSlot={onSlot}
      />
      <UnitFrame
        side="target"
        name={t ? t.name : "No target"}
        sub={t ? `${t.kind}${t.hostile ? " · hostile" : ""}` : "walk near a node"}
        letter={tLetter}
        hp={tHp}
        resource={t ? Math.min(100, t.hp) : 0}
        poise={tHp}
        slots={TARGET_SLOTS}
        empty={!t}
      />
    </div>
  );
}

export function fireUnitSlot(skill: string) {
  return WEAPON_SKILLS[skill as WeaponSkillId];
}
