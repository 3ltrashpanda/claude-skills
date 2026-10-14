# claude-skills

Reusable skills for Claude Code.

| Skill | What it does |
|---|---|
| [huddle](huddle/SKILL.md) | A live project board shared by you and your agents: work lanes (Reported → Up next → In progress → In testing → Done) and an ideas section where each role agent reviews an idea (yes / maybe / no, size, reason) and you approve, reject or ask a question. |

## Install

Skills live in `~/.claude/skills/<name>/` (all projects) or `<project>/.claude/skills/<name>/` (one project).

```sh
git clone https://github.com/3ltrashpanda/claude-skills.git
# all projects:
cp -r claude-skills/huddle ~/.claude/skills/
```

On Windows (PowerShell):

```powershell
git clone https://github.com/3ltrashpanda/claude-skills.git
Copy-Item -Recurse claude-skills\huddle $HOME\.claude\skills\
```

Start a new Claude Code session afterwards so the skill is picked up.

## huddle

```
/huddle new       create a board for this project (published as a private claude.ai artifact)
/huddle           sync: read your changes on the board, act on them, update every card
/huddle review    send ideas still in review to the relevant role agents
/huddle idea ...  add an idea      /huddle issue ...  report an issue
```

Needs a claude.ai account with artifacts enabled (the board uses the artifact database). The board is private until you
share it from its Share menu, and it only changes while a session is running; your own edits on the page always save.

Files:
- `huddle/SKILL.md` — the instructions: data model, sync rules, review round, agent report format.
- `huddle/board.html` — the board page template (`{{PROJECT}}` is replaced on `/huddle new`).
