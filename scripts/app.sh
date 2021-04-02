sed -i "s|{IPSTACK_KEY}|${IPSTACK_KEY}|g" netlify.toml
npx pnpm recursive install --frozen-lockfile --store=node_modules/.pnpm-store || echo skiping pnpm install
npx pnpm run build --filter @hawaii-bus-plus/client || exit 1
npx pnpm run api:dist --filter @hawaii-bus-plus/api-gen || exit 1
npx pnpm run build --filter @hawaii-bus-plus/prerender || exit 1
npx pnpm run build --filter @hawaii-bus-plus/functions || exit 1
npx pnpm run build --filter @hawaii-bus-plus/identity-email || exit 1
