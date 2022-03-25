const files = [
    "general-one/JG.png",
    "general-one/JG.png",
    "general-one/JG.png",
    "general-one/JG.png",
    "generaltwo/G.png",
    "generaltwo/J.png",
    "generaltwo/12.png",
    "protanopy/F.png",
    "protanopy/W.png",
    "protanopy/JH.png",
    "protanomaly/A.png",
    "protanomaly/B.png",
    "protanomaly/C.png"
];


const groups = [];
const subFolders = [];

function groupByPrefix() {
    files.forEach(plate => {
        const [subfolder, name] = plate.split("/");

        if (!groups[subfolder]) {
            groups[subfolder] = []
            subFolders.push(subfolder);
        }
        groups[subfolder].push(name)
    })

    return groups;
}

const LIMIT = 10;

function getPlates() {
    const groupedPlates = groupByPrefix();
    const TYPES_PLATES_QUANTITY = subFolders.length;
    let currentType = 0;

    for (let i = 0; i < LIMIT; i++) {
        const sub = subFolders[currentType]
        const groupedSet = groupedPlates[sub];
        currentType++;

        if (currentType === TYPES_PLATES_QUANTITY) {
            currentType = 0;
        }

        const plate = groupedSet[Math.floor(Math.random() * groupedSet.length)];
        console.log(plate);
    }
}

getPlates()