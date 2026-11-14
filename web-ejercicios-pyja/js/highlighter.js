const HIGHLIGHTER = (() => {
    const pattern = (regex, className) => ({ regex: new RegExp(regex, "g"), className });

    const LANGUAGES = {
        python: [
            pattern(/#[^\n]*/, "tok-comment"),
            pattern(
                /"""(?:[\s\S]*?)"""|'''(?:[\s\S]*?)'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/,
                "tok-string"
            ),
            pattern(/@[\w.]+/, "tok-annotation"),
            pattern(
                /\b(def|class|return|if|elif|else|for|while|break|continue|pass|import|from|as|in|not|and|or|None|True|False|try|except|finally|with|lambda|global|nonlocal|raise|yield|del|assert|is|print)\b/,
                "tok-keyword"
            ),
            pattern(
                /\b(int|float|str|bool|list|dict|set|tuple|range|len|input|sum|min|max|sorted|enumerate|zip|map|filter|ord|chr|abs|round|type|open|isinstance|isspace|join|split|strip|lower|upper|replace|startswith|endswith|find|count|keys|values|items|append|extend|pop|insert)\b/,
                "tok-builtin"
            ),
            pattern(/\b\d+(?:\.\d+)?\b/, "tok-number"),
        ],
        java: [
            pattern(/\/\/[^\n]*|\/\*(?:[\s\S]*?)\*\//, "tok-comment"),
            pattern(/"(?:\\.|[^"\\\n])*"/, "tok-string"),
            pattern(/@[\w.]+/, "tok-annotation"),
            pattern(
                /\b(public|private|protected|class|interface|extends|implements|static|final|void|int|double|float|long|short|byte|boolean|char|String|new|if|else|for|while|do|switch|case|default|break|continue|return|this|super|try|catch|finally|throw|throws|import|package|abstract|enum|instanceof|true|false|null|var|record)\b/,
                "tok-keyword"
            ),
            pattern(
                /\b(System|Math|Integer|Double|Float|Long|Boolean|Character|Object|StringBuilder|BufferedReader|InputStreamReader|IOException|RuntimeException|print|println|printf|readLine|parseInt|parseDouble)\b/,
                "tok-builtin"
            ),
            pattern(/\b\d+(?:\.\d+)?[fFdDlL]?\b/, "tok-number"),
        ],
    };

    const tokenize = (code, language) => {
        const rules = LANGUAGES[language] || [];
        const fragment = document.createDocumentFragment();
        let index = 0;

        while (index < code.length) {
            let match = null;
            for (const rule of rules) {
                rule.regex.lastIndex = index;
                const result = rule.regex.exec(code);
                if (result && result.index === index) {
                    match = { text: result[0], className: rule.className };
                    break;
                }
            }

            if (match) {
                const span = document.createElement("span");
                span.className = match.className;
                span.textContent = match.text;
                fragment.append(span);
                index += match.text.length;
            } else {
                fragment.append(document.createTextNode(code[index]));
                index += 1;
            }
        }

        return fragment;
    };

    return {
        highlightCode: (code, language) => tokenize(code, language),
    };
})();

window.highlightCode = HIGHLIGHTER.highlightCode;
