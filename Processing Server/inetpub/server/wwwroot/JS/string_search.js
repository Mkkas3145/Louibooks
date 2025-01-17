








function containsSearchList(value, arrayList) {
    return relatedToSearch(value, arrayList);
}
function getHangulList(text) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let checkHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
        if(checkHangul.test(text.charAt(i))) {
            let consonant = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
                'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
                'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
            let vowels = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
                'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ',
                'ㅜㅣ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ'];
            let consonantBottom = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ',
                'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ',
                'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ',
                'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
            
            let startHangul = 44032;
            let unicode = text.charAt(i).charCodeAt(0);
            unicode -= startHangul;
        
            let textConsonant = parseInt(unicode / 588);
            let textVowels = parseInt((unicode - (textConsonant * 588)) / 28);
            let textConsonantBottom = parseInt(unicode % 28);

            if (consonant[textConsonant] != null) {
                result += consonant[textConsonant];
                if (vowels[textVowels] != null) {
                    result += vowels[textVowels];
                }
                if (consonantBottom[textConsonantBottom] != null) {
                    result += consonantBottom[textConsonantBottom];
                }
            } else {
                result += text.charAt(i);
            }
        } else {
            result += text.charAt(i);
        }
    }
    return result;
}
function isStringMatch(text, target) {
    let arrayText = text.split(" ");
    let arrayTarget = target.split(" ");
    for (let i = 0; i < arrayText.length; i++) {
        for (let j = 0; j < arrayText[i].length; j++) {
            if (arrayTarget[i] != null) {
                if (arrayText[i].charAt(j) != arrayTarget[i].charAt(j)) {
                    return -1;
                }
            } else {
                return -1;
            }
        }
    }
    return 1;
}
//연관 점수
function relatedToSearch(text, arrayList) {
    //소문자로
    text = text.toLowerCase();
    //여러개 공백 한개로
    text = text.replace(/ +/g, " ");

    let list = new Array();
    let listIndex = 0;
    let searchList = new Array();
    for (let i = 0; i < arrayList.length; i++) {
        searchList[i] = arrayList[i];
    }

    let scoreList = new Array();

    for (let i = 0; i < searchList.length; i++) {
        let maxMatch = 0;
        let match = 0;
        let search = getHangulList(searchList[i].toLowerCase());
        for (let j = 0; j < text.length; j++) {
            let charText = "";
            for (let k = 0; k < (j + 1); k++) {
                charText += text.charAt(k);
            }
            let isMatch = isStringMatch(getHangulList(charText), search);
            if (isMatch == 1) {
                match ++;
                if (maxMatch < match) {
                    maxMatch = match;
                }
            } else {
                maxMatch = 0;
                match = 0;
                break;
            }
        }
        if (maxMatch > 0) {
            list[listIndex] = searchList[i];
            scoreList[listIndex] = maxMatch;
            listIndex ++;
        }
    }

    //점수 높은 순으로
    for (let i = 0; i < (list.length - 1); i++) {
        let maxScore = 0;
        let maxScoreIndex;
        for (let j = i; j < list.length; j++) {
            if (scoreList[i] < scoreList[j] && maxScore < scoreList[j]) {
                maxScore = scoreList[j];
                maxScoreIndex = j;
            }
        }
        if (maxScoreIndex != null) {
            let swap = list[maxScoreIndex];
            let swapScore = scoreList[maxScoreIndex];
            list[maxScoreIndex] = list[i];
            scoreList[maxScoreIndex] = scoreList[i];
            list[i] = swap;
            scoreList[i] = swapScore;
        }
    }
    
    return list;
}