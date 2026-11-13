export function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => resolve(String(reader.result)));
        reader.addEventListener("error", () => reject(reader.error));

        reader.readAsText(file, "UTF-8");
    });
}
