function updateNestedProperty(obj, path, valueOrUpdateFn) {
    if (path.length === 0) {
        return typeof valueOrUpdateFn === 'function'
            ? valueOrUpdateFn(obj)
            : valueOrUpdateFn;
    }
    const [head, ...tail] = path;
    const result = Array.isArray(obj) ? [...obj] : {...obj};
    if (result[head] === undefined) {
        result[head] = Number.isInteger(tail[0]) ? [] : {};
    }
    result[head] = updateNestedProperty(result[head], tail, valueOrUpdateFn);
    return result;
}