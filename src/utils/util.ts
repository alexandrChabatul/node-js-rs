import { IncomingMessage, ServerResponse } from "http";

const errorResponse = (req: IncomingMessage, res: ServerResponse, code: number, message: string) => {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.write(
        JSON.stringify({
          message,
        }),
      )
  res.end()
}

export {errorResponse}