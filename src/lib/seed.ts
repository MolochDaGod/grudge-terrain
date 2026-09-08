export function hashSeed(input: string | number): number {
  const s = String(input);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export class SeededRandom {
  private s: number;
  constructor(seed: number | string) {
    this.s = (hashSeed(seed) % 2147483646) + 1;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
}

export class SimplexNoise2D {
  private perm: Uint8Array;
  constructor(seed = 42) {
    this.perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    let s = seed >>> 0 || 1;
    for (let i = 255; i > 0; i--) {
      s = (Math.imul(s, 16807) + 0) % 2147483647;
      const j = s % (i + 1);
      const t = p[i]; p[i] = p[j]; p[j] = t;
    }
    for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
  }
  noise(x: number, y: number): number {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    const t = (i + j) * G2;
    const X0 = i - t, Y0 = j - t;
    const x0 = x - X0, y0 = y - Y0;
    const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
    const ii = i & 255, jj = j & 255;
    const g0 = this.grad(this.perm[ii + this.perm[jj]], x0, y0);
    const g1 = this.grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1);
    const g2 = this.grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2);
    let n0 = 0.5 - x0 * x0 - y0 * y0; n0 = n0 < 0 ? 0 : n0 * n0 * n0 * n0 * g0;
    let n1 = 0.5 - x1 * x1 - y1 * y1; n1 = n1 < 0 ? 0 : n1 * n1 * n1 * n1 * g1;
    let n2 = 0.5 - x2 * x2 - y2 * y2; n2 = n2 < 0 ? 0 : n2 * n2 * n2 * n2 * g2;
    return 70 * (n0 + n1 + n2);
  }
  fbm(x: number, y: number, octaves = 5, lacunarity = 2, gain = 0.5): number {
    let value = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      value += amp * this.noise(x * freq, y * freq);
      max += amp; amp *= gain; freq *= lacunarity;
    }
    return value / max;
  }
  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y, v = h < 4 ? y : x;
    return (h & 1 ? -u : u) + (h & 2 ? -2 * v : 2 * v);
  }
}
