FROM node:20-alpine3.19 AS base

RUN corepack enable

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# NEW enable yarn 4.0.2 version and copy yarnrc.yml
COPY .yarn ./.yarn

# Install dependencies based on the preferred package manager (NEW copy yarnrc.yml to the image)
COPY package.json yarn.lock* .yarnrc.yml ./
RUN yarn --immutable


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.yarn ./.yarn
COPY --from=deps /app/.pnp.cjs ./pnp.cjs
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN yarn run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/assets ./assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder /app/.pnp.cjs ./.pnp.cjs
COPY --from=builder /app/package.json ./package.json

# Note yarn rebuild again - this is to let yarn rebuild binaries in the "runner" stage of the Dockerfile
# We also have to remove unplugged, so that rebuilding happens and replaces the old binaries
RUN rm -rf /app/.yarn/unplugged && yarn rebuild

# Set the correct permission for prerender cache
RUN chown -R nextjs:nodejs /app/.next
RUN chown -R nextjs:nodejs /app/.yarn

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3003

ENV PORT=3003

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["yarn", "start"]
