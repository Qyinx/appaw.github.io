const fs = require('fs')
const path = require('path')
const file = process.argv[2]
if (!file) {
  console.error('Usage: node check_balance_verbose.js <file>')
  process.exit(2)
}
const src = fs.readFileSync(file, 'utf8')

let stack = []
const opening = { '{': '}', '(': ')', '[': ']' }
const closing = { '}': '{', ')': '(', ']': '[' }
let inSingle = false
let inDouble = false
let inTemplate = false
let inLineComment = false
let inBlockComment = false
let prev = ''
let lastIndex = 0
for (let i = 0; i < src.length; i++) {
  const ch = src[i]
  const next = src[i+1]
  lastIndex = i
  // handle comments
  if (inLineComment) {
    if (ch === '\n') inLineComment = false
    prev = ch
    continue
  }
  if (inBlockComment) {
    if (ch === '*' && next === '/') { inBlockComment = false; i++; prev = '/'; continue }
    prev = ch
    continue
  }
  // handle strings
  if (!inSingle && !inDouble && !inTemplate) {
    if (ch === '/' && next === '/') { inLineComment = true; i++; prev = '/'; continue }
    if (ch === '/' && next === '*') { inBlockComment = true; i++; prev = '*'; continue }
  }
  if (!inDouble && ch === '`' && !inTemplate) { inTemplate = true; prev = ch; continue }
  else if (inTemplate) {
    if (ch === '`' && prev !== '\\') inTemplate = false
    prev = ch
    continue
  }
  if (!inDouble && ch === "'" && !inSingle) { inSingle = true; prev = ch; continue }
  else if (inSingle) {
    if (ch === "'" && prev !== '\\') inSingle = false
    prev = ch
    continue
  }
  if (!inSingle && ch === '"' && !inDouble) { inDouble = true; prev = ch; continue }
  else if (inDouble) {
    if (ch === '"' && prev !== '\\') inDouble = false
    prev = ch
    continue
  }

  // not in string/comment
  if (opening[ch]) {
    stack.push({ ch, i })
  } else if (closing[ch]) {
    if (!stack.length) {
      console.error('Unmatched closing', ch, 'at', i)
      process.exit(3)
    }
    const last = stack[stack.length-1]
    if (last.ch !== closing[ch]) {
      console.error('Mismatched closing', ch, 'at', i, 'expected', opening[last.ch])
      process.exit(4)
    }
    stack.pop()
  }
  prev = ch
}

if (inSingle || inDouble || inTemplate || inLineComment || inBlockComment) {
  console.error('File ended while still in string/comment context:')
  console.error('inSingle=', inSingle, 'inDouble=', inDouble, 'inTemplate=', inTemplate, 'inLineComment=', inLineComment, 'inBlockComment=', inBlockComment)
  const context = src.slice(Math.max(0, lastIndex-120), lastIndex+20)
  console.error('Nearby chars (index', lastIndex, '):\n', context)
  // print line number
  const lines = src.slice(0, lastIndex).split('\n')
  console.error('Around line:', lines.length)
  process.exit(5)
}
if (stack.length) {
  console.error('Unclosed tokens:')
  for (const s of stack) {
    console.error(s)
  }
  process.exit(6)
}
console.log('Braces/parentheses/brackets look balanced')
process.exit(0)
