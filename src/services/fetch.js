const baseUrl = 'https://api.nasa.gov/'
const apiKey = 'RWp3aV6hfLxPQbat6zIIiMbqpze7hjdixCvnxSZb'

function call (endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      method: endpoint.method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }

    let url = endpoint.url

    // Add the api key at the end of the request.
    params = {
      ...params,
      api_key: apiKey
    }

    if (url.includes(':')) {
      const allMatch = url.match(/:([A-zA-Z]*)/)
      if (allMatch) {
        const key = allMatch[1]
        if (params.hasOwnProperty(key)) {
          url = url.replace(allMatch[0], params[key])

          delete params[key]
        } else {
          console.error(`[Fetch] Attribute ${key} is missing !`)
        }
      }
    }

    url = baseUrl + url
    let body = ''

    if (options.method !== 'POST') {
      if (Object.keys(params).length > 0) {
        url += '?'
        Object.keys(params).map(key => {
          url += `&${key}=${params[key]}`
        })
      }
    } else {
      body = params
    }

    if (typeof body !== 'string') {
      body = JSON.stringify(body)
    }

    if (body && body.length > 0) {
      options.body = body
    }

    window.fetch(url, options).then(async result => {
      const res = await result.json()
      if (result.status >= 400) {
        reject(res)
      } else {
        resolve(res)
      }
    }).catch(error => {
      console.error('[Fetch:call]', error)
      reject(error)
    })
  })
}

export default call
