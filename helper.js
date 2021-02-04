function clean(str) {
    var str = str.split(' ').join("-");
    return str;
}

function insertClean(str) {
    var str = str.replace(/-/g,' ');
    return str;
}

module.exports = {
    clean: clean,
    insertClean: insertClean
}