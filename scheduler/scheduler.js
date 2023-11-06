const cron = require('node-cron')

const Scheduler = cron.schedule('15 * * * *', async function () {
  try {
    console.log('do here')

    // fs.writeFileSync('./././res/wsb.json', JSON.stringify(wsbKeywords), () => { })
  } catch (err) {
    console.log('failed to write', err)
  }

});
module.exports = Scheduler