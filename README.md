# Grudge Terrain

Canonical play + studio host for **island worlds**.

| Surface | URL |
|---|---|
| Production | https://terrain.grudge-studio.com |
| GitHub | https://github.com/MolochDaGod/grudge-terrain |
| Catalogs | https://info.grudge-studio.com/api/v1 |
| Binaries | https://assets.grudge-studio.com |

## Contract

- Map family: **home-island** (not Warlords 9-sector IDs, not home-block 3×3 cells)
- World diameter **1024 m**, character **2.0 m**, mountain peak **20 m**
- Browser play slice **256 m** with the same ratios
- Foundations: Driftwood Bay / Ironfang Spire
- Nature: organized + realistic CDN only — **no Quaternius megakit**
- Harvest regen **4 hours**
- Physics: **Rapier only**. Render: **Three r184 + R3F**

## Play

`?seed=driftwood-01&biome=beach&sector=haven_shore`

| Tool | Keys |
|---|---|
| Explore | WASD, Shift sprint, RMB lock |
| Harvest | `2` then `E` — wood, stone, ore, herbs, gems, fish, animals, dens |
| Shovel | `3` + LMB raise / lower / flatten |
| RTS | `4` + LMB place hall / tower / wall / camp |
| World map | click a sector tile to rebuild the island from that biome |

## Seed + foliage API

```
GET /api/world
GET /api/seed?seed=isle-7&biome=volcanic&sector=ember_depths
GET /api/sectors
GET /api/foliage
GET /api/nodes
GET /api/assets
POST /api/assets   { name, size, type }
```

Uploads are catalogued here. Publish meshes with Wrangler onto R2:

```
npx wrangler r2 object put grudge-assets/models/nature/organized/uploads/<file> --file=<local> --remote
```

## Stack

Vite · React 19 · Three 0.184 · @react-three/fiber · @react-three/rapier · Vercel · Cloudflare R2

DNS: CNAME `terrain.grudge-studio.com` → Vercel (`cname.vercel-dns.com`) on team **Nexus Server**.
