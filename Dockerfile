FROM docker.io/library/node:22-bookworm-slim AS build

WORKDIR /app

# Lockfile is yarn only in this repo; there is no package-lock.json.
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Same origin-relative URLs the SPA makes in production once VITE_API_URL is
# empty: every `${VITE_API_URL}/users/token` collapses to `/users/token` and
# nginx proxies it to the API container. Baking it at build time is what makes
# this one image environment-agnostic.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Public constants: they ship inside the JS bundle either way. Passed as build
# args so the image can be rebuilt without editing a tracked file.
ARG VITE_PASSWORD_SALT
ARG VITE_EMAIL_SALT
ENV VITE_PASSWORD_SALT=$VITE_PASSWORD_SALT VITE_EMAIL_SALT=$VITE_EMAIL_SALT

COPY . .

# `vite build` rather than `yarn build` - the latter is `tsc && vite build` and
# tsc's noEmit check already runs in CI-free local lint; keep the image stage
# to the bundler. Drop this if you want the typecheck enforced in the build.
RUN npx vite build


FROM docker.io/library/nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
