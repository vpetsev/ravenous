# Run locally

Requires Node 22 or newer. Install and build the frontend with `npm ci --legacy-peer-deps` and `NODE_OPTIONS=--openssl-legacy-provider npm run build`. Start `npm run server` after exporting YELP_API_KEY. Open http://127.0.0.1:3001. The same process serves the built app and its API. For development, keep `npm run server` running and run `npm start` in a second terminal; CRA forwards /api calls to port 3001.

Validation: `npm run test:server` and `CI=true npm test -- --watchAll=false --runInBand`.

Set the server environment variable in your shell, for example `export YELP_API_KEY="your-new-key"`. The .env.example file is documentation; the server does not auto-load .env files. Do not put this key in a REACT_APP_ variable or browser code.

Previously committed credentials remain in Git history and must be revoked or rotated in the provider account. Removing them from current source does not revoke them. Real provider credentials were not exercised in regression tests. The server binds to 127.0.0.1 for local use; add authentication and operational limits before any public deployment.
