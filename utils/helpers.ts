export const colorsHex = [
  '#FFC312',
  '#C4E538',
  '#12CBC4',
  '#FDA7DF',
  '#ED4C67',
  '#F79F1F',
  '#A3CB38',
  '#1289A7',
  '#D980FA',
  '#B53471',
  '#EE5A24',
  '#009432',
  '#0652DD',
  '#9980FA',
  '#833471',
  '#EA2027',
  '#006266',
  '#1B1464',
  '#5758BB',
  '#6F1E51',
]

export const getMonthNameArray = (lang: string) => {
  const monthNames = []
  for (let i = 0; i < 12; i += 1) {
    monthNames.push(new Date(2021, i, 1).toLocaleString(lang, { month: 'long' }))
  }
  return monthNames
}
