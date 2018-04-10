
export function recordLogin(obj) {
  return {type: 'RECORD_LOGIN',
          guest: obj.guest,
          name: obj.name}
}

export function recordGuestLogin() {
  return {type: 'RECORD_GUEST_LOGIN',
          guest: true,
          name: 'Guest'}
}
