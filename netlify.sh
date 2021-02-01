sed -i "s|{IPSTACK_KEY}|${IPSTACK_KEY}|g" netlify.toml
npx pnpm install -r --frozen-lockfile --store=node_modules/.pnpm-store || echo skiping pnpm install
npm i -g typescript
npx pnpm run build --filter @hawaii-bus-plus/client
npx pnpm run build --filter @hawaii-bus-plus/functions
npx pnpm run api:dist --filter @hawaii-bus-plus/api-gen
