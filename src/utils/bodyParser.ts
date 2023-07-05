const bodyParser = async (req: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    try {
      req.on('data', (chunk: any) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          body = body || '{}';
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

export { bodyParser };
