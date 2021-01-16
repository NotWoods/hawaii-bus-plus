export function splitString(title, matched) {
    if (matched.length === 0) {
        return [{ text: title, match: false }];
    }
    let offset = 0;
    let result = [];
    for (const match of matched) {
        if (offset < match.offset) {
            result.push({ text: title.slice(offset, match.offset), match: false });
        }
        result.push({
            text: title.slice(match.offset, match.length),
            match: true,
        });
        offset = match.offset + match.length;
    }
    if (offset < title.length - 1) {
        result.push({ text: title.slice(offset), match: false });
    }
    return result;
}
