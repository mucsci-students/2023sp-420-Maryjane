
const wordsClass = require("check-word");
const dictionary = wordsClass("en");

class Utils {

    /**
     * 
     * https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
     * @param {Array} input 
     * @returns 
     */
    static powerSet(input) {
        if (!Array.isArray(input)) {
            console.error("powerSet method array parameter must be an array");
            return null;
        }

        const subsets = [[]];
    
        for (const el of input) {
            const last = subsets.length-1;
            for (let i = 0; i <= last; i++) {
                subsets.push( [...subsets[i], el] );
            }
        }
        
        return subsets;

    }

    static filterPowerSet(input, requiredLetter) {
        if (!Array.isArray(input)) {
            console.error("powerSet method array parameter must be an array");
            return null;
        }

        input = input.filter(function(value, index, arr) {
            if (value.length < 4 || !value.includes(requiredLetter)) {
                return false;
            } 

            return true;
        });

        return input;
    }

    //https://stackoverflow.com/questions/9960908/permutations-in-javascript
    static permutator(input) {
        let result = [];

        const permute = (arr, m = []) => {
            if (arr.length === 0) {
                result.push(m)
            } else {
                for (let i = 0; i < arr.length; i++) {
                    let curr = arr.slice();
                    let next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next))
                }
            }   
        }

        permute(input);

        return result;
    }

    static permuteArray(input) {
        let result = [];

        input.forEach(element => {
            result = result.concat(this.permutator(element));
        });

        return result;
    }

    static checkIfWord(input) {
        let result = [];

        input.forEach((element, index) => {
            if (dictionary.check(element)) {
                result.push(element);
                console.log(element);
            }
            //console.log(index + '/'+ input.length);
        });

        return result;

    }

    static removeDuplicates(input) {
        let seen = {};
        return input.filter(function(item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }

    static joinArray(input) {
        for (let i = 0; i < input.length; i++) {
            input[i] = input[i].join('');
        }

        return input;
    }

}

//Utils.powerSet([]);
//Utils.powerSet();
//Utils.powerSet(5);
let pangram = ['h', 'u', 'n', 'k', 'e', 'r', 's'];
let requiredLetter = 'i';

possibleWords = Utils.filterPowerSet(Utils.powerSet(pangram), requiredLetter);
possibleWords = Utils.permuteArray(possibleWords);
possibleWords = Utils.joinArray(possibleWords);
//possibleWords = Utils.removeDuplicates(possibleWords);
console.log(possibleWords);
possibleWords = Utils.checkIfWord(possibleWords);

console.log(possibleWords);




module.exports = Utils;
