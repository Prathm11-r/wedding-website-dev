# Git Workflow & Repository Rules

- **Remote Repository**: `origin` is configured to `https://github.com/Prathm11-r/wedding-website-dev.git`
- **Main Branch**: `main`
- **Automatic Push Protocol**:
  - Whenever code changes are made, tested, and reviewed, stage and commit the changes with clear descriptive semantic commit messages (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).
  - Push the commits to `origin main` (or the active working branch).
  - Ensure `.env.local` and sensitive credentials are never committed or pushed (strictly adhere to [.gitignore](file:///d:/wedding%20project/.gitignore)).
