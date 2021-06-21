export const htmlEncoder = (string) => {
    let subStringArray;
    subStringArray = string.match(
        /(http|ftp|https)(?::(\/\/))([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g
    );
    if (subStringArray) {
        subStringArray.forEach((url) => {
            const htmlMarkup = `<a href="${url}" style="text-decoration: underline;"> ${url} </a>`;
            string = string.replace(url, htmlMarkup);
        });
        return string;
    }
    return string;
};

export const codeMarkdown = (string) => {
    let subStringArray;
    subStringArray = string.match(/(?<=(```))((.|\n)*)(?=(```))/g);
    if (subStringArray) {
        subStringArray.forEach((codeBlock) => {
            const htmlMarkup = `<pre style="background: #F5966a;
            page-break-inside: avoid;
            font-family: monospace;
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 1.6em;
            max-width: 100%;
            overflow: auto;
            padding: 1em 1.5em;
            display: flex;
            word-wrap: break-word;"><code> ${codeBlock} </code></pre>`;
            string = string.replace(codeBlock, htmlMarkup);
            string = string.replace(/^(```)|(```)/gm, '');
        });
        return string;
    }
    return string;
};
