
export function recordLogin(obj) {
  debugger
  return {type: 'RECORD_LOGIN',
          guest: obj.guest,
          name: obj.name}
}
