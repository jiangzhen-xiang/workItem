/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */

function hbaseParseData (type, sourceData) {
  let targetData = {}

  return sourceData
}

function kafkaParseData (sourceData) {
  let targetData = {}
  let objStr = eval('(' + sourceData.config + ')')
  let obj = JSON.parse(objStr)
  console.log('=======obj', obj)
  targetData['bootstrapServers'] = obj['bootstrap.servers']
  targetData['saslMechanism'] = obj['sasl.mechanism']
  targetData['securityProtocol'] = obj['security.protocol']
  for (let k in sourceData) {
    (k !== 'config') && (targetData[k] = obj[k])
  }

  return targetData
}

const handleParseData = {
  hbaseParseData,
  kafkaParseData
}
export {
  handleParseData
}
