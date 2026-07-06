const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "omnes-media"
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || ""

function getR2Endpoint() {
  if (!R2_ACCOUNT_ID) return null
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
}

export async function uploadToR2(
  key: string,
  body: Blob,
  contentType: string
): Promise<string | null> {
  const endpoint = getR2Endpoint()
  if (!endpoint) return null

  const url = `${endpoint}/${R2_BUCKET_NAME}/${key}`
  const timestamp = new Date().toUTCString()

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Authorization": `AWS ${R2_ACCESS_KEY_ID}:${R2_SECRET_ACCESS_KEY}`,
      "x-amz-date": timestamp,
      "Content-Type": contentType,
    },
    body: body as BodyInit,
  })

  if (!response.ok) return null
  return R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : key
}

export async function deleteFromR2(key: string): Promise<boolean> {
  const endpoint = getR2Endpoint()
  if (!endpoint) return false

  const url = `${endpoint}/${R2_BUCKET_NAME}/${key}`
  const response = await fetch(url, { method: "DELETE" })
  return response.ok
}

export function getR2Url(key: string): string {
  if (R2_PUBLIC_URL) return `${R2_PUBLIC_URL}/${key}`
  const endpoint = getR2Endpoint()
  if (!endpoint) return key
  return `${endpoint}/${R2_BUCKET_NAME}/${key}`
}

export async function readFromR2(key: string): Promise<string | null> {
  const url = getR2Url(key)
  if (!url) return null
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}
