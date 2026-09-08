export type PlayInput = {
  f: boolean;
  b: boolean;
  l: boolean;
  r: boolean;
  sprint: boolean;
  jump: boolean;
  attack: boolean;
  heavy: boolean;
  skillQ: boolean;
  skillE: boolean;
  lookDx: number;
  lookDy: number;
  lock: boolean;
};

export const input0 = (): PlayInput => ({
  f: false,
  b: false,
  l: false,
  r: false,
  sprint: false,
  jump: false,
  attack: false,
  heavy: false,
  skillQ: false,
  skillE: false,
  lookDx: 0,
  lookDy: 0,
  lock: false,
});

export type UnitTarget = {
  id: string;
  name: string;
  kind: string;
  hp: number;
  maxHp: number;
  hostile: boolean;
} | null;

export type PlaySnapshot = {
  grounded: boolean;
  speed: number;
  clip: string;
  hp: number;
  mana: number;
  stamina: number;
  skill: string;
  kit: string;
  target: UnitTarget;
};
