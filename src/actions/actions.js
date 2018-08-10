
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

export function saveReport(reportData) {
  return {
    type: 'SAVE_REPORT',
    reportData: reportData,
  }
}

export function saveLocation(locationData) {
  return {
    type: 'SAVE_LOCATION',
    locationData: locationData,
  }
}

export function addReport(report) {
  return {
    type: 'ADD_REPORT',
    report: report,
  }
}

export function addImage(image) {
  return {
    type: 'ADD_IMAGE',
    image: image,
  }
}

export function redirectToNewReportForm() {
  return {
    type: 'REDIRECT_TO_NEW_REPORT_FORM',
  }
}

export function addLocation(location) {
  return {
    type: 'ADD_LOCATION',
    location: location,
  }
}

export function addBikePath(bikePath) {
  return {
    type: 'ADD_BIKE_PATH',
    bikePath: bikePath,
  }
}


export function addReportSet(reportSet) {
  return {
    type: 'ADD_REPORT_SET',
    reportSet: reportSet
  }
}

export function addBikePathSet(bikePathSet) {
  return {
    type: 'ADD_BIKE_PATH_SET',
    bikePathSet: bikePathSet
  }
}

export function addLocationSet(locationSet) {
  return {
    type: 'ADD_LOCATION_SET',
    locationSet: locationSet
  }
}

export function addUserSet(userSet) {
  return {
    type: 'ADD_USER_SET',
    userSet: userSet
  }
}

export function addImageSet(imageSet) {
  return {
    type: 'ADD_IMAGE_SET',
    imageSet: imageSet
  }
}

export function setBikePathsLoaded() {
  return {
    type: 'SET_BIKE_PATHS_LOADED'
  }
}

export function clearBikePathsLoaded() {
  return {
    type: 'CLEAR_BIKE_PATHS_LOADED'
  }
}

export function setLocationsLoaded() {
  return {
    type: 'SET_LOCATIONS_LOADED'
  }
}

export function clearLocationsLoaded() {
  return {
    type: 'CLEAR_LOCATIONS_LOADED'
  }
}

export function clearReports() {
  return {
    type: 'CLEAR_REPORTS',
  }
}

export function clearBikePaths() {
  return {
    type: 'CLEAR_BIKE_PATHS',
  }
}

export function clearLocations() {
  return {
    type: 'CLEAR_LOCATIONS',
  }
}

export function clearUsers() {
  return {
    type: 'CLEAR_USERS',
  }
}

export function clearImages() {
  return {
    type: 'CLEAR_IMAGES',
  }
}

export function loadReports() {
  return {
    type: 'LOAD_REPORTS',
  }
}

export function loadBikePaths() {
  return {
    type: 'LOAD_BIKE_PATHS',
  }
}

export function loadLocations() {
  return {
    type: 'LOAD_LOCATIONS',
  }
}

export function loadUsers() {
  return {
    type: 'LOAD_USERS',
  }
}

export function loadImages() {
  return {
    type: 'LOAD_IMAGES',
  }
}

export function setLocation(locationId) {
  return {
    type: 'SET_LOCATION',
    locationId: locationId,
  }
}

export function setBikePath(bikePathId) {
  return {
    type: 'SET_BIKE_PATH',
    bikePathId: bikePathId,
  }
}

export function clearNewReportData() {
  return {
    type: 'CLEAR_NEW_REPORT_DATA',
  }
}
