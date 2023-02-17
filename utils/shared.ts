const replaceLetters = (name: string) => {
  let replacedWord = name

  if (replacedWord.includes('Ã¥')) {
    replacedWord = replacedWord.replace(/Ã¥/g, 'å')
  }
  if (replacedWord.includes('Ã¤')) {
    replacedWord = replacedWord.replace(/Ã¤/g, 'ä')
  }
  if (replacedWord.includes('%E4')) {
    replacedWord = replacedWord.replace(/%E4/g, 'ä')
  }
  if (replacedWord.includes('Ã¶')) {
    replacedWord = replacedWord.replace(/Ã¶/g, 'ö')
  }
  if (replacedWord.includes('Ã…')) {
    replacedWord = replacedWord.replace(/Ã…/g, 'Å')
  }
  if (replacedWord.includes('Ã„')) {
    replacedWord = replacedWord.replace(/Ã„/g, 'Ä')
  }
  if (replacedWord.includes('Ã–')) {
    replacedWord = replacedWord.replace(/Ã–/g, 'Ö')
  }
  return replacedWord
}

export default replaceLetters