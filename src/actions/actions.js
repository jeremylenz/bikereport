
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

export function incrementLikes(reportId) {
  return {
    type: 'INCREMENT_LIKES',
    reportId: reportId,
  }
}

export function addReport(report) {
  return {
    type: 'ADD_REPORT',
    report: report,
  }
}

export function addReportSet(reportSet) {
  return {
    type: 'ADD_REPORT_SET',
    reportSet: reportSet
  }
}

export function clearReports() {
  return {
    type: 'CLEAR_REPORTS',
  }
}

export function loadReports() {
  return {
    type: 'LOAD_REPORTS',
  }
}

export function setLocation(locationId) {
  return {
    type: 'SET_LOCATION',
    locationId: locationId,
  }
}
