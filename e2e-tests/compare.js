const fs = require('fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

const [, , file1, file2] = process.argv;

Promise.all([
    readFile(file1, 'utf8'),
    readFile(file2, 'utf8')
])
.then(([actual, expected]) => {
    const error = actual !== expected;
    if (error) {
        console.log('actual:')
        console.log(actual);
        console.log('expected:');
        console.log(expected);
    }
    process.exit(error ? 1 : 0)
})
.catch((err) => {
    console.error(err);
    process.exit(1);
});