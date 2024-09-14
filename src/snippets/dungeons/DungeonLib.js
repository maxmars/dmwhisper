import { store } from '../../store';


const getDungeonSetRng = (items) => {
    let min = 1000;
    let max = 0;

    items.forEach((rng) => {
        if (rng.min < min) {
            min = rng.min;
        }

        if (rng.max > max) {
            max = rng.max;
        }
    });

    for (let i = 0; i < 1000; i++) {
        const result = Math.floor(Math.random() * max) + min;

        const foundItem = items.find((rng) => result >= rng.min && result <= rng.max);

        if (foundItem) {

            if (foundItem.maxAppears === 0) {
                continue;
            }

            foundItem.maxAppears--;
            return foundItem;
        }        
    }

    return null;

}

export const getDungeonRooms = (setpieceId, numberOfRooms, trapSetId, puzzleSetId, monsterSetId, treasureSetId) => {
    const content = store.getState().content;
    const setpiece = content.dungeonSetpieces.find(setpiece => setpiece.id === setpieceId);
    let trapSet = content.dungeonTrapSets.find(item => item.id === trapSetId);
    let puzzleSet = content.dungeonPuzzleSets.find(item => item.id === puzzleSetId);
    let monsterSet = content.dungeonMonsterSets.find(item => item.id === monsterSetId);
    let treasureSet = content.dungeonTreasureSets.find(item => item.id === treasureSetId);

    const result = {
        statusMessage: 'error general error',
        rooms: []
    }

    let startRooms = setpiece.rng.filter(room => room.positionInDungeon === 'start' && room.maxAppears > 0);
    let endRooms = setpiece.rng.filter(room => room.positionInDungeon === 'end' && room.maxAppears > 0);
    let middleRooms = setpiece.rng.filter(room => room.positionInDungeon === 'middle' && room.maxAppears > 0);
    let anyRooms = setpiece.rng.filter(room => room.positionInDungeon === 'any' && room.maxAppears > 0);

    if (startRooms.length > 0) {
        startRooms = JSON.parse(JSON.stringify(startRooms));
    }

    if (endRooms.length > 0) {
        endRooms = JSON.parse(JSON.stringify(endRooms));
    }

    if (middleRooms.length > 0) {
        middleRooms = JSON.parse(JSON.stringify(middleRooms));
    }

    if (anyRooms.length > 0) {
        anyRooms = JSON.parse(JSON.stringify(anyRooms));
    }

    // Generate starting room
    let startRoom = null;
    if (startRooms.length > 0) {
        const idx = Math.floor(Math.random() * startRooms.length);
        startRoom = {
            ...startRooms[idx],
            index: idx
        };
    } else if (anyRooms.length > 0) {
        const idx = Math.floor(Math.random() * anyRooms.length);
        startRoom = {
            ...anyRooms[idx],
            index: idx
        };
        anyRooms[idx].maxAppears--;
        if (anyRooms[idx].maxAppears === 0) {
            anyRooms = anyRooms.filter((room, index) => index !== startRoom.index);
        }
    } else {
        result.statusMessage = 'error no start room';
        return result;
    }

    // Generate ending room
    let endRoom = null;
    if (endRooms.length > 0) {
        const idx = Math.floor(Math.random() * endRooms.length);
        endRoom = {
            ...endRooms[idx],
            index: idx
        }; 
    } else if (anyRooms.length > 0) {
        const idx = Math.floor(Math.random() * anyRooms.length);
        endRoom = {
            ...anyRooms[idx],
            index: idx
        };
        anyRooms[idx].maxAppears--;
        if (anyRooms[idx].maxAppears === 0) {
            anyRooms = anyRooms.filter((room, index) => index !== endRoom.index);
        }
    } else {
        result.statusMessage = 'error no end room';
        return result;
    }

    numberOfRooms -= 2;
    const rooms = [];
    rooms.push(startRoom);

    let commonRooms = [];
    if (middleRooms.length > 0) {
        commonRooms = commonRooms.concat(middleRooms.filter(room => room.appearanceRate === 'common'));
    }
    if (anyRooms.length > 0) {
        commonRooms = commonRooms.concat(anyRooms.filter(room => room.appearanceRate === 'common'));
    }

    let uncommonRooms = [];
    if (middleRooms.length > 0) {
        uncommonRooms = uncommonRooms.concat(middleRooms.filter(room => room.appearanceRate === 'uncommon'));
    }
    if (anyRooms.length > 0) {
        uncommonRooms = uncommonRooms.concat(anyRooms.filter(room => room.appearanceRate === 'uncommon'));
    }

    let rareRooms = [];
    if (middleRooms.length > 0) {
        rareRooms = rareRooms.concat(middleRooms.filter(room => room.appearanceRate === 'rare'));
    }
    if (anyRooms.length > 0) {
        rareRooms = rareRooms.concat(anyRooms.filter(room => room.appearanceRate === 'rare'));
    }

    // Generate middle rooms
    while (numberOfRooms > 0) {
        let middleRoom = null;

        for (let i = 0; i < 1000; i++) {
            // 70% di probabilità di scegliere una stanza comune, 25% di scegliere una stanza non comune, 5% di scegliere una stanza rara
            let random = Math.random();

            if (random < 0.7 && commonRooms.length > 0) {
                const idx = Math.floor(Math.random() * commonRooms.length);
                middleRoom = {
                    ...commonRooms[idx],
                    index: idx
                };
                commonRooms[idx].maxAppears--;
                if (commonRooms[idx].maxAppears === 0) {
                    // eslint-disable-next-line no-loop-func
                    commonRooms = commonRooms.filter((room, index) => index !== middleRoom.index);
                }
            }

            if (random >= 0.7 && random < 0.95 && uncommonRooms.length > 0) {
                const idx = Math.floor(Math.random() * uncommonRooms.length);
                middleRoom = {
                    ...uncommonRooms[idx],
                    index: idx
                };
                uncommonRooms[idx].maxAppears--;
                if (uncommonRooms[idx].maxAppears === 0) {
                    // eslint-disable-next-line no-loop-func
                    uncommonRooms = uncommonRooms.filter((room, index) => index !== middleRoom.index);
                }
            }

            if (random >= 0.95 && rareRooms.length > 0) {
                const idx = Math.floor(Math.random() * rareRooms.length);
                middleRoom = {
                    ...rareRooms[idx],
                    index: idx
                };
                rareRooms[idx].maxAppears--;
                if (rareRooms[idx].maxAppears === 0) {
                    // eslint-disable-next-line no-loop-func
                    rareRooms = rareRooms.filter((room, index) => index !== middleRoom.index);
                }
            }

            if (middleRoom !== null) {
                break;
            }
        }

        if (middleRoom === null) {
            result.statusMessage = 'error not enough middle rooms';
            return result;
        }

        numberOfRooms--;
        rooms.push(middleRoom);
    }

    rooms.push(endRoom);

    trapSet = JSON.parse(JSON.stringify(trapSet));
    puzzleSet = JSON.parse(JSON.stringify(puzzleSet));
    monsterSet = JSON.parse(JSON.stringify(monsterSet));
    treasureSet = JSON.parse(JSON.stringify(treasureSet));

    result.rooms = [];

    rooms.forEach(room => {
        room = JSON.parse(JSON.stringify(room));

        room.trap = getDungeonSetRng(trapSet.rng);
        room.puzzle = getDungeonSetRng(puzzleSet.rng);
        room.monster = getDungeonSetRng(monsterSet.rng);
        room.treasure = getDungeonSetRng(treasureSet.rng);

        result.rooms.push(room);
    });

    result.statusMessage = 'success';
    return result;
}

