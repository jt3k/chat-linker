#!/usr/bin/env node

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// paths to files
const ENCRYPTED_FILE_PATH = path.join(process.cwd(), 'app-config.json.cast5');
const DECRYPTED_FILE_PATH = path.join(process.cwd(), 'app-config.json');

/**
 * Process the crypto
 * @param  {Object} actionFn action function for pipe
 * @param  {String} from     File path to src
 * @param  {String} to       File path to destination
 * @return {Object}          Promise resolves after the process is end
 */
function processor(actionFn, from, to) {
  from = fs.createReadStream(from);
  to = fs.createWriteStream(to);

  from
    .pipe(actionFn)
    .pipe(to);
  return new Promise(resolve => {
    from
      .on('end', resolve());
  });
}

const secureKey = process.env.secureKey;
if (!secureKey) {
  throw new Error('Secure key not found');
}

const action = process.argv[2];
switch (action) {
  case 'enc':
    {
      const enc = crypto.createCipher('cast5-cbc', secureKey);
      processor(enc, DECRYPTED_FILE_PATH, ENCRYPTED_FILE_PATH);
      break;
    }
  case 'dec':
    {
      const dec = crypto.createDecipher('cast5-cbc', secureKey);
      processor(dec, ENCRYPTED_FILE_PATH, DECRYPTED_FILE_PATH);
      break;
    }
  default:
    {
      const msg = `${process.argv[1].match(/[^/]+$/g, '')}`;
      console.log(`${msg} <param>\n${'-'.repeat(msg.length + 2)}^^^^^ param not found`);
      break;
    }
}
