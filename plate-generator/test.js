const platesConfig = {
    "redGreenOne": {
        "figure": ['#FE7168', '#E57666', '#FD9050', '#EE6456'],
        "background": ['#5F5A43', '#7C7846', '#BBA959', '#565536', '#837744', '#BBA363'],
        "bucket": "general-one"
    },
    "regGreenTwo": {
        "figure": ['#F9BB82', '#EBA170', '#FCCD84'],
        "background": ['#9CA594', '#ACB4A5', '#BBB964', '#D7DAAA', '#E5D57D', '#D1D6AF'],
        "bucket": "general-two"
    },
    "redGreenThree": {
        "figure": ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674'],
        "background": ['#F49427', '#C9785D', '#E88C6A', '#F1B081'],
        "bucket": "general-three"
    },
    "redGreenFour": {
        "figure": ['#89B270', '#7AA45E', '#B6C674', '#7AA45E', '#B6C674', '#FECB05'],
        "background": ['#F49427', '#C9785D', '#E88C6A', '#F1B081', '#FFCE00'],
        "bucket": "general-four"
    },
    "protanopy": {
        "figure": ['#E96B6C', '#F7989C'],
        "background": ['#635A4A', '#817865', '#9C9C84'],
        "bucket": "protanopy"
    },
    "protanomaly": {
        "figure": ['#AD5277', '#F7989C'],
        "background": ['#635A4A', '#817865', '#9C9C84'],
        "bucket": "protanomaly"
    }
};

const typesPlates = [];

for (let prop in platesConfig) {
    typesPlates.push(prop);
}

console.log(platesConfig[typesPlates[1]])