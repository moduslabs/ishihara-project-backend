const colorsOn = [
    ['#FE7168', '#E57666', '#FD9050', '#EE6456'],
    ['#F9BB82', '#EBA170', '#FCCD84'], 
    ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674'],
    ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674', '#FECB05'],
    ['#E96B6C', '#F7989C'], // Protanopia
    ['#AD5277', '#F7989C'], // Protanomaly
    // ['#FF934F'], Viewable for all
    // ['#A8AA00', '#78BE28'] Viewable just for colorblindness
];

const colorsOff = [
    ['#5F5A43', '#7C7846', '#BBA959', '#565536', '#837744', '#BBA363'],
    ['#9CA594', '#ACB4A5', '#BBB964', '#D7DAAA', '#E5D57D', '#D1D6AF'],
    ['#F49427', '#C9785D', '#E88C6A', '#F1B081'],
    ['#F49427', '#C9785D', '#E88C6A', '#F1B081', '#FFCE00'],
    ['#635A4A', '#817865', '#9C9C84'], // Protanopia
    ['#635A4A', '#817865', '#9C9C84'], // Protanomaly
    // ['#9C9C9C'], Viewable for all
    // ['#828200', '#609A1B'] Viewable just for colorblindness
];

module.exports = { colorsOn, colorsOff }