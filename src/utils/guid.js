var uuid1 = require('uuid1')

// Generate an UUID (as a string value)
console.log(uuid1.UUID1())

export default function uuid(type = 'P', len = 16, radix = 16) {
  return uuid1.UUID1()
}
