# AGENTS.md

Instrukcje dla narzędzi agentowych (Claude Code, Copilot, Codex) pracujących
w tym repozytorium. Jeśli czytasz to jako człowiek — zacznij od `README.md`.

## Czym jest ten projekt

ContentForge — demo architektury headless: Strapi 5 jako CMS, Next.js jako
warstwa prezentacji, komunikacja przez REST API. Projekt portfolio.

## Układ repozytorium

contentforge/
├── apps/cms/ Strapi 5.51 — model treści, API, panel administracyjny
├── apps/web/ Next.js 16 (App Router, TypeScript, Tailwind)
├── docker-compose.yml PostgreSQL 16
└── .env.example wzorzec zmiennych środowiskowych


## Uruchomienie lokalne

```bash
docker compose up -d db          # PostgreSQL na porcie 15432
cd apps/cms && npm run develop   # Strapi  → http://localhost:1337
cd apps/web && npm run dev       # Next.js → http://localhost:3000
```

## Konwencje

**Commity** — Conventional Commits z zakresem odpowiadającym aplikacji:
`feat(web):`, `feat(cms):`, `fix(web):`, `docs:`, `chore:`.
Commit opisuje zmianę, nie listę plików.

**Zmienne środowiskowe** — `.env` i `.env.local` nigdy nie trafiają do repo.
Każda nowa zmienna ląduje w `.env.example` z pustą lub przykładową wartością.

**TypeScript** — typy odpowiedzi API deklarowane jawnie po stronie `apps/web`.
Bez `any` na danych ze Strapi.

**Pobieranie danych** — Server Components z `next: { revalidate: N }` (ISR).
Przeniesienie fetchowania do komponentu klienckiego wymaga uzasadnienia.

## Pułapki tego stacku

**Strapi 5 ≠ Strapi 4.** Odpowiedzi API są spłaszczone: `data[].title`,
nie `data[].attributes.title`. Publicznym identyfikatorem jest `documentId`
(string), nie `id`. Większość tutoriali w sieci dotyczy wersji 4 — nie kopiuj
z nich kształtu odpowiedzi.

**Next.js 16 z Turbopackiem** jest domyślny. Poradniki dla 14/15 potrafią się
rozjeżdżać w konfiguracji buildu.

**Uprawnienia w Strapi.** Nowy typ treści jest domyślnie niedostępny publicznie:
Settings → Users & Permissions → Roles → Public → `find` / `findOne`.
Treść musi być opublikowana, nie zapisana jako wersja robocza.

## Czego nie robimy

- Nie dokładamy zależności "na wszelki wypadek" — każda ma uzasadnienie.
- Nie uruchamiamy `npm audit fix --force` (potrafi cofnąć Next.js o major).
- Nie używamy `sudo` do plików w tym katalogu.
