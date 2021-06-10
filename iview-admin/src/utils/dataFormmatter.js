export function dataFormatter (obj) {
  let pList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
  let temp
  for (let year = 202001; year <= 202006; year++) {
    let max = 0
    let sum = 0
    temp = obj[year]
    for (let i = 0, l = temp.length; i < l; i++) {
      max = Math.max(max, temp[i])
      sum += temp[i]
      obj[year][i] = {
        name: pList[i],
        value: temp[i]
      }
    }
    obj[year + 'max'] = Math.floor(max / 100) * 100
    obj[year + 'sum'] = sum
  }
  return obj
}
