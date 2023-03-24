
dict = {};
for (let i = 0; i < word.length; i++) {
    dict[word[i]] = true;
}

/**
 * Checks if word is a real word found in the English dictionary
 * @param {string} word - The input to check if it is a real word
 * @return {boolean} - Returns true if the word is found in the English Dictionary, false if not
 */
function isWord(word) {
    return dict[word.toLowerCase()] === true;
}

module.exports = isWord;