# Backend source recovery status

The original Cloud Agent Go backend checkout was not recoverable from the inspected machines. The former agent conversation may remain, but its filesystem was not restored. The available copies of `/agent/selene` showed no module, `cmd/selene/main.go`, migrations, or project Go files. The project store contained documentation and a frontend archive but no Go/SQL source. Git had not been initialized in that former backend checkout.

Therefore:
- Treat previous Milestone 1, Security Read, and URL/path validator PASS reports as historical evidence about the former workspace, not proof the current GitHub repository contains those files.
- Rebuild the backend from this documentation in the order in `MILESTONE_1_READINESS.md`.
- Do not invent or claim recovery of old backend source or history.
- Preserve the frontend already pushed by the user.

The old project documentation is preserved under `docs/source/`; later normative decisions are in `docs/backend/DECISIONS.md` and `POLICY_SUPPLEMENT_D25_D44.md`.
