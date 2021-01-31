sed -i "s|{IPSTACK_KEY}|${IPSTACK_KEY}|g" netlify.toml
npx pnpm install -r --store=node_modules/.pnpm-store || echo skiping pnpm install
pnpm run build --filter @hawaii-bus-plus/client
pnpm run build --filter @hawaii-bus-plus/functions
