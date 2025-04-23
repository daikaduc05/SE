generate migration : npx ts-node --transpile-only ./node_modules/typeorm/cli.js migration:generate src/migrations/{{file_migration}} -d ./data-source.ts

run migration : npx ts-node --transpile-only ./node_modules/typeorm/cli.js migration:run -d ./data-source.ts

docker build: docker build -t planify-app .
