# Version control and branching

This project uses Git for version control. Use branches for new features or revisions so that the default branch stays stable and changes can be tested before merge.

## Default branch

- The primary branch is **`main`** (or **`master`**). Production-ready and reviewed code lives here.
- Protect this branch if your host (e.g. GitHub, GitLab) allows it so that changes go in via pull/merge requests.

## Workflow

1. **Create a branch** for your work:
   ```bash
   git checkout -b feature/short-description
   ```
   Use a name that describes the change (e.g. `feature/revised-website`, `fix/typo-checklist`).

2. **Make changes** and commit on your branch:
   ```bash
   git add -A
   git commit -m "Clear, short description of the change"
   ```

3. **Push the branch** to the remote for testing or review:
   ```bash
   git push -u origin feature/short-description
   ```

4. **Open a pull request** (or merge request) against the default branch so others can review. Run or click through the app (e.g. open `index.html` or use a local server) to test.

5. **Merge** after review and any fixes. Then you can delete the feature branch and pull the latest default branch.

## Testing a branch locally

- After pushing, others (or you on another machine) can fetch and check out the branch:
  ```bash
  git fetch origin
  git checkout feature/short-description
  ```
- Open `index.html` in a browser or run `python3 -m http.server 8000` and visit `http://localhost:8000` to test.

## Summary

| Action        | Command / note |
|---------------|----------------|
| Start new work | `git checkout -b feature/name` |
| Commit        | `git add -A && git commit -m "Message"` |
| Push branch   | `git push -u origin feature/name` |
| Test before merge | Open app locally; optional PR review |
| After merge   | Delete branch; pull latest `main` |
