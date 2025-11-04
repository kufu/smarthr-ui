import * as fs from 'fs'

const stream = fs.createReadStream(`${__dirname}/../CHANGELOG.md`, {
  encoding: 'utf8',
  highWaterMark: 1024,
})

let buffer = ''

stream.on('data', (chunk) => {
  buffer += chunk.toString('utf8')
  // The changelog after the second release header is for old version.
  // Therefore, the part before that is considered as the changelog for latest release.
  const matched = buffer.match(/\n#+\s\[?\d+\.\d+.\d+(-\d+)?\]?/g)
  if (matched === null || matched.length < 2) {
    return
  }
  const prevHeader = matched[1]
  const prevHeaderIndex = buffer.indexOf(prevHeader)
  const latestChangelog = buffer.slice(0, prevHeaderIndex)
  console.log(latestChangelog)
  stream.destroy()
})

stream.on('end', () => {
  // This will only runs if two version headers are not found.
  // In this case, the whole changelog is considered as the changelog for latest release.
  console.log(buffer)
})
