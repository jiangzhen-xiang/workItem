export const kafkaConstants = {
  operationTypeOptions: [
    { name: '创建topic', value: '1' },
    { name: '给topic授权', value: '2' },
    { name: '给groupId授权', value: '3' }
  ],
  formStateOptions: [
    { name: '上传成功', value: '1' },
    { name: '预校验成功', value: '2' },
    { name: '预校验失败', value: '3' },
    { name: '创建资源和授权成功', value: '5' },
    { name: '创建资源或授权失败', value: '4' },
    { name: '创建资源和授权比对成功', value: '6' },
    { name: '创建资源或授权比对失败', value: '7' }
  ]
}
