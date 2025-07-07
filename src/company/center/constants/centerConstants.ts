export const CENTER_CONSTANTS = {
  // Form validation rules
  VALIDATION: {
    NAME_MAX_LENGTH: 100,
    PHONE_REGEX: /^[0-9-+\s()]+$/,
    LATITUDE_MIN: -90,
    LATITUDE_MAX: 90,
    LONGITUDE_MIN: -180,
    LONGITUDE_MAX: 180,
  },
  
  // Status text
  STATUS: {
    OPERATIONAL: 'Operational',
    NON_OPERATIONAL: 'Non-operational',
  },
  
  // Default values
  DEFAULTS: {
    IS_OPERATIONAL: true,
  },
  
  // Error messages
  ERRORS: {
    NAME_REQUIRED: 'Center name is required',
    NAME_TOO_LONG: 'Center name must be 100 characters or less',
    INVALID_PHONE: 'Invalid phone number format',
    INVALID_LATITUDE: 'Latitude must be a number between -90 and 90',
    INVALID_LONGITUDE: 'Longitude must be a number between -180 and 180',
    INVALID_OPERATING_HOURS: 'End time must be later than start time',
    FETCH_FAILED: 'Failed to load center list',
    CREATE_FAILED: 'Failed to create center',
    UPDATE_FAILED: 'Failed to update center',
    DELETE_FAILED: 'Failed to delete center',
  },
  
  // Placeholders
  PLACEHOLDERS: {
    NAME: 'Enter center name',
    ADDRESS: 'Seoul, Gangnam-gu...',
    REGION: 'Gangnam-gu',
    PHONE: '010-1234-5678',
    LATITUDE: '37.5665',
    LONGITUDE: '126.9780',
    SEARCH: 'Search by center name...',
    COMPANY_SEARCH: 'Search centers for this company...',
  },
}; 