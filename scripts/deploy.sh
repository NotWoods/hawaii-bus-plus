git checkout stable && git merge main
pnpm run api # Ubuntu doesn't like to unzip, do it before deploying
git push && git checkout main
