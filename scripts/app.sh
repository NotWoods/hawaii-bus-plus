npx pnpm recursive install --frozen-lockfile --store=node_modules/.pnpm-store || echo skiping pnpm install
npx pnpm run build || exit 1
npx pnpm run build --filter @hawaii-bus-plus/identity-email || exit 1
