// logs configuration
export const log = {
  colors: {
    error: 'brightRed',
    warn: 'brightYellow',
    info: 'brightCyan',
    verbose: 'brightWhite',
    debug: 'brightBlue',
    silly: 'brightMagenta'
  },
  filename: 'debug.log',
  // priority => 0: highest 7: lowest
  levels: {
    emergency: {
      value: 'emerg', priority: 0
    },
    alert: {
      value: 'alert', priority: 1
    },
    critical: {
      value: 'crit', priority: 2
    },
    error: {
      value: 'error', priority: 3
    },
    warning: {
      value: 'warning', priority: 4
    },
    notice: {
      value: 'notice', priority: 5
    },
    info: {
      value: 'info', priority: 6
    },
    debug: {
      value: 'debug', priority: 7
    }
  }
}

// environment names
export const environments = {
  production: 'production',
  qa: 'qa',
  staging: 'staging',
  development: 'dev'
}

// environment variables file path
export const env = '../../.env'

// environment variables mapping
export const variables = {
  PORT: { name: 'PORT', value: 3000 },
  LOG_LEVEL: { name: 'LOG_LEVEL', value: 'debug' },
  NODE_ENV: { name: 'NODE_ENV', value: 'development' },
  DB_NAME: { name: 'DB_NAME', value: 'socialdistance' },
  DB_URL: { name: 'DB_URL', value: 'localhost' },
  DB_PORT: { name: 'DB_PORT', value: '27017' },
  DB_USERNAME: { name: 'DB_USERNAME', value: '' },
  DB_PASSWORD: { name: 'DB_PASSWORD', value: '' },
  DB_REPLICA_SET: { name: 'DB_REPLICA_SET', value: '' },
  REDIS_PORT: { name: 'REDIS_PORT', value: 6379 },
  REDIS_URL: { name: 'REDIS_URL', value: 'localhost' },
  PASSWORD_HASH: { name: 'PASSWORD_HASH', value: '052794d1b81834d4d78d2f081eb4f0d85fd148dd14f324968814324f11db24c3' },
  SERVER_API_REVISION: { name: 'SERVER_API_REVISION', value: '' },
  JOB_TYPES: { name: 'JOB_TYPES', value: '' },
  SERVER_PRIVATE_KEY: { name: 'SERVER_PRIVATE_KEY', value: '' },
  SERVER_FULLCHAIN_KEY: { name: 'SERVER_FULLCHAIN_KEY', value: '' }
}

// application default values
export const application: any = {
  name: 'Social Distance'
}

// database tables
export const tables = {
  CRONS: { name: 'crons', collection: 'crons' },
}

// defined constants
export const constants = {
  JWT_AUDIENCE: {
    client: 'client',
    admin: 'admin',
    public: 'public'
  },
  MONTHS: [
    {
      short: 'Jan',
      long: 'January',
      index: 1
    },
    {
      short: 'Feb',
      long: 'February',
      index: 2
    }, {
      short: 'Mar',
      long: 'March',
      index: 3
    }, {
      short: 'Apr',
      long: 'April',
      index: 4
    }, {
      short: 'May',
      long: 'May',
      index: 5
    }, {
      short: 'Jun',
      long: 'June',
      index: 6
    }, {
      short: 'Jul',
      long: 'July',
      index: 7
    }, {
      short: 'Aug',
      long: 'August',
      index: 8
    }, {
      short: 'Sep',
      long: 'September',
      index: 9
    }, {
      short: 'Oct',
      long: 'October',
      index: 10
    }, {
      short: 'Nov',
      long: 'November',
      index: 11
    }, {
      short: 'Dec',
      long: 'December',
      index: 12
    }]
}

export const redisKeys = {
}

// default canonical method names
export const canonicalMethods = {

}

// default cron jobs
export const cronJobs = {
}


// content types header
export const contentTypes = {
  APPLICATION: {
    JAVA_ARCHIVE: 'application/java-archive',
    EXI_X12: 'application/EDI-X12',
    EDIFACT: 'application/EDIFACT',
    JAVASCRIPT: 'application/javascript',
    OCTET_STREAM: 'application/octet-stream',
    OGG: 'application/ogg',
    PDF: 'application/pdf',
    XHTML_xml: 'application/xhtml+xml',
    SHOCKWAVE: 'application/x-shockwave-flash',
    JSON: 'application/json',
    LD_JSON: 'application/ld+json',
    XML: 'application/xml',
    ZIP: 'application/zip',
    URL_ENCODED: 'application/x-www-form-urlencoded',
  },
  AUDIO: {
    MPEG: 'audio/mpeg',
    WMA: 'audio/x-ms-wma',
    REAL_AUDIO: 'audio/vnd.rn-realaudio',
    WAV: 'audio/x-wav',
  },
  IMAGE: {
    GIF: 'image/gif',
    JPEG: 'image/jpeg',
    PNG: 'image/png',
    TIFF: 'image/tiff',
    VND_ICON: 'image/vnd.microsoft.icon',
    X_ICON: 'image/x-icon',
    DJVU: 'image/vnd.djvu',
    SVG_XML: 'image/svg+xml',
  },
  MULTIPART: {
    MIXED: 'multipart/mixed',
    ALTERNATIVE: 'multipart/alternative',
    RELATED: 'multipart/related',
    FORM_DATA: 'multipart/form-data',
  },
  TEXT: {
    CSS: 'text/css',
    CSV: 'text/csv',
    HTML: 'text/html',
    JAVASCRIPT: 'text/javascript',
    PLAIN: 'text/plain',
    XML: 'text/xml',
  },
  VIDEO: {
    MPEG: 'video/mpeg',
    MP4: 'video/mp4',
    QUICKTIME: 'video/quicktime',
    WMV: 'video/x-ms-wmv',
    MSVIDEO: 'video/x-msvideo',
    FLV: 'video/x-flv',
    WEBM: 'video/webm',
  }
}
