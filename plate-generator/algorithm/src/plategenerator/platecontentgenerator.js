//Characters 0 and O must be removed from the list below due the difficult to direntiate them
//into the plates according with team
const characters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9'
]

class PlateContentGenerator {
    _getCaracter() {
        return characters[Math.floor(Math.random() * characters.length)]
    }

    getContent() {
        const howMuchCharacters = Math.floor(Math.random() * 2) + 1;
        let result = '';
        for (let i = 0; i < howMuchCharacters; i++) {
            result = result + this._getCaracter();
        }

        return "GN";
    }
}

module.exports = { PlateContentGenerator }