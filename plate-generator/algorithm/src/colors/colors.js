const platesConfig = {
    "redGreenOne": {
        "figure": ['#FE7168', '#E57666', '#FD9050', '#EE6456'],
        "background": ['#5F5A43', '#7C7846', '#BBA959', '#565536', '#837744', '#BBA363'],
        "prefixName": "red-green-one/"
    },
    "regGreenTwo": {
        "figure": ['#F9BB82', '#EBA170', '#FCCD84'],
        "background": ['#9CA594', '#ACB4A5', '#BBB964', '#D7DAAA', '#E5D57D', '#D1D6AF'],
        "prefixName": "red-green-two/"
    },
    "redGreenThree": {
        "figure": ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674'],
        "background": ['#F49427', '#C9785D', '#E88C6A', '#F1B081'],
        "prefixName": "red-green-three/"
    },
    "redGreenFour": {
        "figure": ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674', '#FECB05'],
        "background": ['#F49427', '#C9785D', '#E88C6A', '#F1B081', '#FFCE00'],
        "prefixName": "red-green-four/"
    },
    "protanopy": {
        "figure": ['#E96B6C', '#F7989C'],
        "background": ['#635A4A', '#817865', '#9C9C84'],
        "prefixName": "protanopy/"
    },
    "protanomaly": {
        "figure": ['#AD5277', '#F7989C'],
        "background": ['#635A4A', '#817865', '#9C9C84'],
        "prefixName": "protanomaly/"
    }
};

const getRandomStyle = function () {
    const stylesPlates = getStylePlates();
    const selectedStyle = stylesPlates[Math.floor(Math.random() * (stylesPlates.length))]
    return platesConfig[selectedStyle];
}

const getStylePlates = function () {
    const styles = [];

    for (let style in platesConfig) {
        styles.push(style);
    }
    return styles;
}



module.exports = { getRandomStyle }