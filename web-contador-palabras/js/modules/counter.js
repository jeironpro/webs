export function countWords(text) {
    const trimmed = text.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export function countCharacters(text) {
    return text.length;
}

export function countCharactersNoSpaces(text) {
    return text.replace(/\s/g, "").length;
}

export function getCounts(text) {
    return {
        words: countWords(text),
        characters: countCharacters(text),
        charactersNoSpaces: countCharactersNoSpaces(text),
    };
}
