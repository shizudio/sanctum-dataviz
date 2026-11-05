# sanctum-dataviz

A Claude skill that turns numbers into on-brand Sanctum data slides: charts, KPI rows, tables, heat maps, donuts, waterfalls, crypto views (net stake flows, market share, APY cards) and A4 collateral. Output is an editable 1920x1080 slide in the Sanctum Brand Update Figma file, with a preview in the chat and a Figma link.

## Install

### Claude Code

```bash
git clone https://github.com/shizudio/sanctum-dataviz.git ~/.claude/skills/sanctum-dataviz
```

Start a new session and the skill loads automatically. Update later with `git pull` inside that folder.

### Claude desktop app / claude.ai

Download the `.skill` (or zip) file from this repo's Releases page and upload it in Claude's skills settings.

## Requirements

- Access to the Sanctum Brand Update Figma file.
- The Figma connector enabled in Claude, since charts are built directly in Figma.

## Use it

Ask Claude for a chart in plain language, for example:

- "Chart our SOL staked over the last 12 months"
- "Make a KPI slide for TVL, revenue and users"
- "Turn this DefiLlama CSV into a net flows chart vs competitors"

Claude recommends a chart type, you pick one, and it builds the slide.

## Layout

- `SKILL.md`: the skill instructions Claude reads
- `references/`: templates, brand rules, Figma and collateral guides
- `scripts/`: builders and checks (`core.js`, `templates/`, `check_spec.py`, `csv_to_series.py`)
- `test/`: sample specs
