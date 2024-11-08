FROM node:22-alpine AS base

# -------------------------------------------------------------------------------------------
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# NEW enable yarn 4.0.2 version and copy yarnrc.yml
RUN corepack enable
COPY .yarn ./.yarn

# Install dependencies based on the preferred package manager (NEW copy yarnrc.yml to the image)
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn config set nodeLinker node-modules
RUN yarn --immutable

# -------------------------------------------------------------------------------------------
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn config set nodeLinker node-modules

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ENV BUILD_STANDALONE=1
RUN yarn run build

# -------------------------------------------------------------------------------------------
# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
# Set the correct permission for prerender cache
RUN chown -R nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/assets ./assets

USER nextjs

EXPOSE 3003

ENV PORT=3003

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node","server.js"]
