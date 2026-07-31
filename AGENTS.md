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

## Zanim zaczniesz działać

Ten plik potrafi być nieaktualny. Na starcie sesji sprawdź stan faktyczny:
`git log --oneline -10`, `git status`, `ls apps`. Repozytorium ma
pierwszeństwo przed tym plikiem — jeśli się rozjeżdżają, powiedz o tym.

## Język

Kod, komentarze, commity, README i ADR — **po angielsku**. Ten plik oraz
rozmowa ze mną — po polsku.

## Skrypty z katalogu głównego

Preferuj `npm run dev:cms`, `dev:web`, `build:web`, `lint:web`, `test:web`
z korzenia zamiast wchodzenia do `apps/*`. To dwa niezależne projekty npm
bez narzędzia workspace — patrz `docs/adr/002-repository-layout-and-tooling.md`.

## Konwencje Strapi, o których trzeba pamiętać

- **Typy treści powstają w panelu.** Strapi zapisuje je do
  `src/api/<nazwa>/content-types/<nazwa>/schema.json` i generuje obok
  kontroler, trasę i serwis. Panel jest źródłem prawdy, pliki są
  artefaktem — ale commitujemy je normalnie. Nie edytuj schematów ręcznie
  bez wyraźnego powodu; jeśli to robisz, powiedz.
- **Dynamic Zone przyjmuje wyłącznie komponenty**, nie pola proste.
- **Relacje wewnątrz komponentów są jednokierunkowe** (oneWay / manyWay).
  Typ docelowy musi istnieć wcześniej.
- **Rich text to edytor Blocks** — zwraca ustrukturyzowany JSON (węzły
  `type` + `children`), nie markdown. Renderujemy mapą typ węzła →
  komponent React.
- Przy każdym scaffoldingu CLI w tym repo przekazuj `--no-git-init`
  lub odpowiednik. Zagnieżdżony `.git` psuje repozytorium.

## Ograniczenia przyjęte świadomie

Nie wprowadzaj bez pytania:

- Bez SDK do CMS-a. `apps/web/src/lib/strapi.ts` to cienki, typowany
  klient na `fetch`, żeby kształt odpowiedzi był widoczny w kodzie.
- Bez pnpm workspaces i bez Turborepo.
- Bez integracji płatniczej, bez implementacji i18n, bez Playwrighta.
- Nowa zależność tylko wtedy, gdy usuwa realną złożoność. Zanim ją
  dodasz, powiedz, ile kosztuje.

## Commity i decyzje

- Dłuższe commity zapisuj do pliku i używaj `git commit -F <plik>`.
  Wklejanie wielolinijkowego `-m` gubi w tym terminalu puste linie.
- Decyzje architektoniczne trafiają do `docs/adr/` wg `000-template.md`.
  Zapisuj też odrzucone alternatywy, nie tylko wybraną.
- Zanim uznasz coś za skończone: `npm run lint:web` i `npm run build:web`
  muszą przechodzić.
- **`populate` musi pokrywać typ.** Jeśli typ w `apps/web/src/types/cms.ts`
  deklaruje pole relacyjne, komponentowe lub media, zapytanie w
  `strapi.ts` musi je populate'ować. Brak populate objawia się jako
  `undefined` w miejscu, gdzie typ obiecuje tablicę.
