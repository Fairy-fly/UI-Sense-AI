# Agent Workflow Skills

Reusable development workflow for Claude Code / Codex based on the UI Sense AI project.

---

## 1. Core Principle

- **One phase at a time.** Each session does one clear thing: a feature, a bugfix, a polish pass, or documentation.
- **Never work directly on `main`.** Always create a feature branch.
- **Never let the Agent commit, push, or merge on its own.** Every Git action requires explicit human approval.
- **Implement → Verify → Human confirm → Commit.** No skipping steps.
- **Major versions stabilize features; minor versions polish showcase and docs.**
- **Don't blindly stack features.** Real usage feedback comes first.

---

## 2. Standard Feature Development Skill

1. Verify current branch is `main`, working tree is clean, tags are present.
2. Create feature branch: `git checkout -b vX.Y-feature-name`
3. Define clear scope and forbidden actions in the prompt.
4. Implement the feature (schema → actions → components → pages → builder).
5. Run automated verification:
   ```bash
   npx prisma validate
   npx prisma migrate status
   npm run build
   npx tsc --noEmit
   npm run lint
   ```
6. Run security check:
   ```bash
   git ls-files .env.local
   git ls-files prisma/dev.db
   git ls-files public/uploads
   ```
7. Output structured acceptance report with testable items.
8. Wait for human confirmation before touching git.
9. Once confirmed: commit with `Co-Authored-By: Claude <noreply@anthropic.com>`.
10. Push branch: `git push -u origin <branch>`
11. Merge into `main` with `--no-ff`.
12. Tag the merge commit.
13. Delete local and remote feature branch.
14. Update project memory files.

---

## 3. Documentation-Only Release Skill

Used for v2.0.1 / v2.0.2 / v2.0.3 / v2.0.4 style documentation releases.

- **Only touch:** `README.md`, `CLAUDE.md`, `docs/*.md`
- **Never touch:** `app/`, `components/`, `lib/`, `prisma/schema.prisma`, `prisma/migrations/`, `types/`
- Check Markdown table rendering (all tables must use `|...|` syntax with proper separator lines)
- Check GitHub README display (first-screen readability, version number, milestone table)
- Check repository About topics and root directory cleanliness
- Minor versions can polish GitHub showcase without any code changes

---

## 4. Git Safety Skill

- **Always confirm working directory:** `cd "D:\UI Sense AI"` before any git command.
- **Always check status before committing:** `git status`
- **Never use `git reset --hard`.**
- **Never use `rm -rf`.**
- **Never commit `.env.local`.**
- **Never commit `prisma/dev.db`.**
- **Never commit real user images in `public/uploads/`.**
- **Always use `git mv` for file moves**, not delete + recreate.
- **If a tag is applied to the wrong commit:** delete it first, then re-tag the correct HEAD.
- **Verify the fix commit is actually in the target branch before merging.**

---

## 5. Validation Skill

### Required for code changes

```bash
npx prisma validate          # Schema must be valid
npx prisma migrate status    # Migrations must be up to date
npm run build                # All routes must compile
npx tsc --noEmit             # No TypeScript errors
npm run lint                 # No ESLint warnings or errors
```

### Documentation-only changes

At minimum run `npm run lint`. State clearly that no business code was touched.

### Security check

```bash
git ls-files .env.local     # Must return empty
git ls-files prisma/dev.db  # Must return empty
git ls-files public/uploads # Must be only .gitkeep
```

### Real browser testing

For major versions, real browser testing is required:
- Open dev server and manually verify all pages
- Check console for errors and red issues
- A build route list is NOT a substitute for browser testing

---

## 6. UI Quality Review Skill

### Anti-patterns to avoid

- Cheap blue-white admin-panel look
- Default template feel
- Plastic-looking buttons
- Cramped data tables
- Large heavy shadows

### Positive traits to verify

- Low saturation, comfortable whitespace, clear hierarchy
- `hover`, `selected`, `disabled`, `loading`, `empty`, `error` — all visually distinct
- Display-only Badges must not masquerade as clickable controls
- Clickable chips must have clear `selected` and `hover` states
- Buttons: default (black/dark), outline (white + border), ghost (transparent) — all with visible transitions
- Sidebar active route must be visually obvious

### Color scheme rules

- Primary buttons: black / dark gray
- Clickable chip selected: indigo-50 + indigo-300 border
- Semantic feedback: emerald (useful), slate (average), amber (needs improvement)
- Favorite: amber
- Display badge: muted gray, no cursor-pointer

---

## 7. Agent Anti-Hallucination Skill

### What the Agent must NOT do

- Claim "tested and passed" without showing actual command output
- Claim "real browser testing" without listing specific pages and operations
- Treat `npm run build` success as browser test completion
- Mark future/planned features as completed
- Leak task prompt text into README, CLAUDE.md, or any tracked document
- Commit with broken sentences, strange symbols, or truncated file paths

### Required output format for acceptance reports

- Current branch
- What files were changed
- What was verified (with exact command output)
- What was security-checked
- Whether schema/migration were touched
- Recommendation: ready to commit or not

---

## 8. Project Memory Update Skill

### After each stable version

1. Update `CLAUDE.md` version history.
2. Update `docs/PROJECT_MEMORY.md` with:
   - Current version number and date
   - What was completed
   - What remains future direction
3. Optionally update `docs/ACCEPTANCE_CHECKLIST.md`.
4. Never mark commercial SaaS / multi-user / cloud sync as completed.

### Before starting a new Claude Code session

- The Agent will auto-read `CLAUDE.md`.
- For deeper context, ask it to also read `docs/PROJECT_MEMORY.md` and `docs/AGENT_WORKFLOW_SKILLS.md`.

---

## 9. Standard Release Checklist

### Pre-commit

```bash
git status
git log --oneline --decorate -10
git tag --points-at HEAD
git branch -a
```

### Commit and push

```bash
git add -A
git commit -m "<message>

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin <branch>
```

### Merge to main

```bash
git checkout main
git pull origin main
git merge <branch> --no-ff -m "Merge pull request: <summary>"
git push origin main
git tag <version>
git push origin <version>
```

### Clean up

```bash
git branch -d <branch>
git push origin --delete <branch>
```

### Final confirmation

```bash
git status
git log --oneline --decorate -10
git tag --points-at HEAD
git branch -a
```

---

## 10. Recommended Usage

When starting a new development session:

1. **Let the Agent read `CLAUDE.md`** (auto-loaded in Claude Code).
2. **Let the Agent read `docs/AGENT_WORKFLOW_SKILLS.md`** for process guidance.
3. **Specify which type of task this round is:**
   - Feature development
   - Documentation-only release
   - UI polish / interaction state
   - Project memory update
   - GitHub showcase polish
   - Bug fix / security patch
4. **Require the Agent to output a structured acceptance report** matching the task type.

### Example prompt structure

```
当前分支：vX.Y-feature-name
本阶段目标：[one clear sentence]
不要做：[list of forbidden actions]
重点检查文件：[file list]
完成后运行：[validation commands]
输出格式：[expected report structure]
```

---

> This document captures workflows validated across v1.7 through v2.0.4 of the UI Sense AI project. Adapt as needed for future projects.
