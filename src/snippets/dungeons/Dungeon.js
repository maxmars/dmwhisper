// Warning: this is a snippet, not a full component. It is not meant yet to be used directly in your project.

export class Dungeon {
    constructor(width, height, roomTypes) {
        this.width = width;
        this.height = height;
        this.roomTypes = roomTypes;
        this.grid = Array.from({ length: height }, () => Array(width).fill(0));
        this.rooms = [];
    }

    generateRooms(roomMinSize, roomMaxSize) {
        this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(0));
        this.rooms = [];

        this.roomTypes.forEach(type => {
            let placed = 0;
            let tries = 0;
            while (placed < type.occurrences && tries < 1000) {
                let roomWidth = this.randomInt(roomMinSize, roomMaxSize);
                let roomHeight = this.randomInt(roomMinSize, roomMaxSize);
                let x = this.randomInt(0, this.width - roomWidth - 1);
                let y = this.randomInt(0, this.height - roomHeight - 1);

                let newRoom = { x, y, width: roomWidth, height: roomHeight, type };

                if (this.rooms.every(room => !this.roomsOverlap(room, newRoom))) {
                    this.rooms.push(newRoom);
                    for (let j = y; j < y + roomHeight; j++) {
                        for (let k = x; k < x + roomWidth; k++) {
                            this.grid[j][k] = 1;
                        }
                    }
                    placed++;
                } else {
                    tries++;
                }
            }
        });

        this.rooms = this.sortRoomsByDistance(this.rooms);
    }

    distanceCalc(punto1, punto2) {
        let deltaX = punto2.x - punto1.x;
        let deltaY = punto2.y - punto1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    
    sortRoomsByDistance(originalRooms) {
        if (originalRooms.length < 2) return originalRooms;
    
        let sortedRooms = [];
        let currentRoom = originalRooms[0];
        let lastRoom = 0;

        currentRoom.id = ++lastRoom;
        sortedRooms.push(currentRoom);
        originalRooms.splice(0, 1);
    
        while (originalRooms.length > 0) {
            let minimumDistance = Infinity;
            let closerRoomIndex = -1;
    
            for (let i = 0; i < originalRooms.length; i++) {
                let distance = this.distanceCalc(currentRoom, originalRooms[i]);
                if (distance < minimumDistance) {
                    minimumDistance = distance;
                    closerRoomIndex = i;
                }
            }
    
            currentRoom = originalRooms[closerRoomIndex];
            currentRoom.id = ++lastRoom;
            sortedRooms.push(currentRoom);
            originalRooms.splice(closerRoomIndex, 1);
        }
    
        return sortedRooms;
    }

    roomsOverlap(room1, room2) {
        return !(room2.x > room1.x + room1.width ||
            room2.x + room2.width < room1.x ||
            room2.y > room1.y + room1.height ||
            room2.y + room2.height < room1.y);
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

export default function DungeonCreate(props) {
    const dungeon = new Dungeon(props.width, props.height, props.roomTypes);
    dungeon.generateRooms(props.roomMinSize, props.roomMaxSize);

    return dungeon;
}
