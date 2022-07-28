let list = require('../../assets/TestData.json')

module.exports = {
    getRondonmList: (callback) => {
        // slect 10 rondom objects have at lest one verb, one noun, one adverb and one adjective
        let wordList = list.wordList.sort(() => Math.random() - Math.random()).slice(0, 10)
        wordList[0] = list.wordList.filter(a => a.pos === 'noun').sort(() => Math.random() - Math.random()).slice(0, 1)[0]
        wordList[3] = list.wordList.filter(a => a.pos === 'verb').sort(() => Math.random() - Math.random()).slice(0, 1)[0]
        wordList[6] = list.wordList.filter(a => a.pos === 'adverb').sort(() => Math.random() - Math.random()).slice(0, 1)[0]
        wordList[9] = list.wordList.filter(a => a.pos === 'adjective').sort(() => Math.random() - Math.random()).slice(0, 1)[0]
        return callback(wordList)
    },
    checkWords: (wordList, callback) => {
        let scoure = 0
        let successWords = []
        wordList.forEach(word => {
            let currectAnswer = list.wordList.find(a => a.id + a.pos === word.class)
            if (currectAnswer) {
                scoure++
                successWords.push(word)
            }
        });
        let result = scoure > 0 ? Math.floor((scoure / wordList.length) * 100) : 0
        return callback({ result, successWords })
    }
}