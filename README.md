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
├── App.js                  Opens the database, then shows the tab navigator
├── app.json                Expo configuration
├── index.js                Registers the root component
├── assets/                 App icons (referenced from app.json)
├── src/
│   ├── navigation/         AppNavigator: the three tabs
│   ├── screens/            TransactionsScreen, CategoriesScreen, AddExpenseScreen
│   ├── components/         TabBar, Banner, EmptyState, list rows
│   ├── controllers/        Validate input, call models, translate errors
│   ├── services/           App-level operations that span models
│   ├── models/             SQLite queries, one file per table
│   ├── database/           Connection, schema, migrations, seeding
│   ├── hooks/              Data-loading hooks wrapping the controllers
│   ├── context/            Global app state providers (not used yet)
│   ├── utils/              Validators and formatting helpers
│   ├── constants/          Theme colours, category colours/icons, payment methods
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
- **`src/controllers/`** — The entry point for the rest of the app. They validate
  input with `utils/validators.js`, call a model (or a service) and turn database
  constraint errors into readable messages.
- **`src/services/`** — Application-level operations that need more than one model,
  such as the first-run setup that creates the profile and its default categories.
- **`src/models/`** — One file per table. All SQL lives here, parameterised, with no
  validation and no UI logic.
- **`src/database/`** — Connection handling, schema, migrations and seeding only.
  Screens never write SQL directly.
- **`src/hooks/`** — Custom hooks that wrap database/service calls so screens stay
  declarative.
- **`src/context/`** — React context providers for global state (e.g. transactions,
  categories).
- **`src/utils/`** — `validators.js` (shared input checks) and pure helpers with no
  React or app state dependency.
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
└── seed.js        Default categories, inserted once per user

src/models/
├── categoryModel.js   Category queries
├── expenseModel.js    Transaction (expense row) queries
├── userModel.js       Local profile queries
└── settingModel.js    Key/value setting queries

src/controllers/
├── categoryController.js
├── expenseController.js
├── userController.js
└── settingController.js

src/services/
└── databaseService.js
```

Call `databaseService.initialize()` once when the app starts: it opens the
database, applies migrations and makes sure the local profile and its default
categories exist. `getDatabase()` returns the open handle and throws if the
database has not been initialised yet.

### Seeding

`databaseService.getOrCreateDefaultUser()` creates the profile through `userModel`
and then calls `seedDefaultCategories(userId)`, which inserts the six default
categories from `seed.js` only while that user's category list is empty.
Categories the user created or edited are never touched, so seeding is safe to
run on every launch. No transactions, expenses or other financial records are
seeded.

### How a call flows

```
UI / hook → controller → model → SQLite
                 ↘ service (operations that span models) ↗
```

- **Controller** — validates and trims input with `utils/validators.js`, calls one
  model function, and converts SQLite constraint errors into readable messages
  (`UNIQUE` → duplicate name, `FOREIGN KEY` → category in use / not found). It
  returns the row, the rows, or nothing for a delete.
- **Model** — runs one parameterised query and returns the database result. It
  throws `<Entity> not found.` when an update or delete matches no row.
- **Service** — `databaseService` owns first-run setup: `initialize()` opens the
  database and calls `getOrCreateDefaultUser()`, which creates the profile
  (`userModel`) and seeds its default categories (`database/seed.js`).

Operations:

- Categories: list, get by id, create, update (partial), delete. Deleting a
  category that still has transactions is refused by the foreign key.
- Transactions: list, get by id, create, update (partial), delete. A row is an
  `expense`; its `type` is `EXPENSE` or `INCOME`.
- Profile: `getOrCreateDefaultUser`, get by id, update (partial).
- Settings: get one, get all, set (upsert), delete.

### App screens

Three tabs switched by `src/navigation/AppNavigator.js` — a small state-based tab
bar, so no navigation dependency was added. Only the active screen stays
mounted, so it reads fresh rows from SQLite every time it is opened.

- **Transactions** (`screens/TransactionsScreen.js`) — every transaction, newest
  first: title, amount, category colour and name, date, and a green `+` for
  income or a `-` for spending. Empty state when there is nothing yet.
- **Categories** (`screens/CategoriesScreen.js`) — the add form (name, colour
  swatches, icon chips) above the list. Delete asks for confirmation; a category
  used by a transaction is refused by the foreign key and the message is shown.
- **Add Expense** (`screens/AddExpenseScreen.js`) — title, amount, category
  chips, payment method chips, date (prefilled with today) and optional notes.
  Saving goes through `expenseController`; on success the form clears and a
  success banner appears.

Styling is the Ledger dark theme from `src/constants/theme.js`. Screens reach the
database through the hooks in `src/hooks/`, and no screen imports a model.

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

MVP with three working features: add an expense, browse transactions, and manage
categories. The dark UI uses the reference palette, data comes from SQLite
through controllers and models, and navigation is a three-tab bar. No analytics,
budgets, filtering or authentication yet.
