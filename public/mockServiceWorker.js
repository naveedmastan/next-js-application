/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.10.4).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '0b38c1cd11b11b8a7b6b92b0b3e8e8e1'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.isTrusted) {
    return
  }

  const message = event.data

  switch (message.type) {
    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)
      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(clientId, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { clientId, request } = event
  const url = new URL(request.url)

  // Bypass service worker for non-GET requests.
  if (request.method !== 'GET') {
    return
  }

  // Bypass service worker for requests from non-active clients.
  if (!activeClientIds.has(clientId)) {
    return
  }

  // Bypass service worker for requests on the same origin as the Service Worker's script.
  if (url.origin === self.location.origin) {
    return
  }

  // Clone the request because it might've been already used
  // (i.e. its body has been read and sent to the client).
  const requestClone = request.clone()

  event.respondWith(
    fetch(requestClone)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response
        }

        // Return the response as-is if it's an error response,
        // so the consumer can still handle it.
        return response
      })
      .catch((error) => {
        return new Response(null, { status: 500 })
      })
  )
})

function sendToClient(clientId, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error)
      } else {
        resolve(event.data)
      }
    }

    self.clients.get(clientId).then((client) => {
      if (client) {
        client.postMessage(message, [channel.port2])
      } else {
        reject(new Error('Client not found'))
      }
    })
  })
}
