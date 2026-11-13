import { el, clear } from "../utils/dom.js";
import { partyRules, normalizeColor, HEX_RE } from "./parties.js";

function isHex(value) {
    return typeof value === "string" && value.startsWith("#");
}

export function chipOf(color) {
    return isHex(color) ? color : `var(${color})`;
}

function defaultHex(color) {
    return HEX_RE.test(color) ? normalizeColor(color) : "#666666";
}

function partyChip(token) {
    const node = el("span", { className: "party__chip" });
    node.style.setProperty("--chip", chipOf(token));
    return node;
}

export function campaignColorPicker({
    id,
    value,
    action = "custom-color",
    customAction = "custom-color-lib",
}) {
    const details = el("details", { className: "roster-color swatch-custom" });
    const trigger = el("summary", { className: "roster-color__trigger swatch-custom__trigger" });
    trigger.style.setProperty("--chip", chipOf(value));
    trigger.setAttribute("aria-label", "Elegir color de campaña");
    const swatches = el("span", { className: "roster-color__swatches" });

    for (const color of partyRules.palette) {
        const selected = color.token === value;
        const swatch = el("button", {
            className: selected ? "roster-color__swatch is-active" : "roster-color__swatch",
            attrs: {
                type: "button",
                "aria-label": color.name,
                "aria-pressed": String(selected),
                title: color.name,
            },
        });
        swatch.style.setProperty("--chip", chipOf(color.token));
        swatch.dataset.action = action;
        swatch.dataset.id = id ?? "";
        swatch.dataset.color = color.token;
        swatches.append(swatch);
    }

    const picker = el("input", {
        className: "roster-color__picker",
        attrs: { type: "color", "aria-label": "Color libre", value: defaultHex(value) },
    });
    picker.dataset.action = customAction;
    picker.dataset.id = id ?? "";
    swatches.append(picker);

    details.append(trigger, swatches);
    return details;
}

export function renderRoster(root, parties) {
    clear(root);
    if (parties.length === 0) {
        root.append(el("li", { className: "roster__empty", text: "El padrón está vacío." }));
        return;
    }

    for (const party of parties) {
        const removeButton = el("button", {
            className: "roster__delete",
            attrs: { type: "button", "aria-label": `Retirar ${party.name} del padrón` },
            text: "×",
        });
        removeButton.dataset.id = party.id;

        root.append(
            el("li", {
                className: "roster__item",
                children: [
                    campaignColorPicker({
                        id: party.id,
                        value: party.color,
                        action: "repaint",
                        customAction: "repaint-custom",
                    }),
                    el("span", { className: "roster__name", text: party.name }),
                    el("span", { className: "roster__votes tabular", text: `${party.votes}` }),
                    removeButton,
                ],
            })
        );
    }
}

function totalVotes(parties) {
    return parties.reduce((acc, party) => acc + party.votes, 0);
}

function leaderId(parties) {
    const max = Math.max(0, ...parties.map((party) => party.votes));
    if (max === 0) {
        return null;
    }
    const leaders = parties.filter((party) => party.votes === max);
    return leaders.length === 1 ? leaders[0].id : null;
}

export function renderBallot(root, state) {
    clear(root);
    if (state.parties.length === 0) {
        root.append(
            el("div", {
                className: "ballot__empty",
                children: [
                    el("p", {
                        className: "ballot__empty-title",
                        text: "Aún no hay partidos en liza.",
                    }),
                    el("p", {
                        className: "ballot__empty-copy",
                        text: "Inscribe el primero desde el padrón, a la derecha.",
                    }),
                ],
            })
        );
        return;
    }

    const total = totalVotes(state.parties);
    const lead = leaderId(state.parties);
    const sorted = [...state.parties].sort(
        (a, b) => b.votes - a.votes || a.name.localeCompare(b.name, "es")
    );

    for (const [index, party] of sorted.entries()) {
        const isLeader = party.id === lead;
        const rank = el("span", {
            className: "party__rank tabular",
            text: String(index + 1).padStart(2, "0"),
        });

        const namegroupChildren = [
            partyChip(party.color),
            el("h3", { className: "party__name", text: party.name }),
        ];
        if (isLeader) {
            namegroupChildren.push(el("span", { className: "party__lead", text: "Va en cabeza" }));
        }
        const namegroup = el("div", {
            className: "party__namegroup",
            children: namegroupChildren,
        });

        const tally = el("span", {
            className: "party__tally tabular",
            children: [
                el("span", { className: "party__count", text: String(party.votes) }),
                el("span", {
                    className: "party__unit",
                    text: ` ${party.votes === 1 ? "voto" : "votos"}${
                        total ? ` · ${Math.round((party.votes / total) * 100)}%` : ""
                    }`,
                }),
            ],
        });

        const isVoted = party.id === state.voteId;
        const voteButton = el("button", {
            className: `action action--ghost action--compact party__vote${
                isVoted ? " is-voted" : ""
            }`,
            attrs: {
                type: "button",
                "aria-pressed": String(isVoted),
            },
            text: isVoted ? "Tu voto" : "Votar",
        });
        voteButton.dataset.action = "vote";
        voteButton.dataset.id = party.id;
        const actionCell = el("div", { className: "party__act", children: [voteButton] });

        const bar = el("div", { className: "party__bar" });
        const fill = el("span", { className: "party__bar-fill" });
        fill.style.setProperty("--pct", String(total ? party.votes / total : 0));
        bar.append(fill);

        root.append(
            el("article", {
                className: isLeader ? "party party--leader" : "party",
                children: [rank, namegroup, tally, actionCell, bar],
            })
        );
    }
}

export function renderTally(projectors, state) {
    const total = totalVotes(state.parties);
    projectors.parties.textContent = String(state.parties.length);
    projectors.votes.textContent = String(total);
    const voted = state.parties.find((party) => party.id === state.voteId);
    projectors.mine.textContent = voted ? voted.name : "—";
}

export function renderBureau(root, projectors, state) {
    const total = totalVotes(state.parties);
    const lead = leaderId(state.parties);
    if (total === 0 || !lead) {
        root.hidden = true;
        return;
    }

    const leader = state.parties.find((party) => party.id === lead);
    projectors.who.textContent = leader.name;
    projectors.note.textContent = `${leader.votes} ${
        leader.votes === 1 ? "voto" : "votos"
    } hasta ahora.`;
    root.hidden = false;
}
