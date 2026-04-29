# !/bin/bash

bun add hono @hono/zod-openapi @scalar/hono-api-reference @venizia/ignis@0.0.8-12 @venizia/ignis-helpers@0.0.8-8 drizzle-orm drizzle-zod pg

bun add -d typescript@5.9.3 @types/bun @types/pg @venizia/dev-configs@0.0.6 eslint prettier tsc-alias drizzle-kit 

mkdir -p src/{common,components,controllers/ping,datasources,helpers,models/{schemas,requests,responses},repositories,services,utilities}

touch src/index.ts src/application.ts src/migration.ts

cat <<EOF > .prettierignore
dist
node_modules
*.log
.*-audit.json
EOF

cat <<EOF > .prettierrc.mjs
import { prettierConfigs } from '@venizia/dev-configs';

export default { prettierConfigs, printWidth: 100, singleQuote: true };
EOF

cat <<EOF > eslint.config.mjs
import { eslintConfigs } from '@venizia/dev-configs';

export default eslintConfigs;
EOF

cat <<EOF > tsconfig.json
{
  "\$schema": "http://json.schemastore.org/tsconfig",
  "extends": "@venizia/dev-configs/tsconfig.common.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": "src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src", "./*.config.*", ".prettierrc.*"],
  "exclude": ["node_modules", "dist"]
}
EOF
