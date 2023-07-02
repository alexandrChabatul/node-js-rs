import { IncomingMessage } from 'http'

const bodyParser = async (request: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      let body = ''
      request.on('data', chunk => {
        body += chunk
      })
      request.on('end', () => {
        resolve(JSON.parse(body))
      })
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

export { bodyParser }
