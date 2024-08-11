node --version
pnpm recursive install --prod=false --frozen-lockfile --store=node_modules/.pnpm-store || echo skiping pnpm install
pnpm run build || exit 1
