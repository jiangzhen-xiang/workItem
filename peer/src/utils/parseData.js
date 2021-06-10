/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */

function hbaseParseData(sourceData) {
  let targetData = {}
  targetData.files = sourceData.connectionEnvConfig
  targetData.files = []
  return targetData
}

function flinkParseData(sourceData) {
  let targetData = {}
  targetData.files = sourceData.connectionEnvConfig
  targetData.files = []
  return targetData
}

function yarnParseData(sourceData) {
  let targetData = {}
  targetData.files = sourceData.connectionEnvConfig
  targetData.files = []
  return targetData
}

function hdfsParseData(sourceData) {
  let targetData = {}
  targetData.files = sourceData.connectionEnvConfig
  targetData.files = []
  return targetData
}

function kafkaParseData(sourceData) {
  let targetData = {}
  let objStr = eval('(' + sourceData.config + ')')
  let obj = JSON.parse(objStr)
  console.log('=======obj', obj)
  targetData['bootstrapServers'] = obj['bootstrap.servers']
  targetData['saslMechanism'] = obj['sasl.mechanism']
  targetData['securityProtocol'] = obj['security.protocol']
  for (let k in sourceData) {
    k !== 'config' && (targetData[k] = obj[k])
  }

  return targetData
}

function hiveMetastoreParseData(sourceData) {
  let targetData = {}
  let objStr = eval('(' + sourceData.config + ')')
  let obj = JSON.parse(objStr)
  console.log('=======obj', obj)
  targetData['hive-metastore.Server'] = obj['hiveMetastoreServer']
  // targetData['saslMechanism'] = obj['sasl.mechanism']
  // targetData['securityProtocol'] = obj['security.protocol']
  for (let k in sourceData) {
    k !== 'config' && (targetData[k] = obj[k])
  }

  return targetData
}

function cmParseData(sourceData) {
  let targetData = {}
  let objStr = eval('(' + sourceData.config + ')')
  let obj = JSON.parse(objStr)
  console.log('=======obj', obj)
  targetData['cmServer'] = obj['cm.server']
  for (let k in sourceData) {
    k !== 'config' && (targetData[k] = obj[k])
  }

  return targetData
}

const handleParseData = {
  flinkParseData,
  cmParseData,
  hbaseParseData,
  yarnParseData,
  hdfsParseData,
  'hive-metastoreParseData': hiveMetastoreParseData,
  kafkaParseData
}
export {
  handleParseData
}
