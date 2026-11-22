# Ledger Mobile

Mobile app for **Ledger**, the expense tracker. Built with React Native and Expo.

JavaScript only — no TypeScript.

## Requirements

- Node.js
- Expo Go installed on an Android device (or an Android emulator)

## Getting started

```bash
npm install
npm start
```

Then press `a` to open the Android app, or scan the QR code with Expo Go.

## Scripts

| Command          | What it does                  |
| ---------------- | ----------------------------- |
| `npm start`      | Start the Expo dev server     |
| `npm run android`| Start the dev server for Android |
| `npm run ios`    | Start the dev server for iOS  |
| `npm run web`    | Start the dev server for web  |

## Project structure

```
ledger-mobile/
├── App.js                  App entry component (registered in index.js)
├── app.json                Expo configuration
├── index.js                Registers the root component
├── assets/                 Expo app assets (icon, splash, favicon)
├── src/
│   ├── screens/            Screen components (one folder per screen later)
│   ├── components/         Reusable UI pieces shared across screens
│   ├── navigation/         Navigation container and route definitions
│   ├── services/           Business logic and API/data operations
│   ├── database/           Local database setup and queries
│   ├── hooks/              Reusable custom React hooks
│   ├── context/            Global app state providers
│   ├── utils/              Pure helper functions
│   ├── constants/          Shared constants (labels, colors, keys)
│   └── assets/             Images and icons imported by the JS code
└── 01_reference/           Desktop project reference (not part of the app)
```

### Directory responsibilities

- **`src/screens/`** — Top-level screens, one component per screen. Screens read data
  from hooks/context and render components.
- **`src/components/`** — Reusable presentational pieces (buttons, rows, cards) that do
  not know about app state.
- **`src/navigation/`** — The navigator and its route names. The only place that knows
  which screen is which.
- **`src/services/`** — Business logic: formatting amounts, filtering/sorting
  transactions, and later any API calls.
- **`src/database/`** — Local database configuration and all queries. Screens never
  write SQL directly.
- **`src/hooks/`** — Custom hooks that wrap database/service calls so screens stay
  declarative.
- **`src/context/`** — React context providers for global state (e.g. transactions,
  categories).
- **`src/utils/`** — Pure helpers with no React or app state dependency.
- **`src/constants/`** — Shared constants so labels, colors and keys live in one place.
- **`src/assets/`** — Images/icons bundled with the JS. Expo's own icon and splash
  files stay in the root `assets/` folder because `app.json` points at them.

## Database

Local SQLite via `expo-sqlite`. The database file is `ledger.db` in the app's
document directory, so it survives app restarts and reinstalls.

```
src/database/
├── db.js          Opens the database, turns on foreign keys, runs migrations
├── schema.js      Schema version + the CREATE TABLE / CREATE INDEX statements
├── migrations.js  Applies the schema and records PRAGMA user_version
├── seed.js        Default categories, inserted once per user
└── queries.js     Query functions (user, category, expense, settings)
```

Call `initDatabase()` once when the app starts, then use the query functions in
`queries.js`. `getDatabase()` returns the open handle and throws if the database
has not been initialised yet.

### Seeding

`getOrCreateDefaultUser()` calls `seedDefaultCategories(userId)`, which inserts the
six default categories from `seed.js` only while that user's category list is
empty. Categories the user created or edited are never touched, so seeding is
safe to run on every launch. No transactions, expenses or other financial
records are seeded.

### Tables

| Table | Columns | Notes |
| ----- | ------- | ----- |
| `user` | `id, name, email, image, currency, theme, created_at, updated_at` | one local profile row |
| `category` | `id, user_id, name, color, icon, created_at, updated_at` | `UNIQUE(user_id, name)` |
| `expense` | `id, user_id, category_id, title, amount, type, payment_method, expense_date, notes, created_at, updated_at` | indexed on `(user_id, expense_date)` and `(user_id, category_id)` |
| `app_setting` | `user_id, key, value` | primary key `(user_id, key)` |

Foreign keys: deleting a user cascades to their categories, expenses and
settings; deleting a category that still has expenses is refused (`RESTRICT`).

### Differences from the original (Prisma / PostgreSQL) schema

- Table and column names are lower-case (`User` → `user`, `userId` → `user_id`),
  and Prisma's `date` field is stored as `expense_date`.
- Timestamps are ISO-8601 `TEXT`, because SQLite has no datetime type.
- `paymentMethod` is `TEXT` with a default of `CREDIT_CARD` instead of a
  PostgreSQL enum.
- The auth models (`Account`, `Session`, `VerificationToken`) are omitted: the
  mobile app is single-user and has no login.
- `expense.type` (`EXPENSE` / `INCOME`) is included; the Prisma schema does not
  have it, but the app's data model and the desktop schema both use it.
- `app_setting` is included for preferences, matching the desktop app.
- Ids are generated locally (`src/utils/generate-id.js`) instead of `cuid()`.

## Current stage

Foundation plus the database layer. The Expo project is initialized, the folder
structure is in place, and SQLite is configured with schema, migrations, query
functions and one-time default category seeding. No screens, navigation, or
expense-tracker UI has been added yet.
