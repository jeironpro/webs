export const LEVELS = [
    { dir: "basic_1_a", number: 1, label: "Bàsic 1" },
    { dir: "basic_2_b", number: 2, label: "Bàsic 2" },
    { dir: "basic_3_a", number: 3, label: "Bàsic 3" },
];

export const HIDDEN_FILES = {
    basic_1_a: [
        "activitats_basic_1.pdf",
        "quadern_activitats_complet_basic_1.pdf",
        "quadern_escrit_basic_1.pdf",
    ],
    basic_2_b: [
        "activitats_basic_2.pdf",
        "quadern_escrit_basic_2.pdf",
        "tasca_1_A.pdf",
        "tasca_2_A.pdf",
        "tasca_3_A.pdf",
    ],
    basic_3_a: [
        "activitats_basic_3.pdf",
        "nota_prova_final_A.pdf",
        "quadern_escrit_basic_3.pdf",
        "tasca_1_B.pdf",
        "tasca_2_B.pdf",
        "tasca_3_A.pdf",
    ],
};

const MATERIAL_LABELS = {
    "quadern_activitats_basic_1.pdf": "Quadern d’activitats",
    "audios_basic_2.pdf": "Àudios",
    "audios_basic_3.pdf": "Àudios",
};

const PDF_EXTENSION = ".pdf";
const LEVEL_PREFIX = "cpnl/";

function isHidden(levelDir, fileName) {
    return HIDDEN_FILES[levelDir]?.includes(fileName) === true;
}

function parseUnitNumber(relativePath) {
    const match = relativePath.match(/^unitat_(\d+)_a\//);
    return match ? Number(match[1]) : null;
}

function parseExerciseNumber(fileName) {
    const match = fileName.match(/ex[-_]?(\d+)/i);
    return match ? Number(match[1]) : null;
}

function prettifyFileName(fileName) {
    return fileName
        .replace(new RegExp(`\\${PDF_EXTENSION}$`, "i"), "")
        .replaceAll("_", " ")
        .trim();
}

function baseName(filePath) {
    return filePath.split("/").at(-1);
}

export function buildCatalog(inventory) {
    const uniqueInventory = [...new Set(inventory)];

    const levels = LEVELS.map((level) => {
        const prefix = `${LEVEL_PREFIX}${level.dir}/`;
        const units = new Map();
        const materials = [];

        for (const filePath of uniqueInventory) {
            if (!filePath.startsWith(prefix)) continue;

            const relativePath = filePath.slice(prefix.length);
            const name = baseName(relativePath);
            if (isHidden(level.dir, name)) continue;

            const unitNumber = parseUnitNumber(relativePath);
            if (unitNumber !== null) {
                const exerciseNumber = parseExerciseNumber(name);
                if (exerciseNumber !== null) {
                    if (!units.has(unitNumber)) {
                        units.set(unitNumber, { number: unitNumber, exercises: [] });
                    }
                    units.get(unitNumber).exercises.push({
                        number: exerciseNumber,
                        label: `Exercici ${exerciseNumber}`,
                        file: filePath,
                    });
                }
                continue;
            }

            materials.push({
                file: filePath,
                name,
                label: MATERIAL_LABELS[name] ?? prettifyFileName(name),
            });
        }

        const sortedUnits = [...units.values()]
            .sort((a, b) => a.number - b.number)
            .map((unit) => ({
                ...unit,
                exercises: unit.exercises.sort((a, b) => a.number - b.number),
            }));

        return {
            ...level,
            units: sortedUnits,
            materials: materials.sort((a, b) => a.label.localeCompare(b.label, "ca")),
        };
    });

    const totals = {
        levels: levels.length,
        units: levels.reduce((sum, level) => sum + level.units.length, 0),
        exercises: levels.reduce(
            (sum, level) =>
                sum + level.units.reduce((unitSum, unit) => unitSum + unit.exercises.length, 0),
            0
        ),
        materials: levels.reduce((sum, level) => sum + level.materials.length, 0),
    };

    return { levels, totals };
}
