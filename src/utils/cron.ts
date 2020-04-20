import agenda from 'agenda'
import { getConnectionString, getEnvironmentVariable } from './platform'
import { variables, tables } from '../common/config'

const cronProcessor = new (agenda)({
  db: {
    address: getConnectionString(),
    options: {
      useNewUrlParser: true
    },
    collection: tables.CRONS.collection
  }
})
const jobTypes: string[] = getEnvironmentVariable(variables.JOB_TYPES.name).split(',')
jobTypes.forEach((type: string) => {
  import(`../app/crons/${type.trim()}_cron.js`).then((cron) => {
    cron.default(cronProcessor)
  }).catch((e) => { console.log(e) })
})
if (jobTypes.length) {
  cronProcessor.start()
}
export default cronProcessor
