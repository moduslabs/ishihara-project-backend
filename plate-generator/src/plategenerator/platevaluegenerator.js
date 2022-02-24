const caracters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

class PlateValueGenerator {
    constructor() { }

    _getCaracter() {
        return caracters[Math.floor(Math.random() * 36)]
    }

    getValue() {
        const howMuchCaracteres = Math.floor(Math.random() * 2) + 1;
        let result = '';
        for (let i = 0; i < howMuchCaracteres; i++) {
            result = result + this._getCaracter();
        }

        return result;
    }
}

module.exports = { PlateValueGenerator }