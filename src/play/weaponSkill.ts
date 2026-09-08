export type WeaponSkillId = "AttackLight01" | "AttackHeavy01" | "SkillQ" | "SkillE";

export const WEAPON_SKILLS: Record<
  WeaponSkillId,
  { key: string; label: string; glyph: string; mana: number; blend: number; lock: boolean; read: string }
> = {
  AttackLight01: {
    key: "LMB",
    label: "Light slash",
    glyph: "⚔",
    mana: 0,
    blend: 0.08,
    lock: true,
    read: "plant → coil → commit → hold contact → recover",
  },
  AttackHeavy01: {
    key: "RMB",
    label: "Heavy",
    glyph: "🪓",
    mana: 8,
    blend: 0.08,
    lock: true,
    read: "plant → load hips → commit arc → recover",
  },
  SkillQ: {
    key: "Q",
    label: "War cry",
    glyph: "Q",
    mana: 18,
    blend: 0.1,
    lock: true,
    read: "brace → roar → recover to idle",
  },
  SkillE: {
    key: "E",
    label: "Lunge",
    glyph: "E",
    mana: 12,
    blend: 0.08,
    lock: true,
    read: "coil → lunge contact → recover",
  },
};

export const TIGHT_SLOTS = [
  { code: "Digit1", skill: "AttackLight01" as WeaponSkillId },
  { code: "Digit2", skill: "AttackHeavy01" as WeaponSkillId },
  { code: "KeyQ", skill: "SkillQ" as WeaponSkillId },
  { code: "KeyE", skill: "SkillE" as WeaponSkillId },
];

export const PLAYER_SLOTS: Array<{ key: string; glyph: string; label: string; skill?: WeaponSkillId | "Harvest" }> = [
  { key: "LMB", glyph: "⚔", label: "Light", skill: "AttackLight01" },
  { key: "RMB", glyph: "🪓", label: "Heavy", skill: "AttackHeavy01" },
  { key: "Q", glyph: "Q", label: "Cry", skill: "SkillQ" },
  { key: "E", glyph: "E", label: "Lunge", skill: "SkillE" },
  { key: "2", glyph: "⛏", label: "Harvest", skill: "Harvest" },
];
