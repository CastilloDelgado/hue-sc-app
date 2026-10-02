import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { once } from 'node:events'
import { createServer } from 'node:net'

// Run against a production build, with its own database and session secret.
test('email/password authentication end to end', { timeout: 60000 }, async () => {
  const dir = await mkdtemp(join(tmpdir(), 'hue-auth-test-'))
  const databasePath = join(dir, 'users.sqlite')
  const secret = randomBytes(32).toString('hex')
  let server
  let base
  let output = ''

  async function start() {
    output = ''
    const reservation = createServer()
    reservation.listen(0, '127.0.0.1')
    await once(reservation, 'listening')
    const port = reservation.address().port
    await new Promise(resolve => reservation.close(resolve))
    server = spawn(process.execPath, ['.output/server/index.mjs'], {
      env: {
        ...process.env, NODE_ENV: 'production', HOST: '127.0.0.1', PORT: String(port), NITRO_PORT: String(port),
        NUXT_SESSION_PASSWORD: secret, NUXT_AUTH_DATABASE_PATH: databasePath
      }, stdio: ['ignore', 'pipe', 'pipe']
    })
    server.stderr.on('data', chunk => { output += chunk })
    base = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Server did not start: ${output}`)), 10000)
      server.once('exit', code => {
        clearTimeout(timeout)
        reject(new Error(`Server exited (${code}): ${output}`))
      })
      server.stdout.on('data', chunk => {
        output += chunk
        const match = output.match(/Listening on (http:\/\/[^\s]+)/)
        if (match) {
          clearTimeout(timeout)
          resolve(match[1])
        }
      })
    })
  }
  async function stop() {
    if (server && server.exitCode === null && server.signalCode === null) {
      const exited = once(server, 'exit')
      server.kill('SIGTERM')
      await exited
    }
  }
  async function post(route, body, headers = {}) {
    return fetch(`${base}${route}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base, ...headers },
      body: JSON.stringify(body), redirect: 'manual'
    })
  }
  const credentials = { email: 'account@example.com', password: 'a long test passphrase!' }
  try {
    await start()
    let response = await fetch(`${base}/`, { redirect: 'manual' })
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('location'), '/login')
    assert.equal((await fetch(`${base}/api/private-example`)).status, 401)
    response = await fetch(`${base}/login`)
    assert.equal(response.status, 200)
    assert.match(await response.text(), /Iniciar sesión/)
    response = await fetch(`${base}/register`)
    assert.match(await response.text(), /Confirmar contraseña/)

    assert.equal((await post('/api/auth/register', { ...credentials, email: 'bad' })).status, 400)
    assert.equal((await post('/api/auth/register', { ...credentials, password: 'short' })).status, 400)
    assert.equal((await post('/api/auth/register', credentials, { Origin: 'https://foreign.example' })).status, 403)
    assert.equal((await post('/api/auth/register', credentials, { 'Sec-Fetch-Site': 'cross-site' })).status, 403)
    response = await post('/api/auth/register', { ...credentials, email: ' Account@EXAMPLE.com ' })
    assert.equal(response.status, 201, await response.clone().text())
    const created = await response.json()
    assert.equal(created.user.email, credentials.email)
    assert.ok(created.user.id)
    assert.deepEqual(Object.keys(created.user).sort(), ['email', 'id'])
    const setCookie = response.headers.getSetCookie().find(value => value.startsWith('hue-session=') && !value.startsWith('hue-session=;'))
    assert.ok(setCookie)
    assert.match(setCookie, /HttpOnly/i)
    assert.match(setCookie, /SameSite=Lax/i)
    assert.match(setCookie, /Secure/i)
    assert.ok(!setCookie.includes(credentials.password))
    const cookie = setCookie.split(';')[0]

    const db = new DatabaseSync(databasePath)
    const user = db.prepare('SELECT * FROM users').get()
    assert.equal(user.email, credentials.email)
    assert.notEqual(user.password_hash, credentials.password)
    assert.match(user.password_hash, /scrypt/)
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM users').get().count, 1)
    db.close()

    response = await fetch(`${base}/api/_auth/session`, { headers: { Cookie: cookie } })
    assert.deepEqual((await response.json()).user, created.user)
    assert.match(response.headers.get('cache-control'), /no-store/)
    response = await fetch(`${base}/`, { headers: { Cookie: cookie }, redirect: 'manual' })
    assert.equal(response.status, 200)
    const page = await response.text()
    assert.match(page, /Step 1/)
    assert.match(page, /Cerrar sesión/)
    assert.ok(!page.includes(user.password_hash))
    response = await fetch(`${base}/login`, { headers: { Cookie: cookie }, redirect: 'manual' })
    assert.equal(response.status, 302)
    assert.equal(response.headers.get('location'), '/')
    assert.equal((await post('/api/auth/register', credentials)).status, 409)
    response = await post('/api/auth/login', { ...credentials, password: 'incorrect password!' })
    assert.equal(response.status, 401)
    const wrongPassword = await response.json()
    response = await post('/api/auth/login', { ...credentials, email: 'missing@example.com' })
    assert.equal(response.status, 401)
    assert.equal((await response.json()).message, wrongPassword.message)
    const tamperedCookie = cookie.slice(0, -3) + 'abc'
    assert.equal((await fetch(`${base}/`, { headers: { Cookie: tamperedCookie }, redirect: 'manual' })).status, 302)

    response = await fetch(`${base}/api/_auth/session`, { method: 'DELETE', headers: { Cookie: cookie, Origin: 'https://foreign.example' } })
    assert.equal(response.status, 403)
    response = await fetch(`${base}/api/_auth/session`, { method: 'DELETE', headers: { Cookie: cookie, Origin: base } })
    assert.equal(response.status, 200)
    assert.ok(response.headers.getSetCookie().some(value => /hue-session=;/.test(value)))
    assert.ok(!(await (await fetch(`${base}/api/_auth/session`)).json()).user)

    await stop()
    await start()
    response = await post('/api/auth/login', credentials)
    assert.equal(response.status, 200, await response.clone().text())
    assert.deepEqual((await response.json()).user, created.user)
    response = await fetch(`${base}/api/_auth/session`, { headers: { Cookie: cookie } })
    assert.deepEqual((await response.json()).user, created.user)

    for (let i = 0; i < 11; i++) {
      response = await post('/api/auth/login', { email: 'throttle@example.com', password: 'wrong password' })
    }
    assert.equal(response.status, 429)
    assert.ok(Number(response.headers.get('retry-after')) > 0)
    await stop()
    await start()
    assert.equal((await post('/api/auth/login', { email: 'throttle@example.com', password: 'wrong password' })).status, 429)
  } finally {
    await stop()
    await rm(dir, { recursive: true, force: true })
  }
})
