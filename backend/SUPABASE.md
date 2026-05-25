# Supabase Database Setup

This backend can connect to Supabase Postgres with the `supabase` Spring profile.

## 1. Get connection details

In Supabase:

- Open your project.
- Go to Project Settings -> Database.
- Copy the Postgres connection string.
- For deployed apps, prefer the transaction pooler connection string.

Use JDBC format:

```text
jdbc:postgresql://<host>:<port>/<database>?sslmode=require
```

## 2. Configure environment

Copy the example file:

```bash
cp .env.supabase.example .env.supabase
```

Fill:

```text
SUPABASE_DB_URL=jdbc:postgresql://<host>:<port>/<database>?sslmode=require
SUPABASE_DB_USERNAME=<username>
SUPABASE_DB_PASSWORD=<password>
SPRING_PROFILES_ACTIVE=supabase
```

Do not commit `.env.supabase`.

## 3. Run locally with Supabase

From `backend/`:

```bash
set -a
source .env.supabase
set +a
mvn spring-boot:run
```

## Notes

- The local default profile still uses `jdbc:postgresql://localhost:5433/scrapify`.
- The Supabase profile keeps the pool small for hosted Postgres.
- Keep `JPA_DDL_AUTO=update` for development; use migrations before production.
