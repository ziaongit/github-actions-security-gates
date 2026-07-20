# github-actions-security-gates

Sample Node.js Express API demonstrating 4 automated security gates in GitHub Actions.

Built for the DevOps.com article: **Shift Left Security: 4 Automated Security Gates in GitHub Actions**

## The 4 Gates

| Gate | Tool | What It Finds | Fails Build? |
|------|------|---------------|-------------|
| 1 | npm audit + Snyk | CVEs in npm packages | Yes (HIGH/CRITICAL) |
| 2 | Trivy | CVEs in Docker base image | Yes (HIGH/CRITICAL) |
| 3 | CodeQL | SQL injection, XSS, hardcoded secrets | Yes (HIGH) |
| 4 | OWASP ZAP | Runtime vulnerabilities in running app | Warn only |

## Project Structure

```
├── .github/
│   └── workflows/
│       └── security-gates.yml    # Combined 4-gate pipeline
├── src/
│   └── app.js                    # Express API (ZAP scan target)
├── .snyk                         # Snyk CVE suppressions
├── .trivyignore                  # Trivy CVE suppressions
├── .zap/
│   └── rules.tsv                 # ZAP false positive suppressions
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Running Locally

```bash
git clone https://github.com/ziaongit/github-actions-security-gates
cd github-actions-security-gates
cp .env.example .env
npm install
npm start
```

App runs on http://localhost:3000

## Running Security Scans Locally

**Gate 1 — Dependency scan:**
```bash
npm audit --audit-level=high
```

**Gate 2 — Image scan (via Docker, no Trivy install needed):**
```bash
docker build -t myapp:local .
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL myapp:local
```

**Gate 4 — ZAP baseline scan:**
```bash
# Stop any running app first (npm start must not be running on port 3000)
docker compose up -d
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000
docker compose down
```

## GitHub Secrets Required

| Secret | Where to get it |
|--------|----------------|
| `SNYK_TOKEN` | snyk.io → Account Settings → Auth Token |

## Author

Zia Ullah — [github.com/ziaongit](https://github.com/ziaongit)
