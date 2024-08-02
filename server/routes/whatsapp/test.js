const number = '09059309831'
const newNumber = '234' + number.slice(1);
console.log('newNumber', newNumber)

const number2 = '2349059309831@whqt'
const newNumber2 = number.slice('' , number2.indexOf('@'));
console.log('newNumber', newNumber2)

const number3 = '2349059309831'
const newNumber3 = '0' + number.slice(3);
console.log('newNumber', newNumber2)