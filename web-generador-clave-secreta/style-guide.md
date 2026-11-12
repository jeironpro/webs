# Style Guide — Secret Key Generator

## Visual identity

A fusion of four concepts: **banking elegance** (gold tones and premium finishes), **functional tool** (monospace type, no unnecessary decoration), **light modern** (warm beige background, white cards and soft shadows) and **physical card** (the key is shown as the number on a card with a chip).

---

## Color palette

| Token | Color | Use |
|---|---|---|
| `--color-bg` | `#f5f0ea` | General background (warm beige) |
| `--color-surface` | `#ffffff` | Option cards |
| `--color-card-bg` | `#1b1b26` | Credit card background |
| `--color-card-border` | `#c9a03a` | Gold border of the card |
| `--color-accent` | `#c9a03a` | Primary gold |
| `--color-accent-hover` | `#d4b15a` | Gold hover |
| `--color-text-primary` | `#2c2418` | Primary text |
| `--color-text-secondary` | `#8a7e70` | Secondary text |
| `--color-success` | `#5b8c5a` | Safe green |
| `--color-warning` | `#c9953a` | Moderate amber |
| `--color-danger` | `#b55a4a` | Weak red |

---

## Typography

- **Headings and body**: Inter (400–700)
- **Generated key**: JetBrains Mono (400–600), grouped in fours
- **Icons**: Material Symbols Outlined

---

## Key components

### Credit card (`card-credit`)

Dark gradient background, gold border, rounded corners (14px). It includes a gold chip, monospace key groups and a footer with the holder and expiry date.

### Gold button (`btn-gold`)

Gold gradient background, white text, glow and elevation on hover.

### Outline button (`btn-outline`)

Gray border, white background, darker hover state.

### Checkbox

The native checkbox is hidden; a bordered square shows a white check on a gold background when selected.

### Strength bar

Four segments that light up progressively in red, amber or green depending on entropy.

---

## Layout

```
Sticky, semi-transparent header
Main grid
  Left column
    Credit card (visual key)
    Toolbar (Copy + Regenerate)
    Strength bar
    Security note
  Right column
    Length (slider)
    Characters (checkboxes)
    Extras (checkboxes)
  Full-width information section (3 cards)
Footer
```

The main grid has a maximum width of 1024px and is centered. It uses one column on mobile and two columns from 769px upward; the information cards move to three columns on desktop.
