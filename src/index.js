module.exports = function check(str, bracketsConfig) {
    // classify all brackets for fast search
    const bracketClasses = {};
    bracketsConfig.forEach(bracketConfig => {
        for (let i = 0; i < 2; i++) {
            const currentBracket = bracketConfig[i];
            if (!bracketClasses[currentBracket]) {
                bracketClasses[currentBracket] = {};
            }
            bracketClasses[currentBracket][i ? "close" : "open"] = true;
        }
    });

    // check if current pair of brackets match each other
    const isCorrectBracketPair = (openBracket, closeBracket) => {
        let pairIndex = -1;
        for (let i = 0; i < bracketsConfig.length; i++) {
            if (openBracket === bracketsConfig[i][0]) {
                pairIndex = i;
                break;
            }
        }
        if (pairIndex === -1) return false;
        return bracketsConfig[pairIndex][1] === closeBracket;
    };

    const openBrackets = [];
    const brackets = str.split("");
    for (let i = 0; i < brackets.length; i++) {
        // bracket is not in the list at all
        if (!bracketClasses[brackets[i]]) return false;

        // open single bracket - add to list of already open brackets
        if (
            bracketClasses[brackets[i]].open &&
            !bracketClasses[brackets[i]].close
        ) {
            openBrackets.push(brackets[i]);
        }
        // close single bracket - check if it closes the latest open bracket
        if (
            bracketClasses[brackets[i]].close &&
            !bracketClasses[brackets[i]].open
        ) {
            if (
                isCorrectBracketPair(
                    openBrackets[openBrackets.length - 1],
                    brackets[i]
                )
            ) {
                openBrackets.splice(openBrackets.length - 1, 1);
            } else return false;
        }

        // bracket that can be both closing and opening
        if (
            bracketClasses[brackets[i]].close &&
            bracketClasses[brackets[i]].open
        ) {
            // check close first
            if (
                isCorrectBracketPair(
                    openBrackets[openBrackets.length - 1],
                    brackets[i]
                )
            ) {
                openBrackets.splice(openBrackets.length - 1, 1);
            } else {
                // then this is the new opening bracket
                openBrackets.push(brackets[i]);
            }
        }
    }
    return openBrackets.length === 0;
};
