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

        this.rooms = this.ordinaStanzePerVicinanza(this.rooms);
    }

    calcolaDistanza(punto1, punto2) {
        let deltaX = punto2.x - punto1.x;
        let deltaY = punto2.y - punto1.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
    
    // Funzione per ordinare i punti in modo che ogni coppia di punti consecutivi sia più vicina della prossima coppia
    ordinaStanzePerVicinanza(punti) {
        if (punti.length < 2) return punti;
    
        let puntiOrdinati = [];
        let puntoCorrente = punti[0];
        puntiOrdinati.push(puntoCorrente);
        punti.splice(0, 1);
    
        while (punti.length > 0) {
            let distanzaMinima = Infinity;
            let indicePuntoPiuVicino = -1;
    
            for (let i = 0; i < punti.length; i++) {
                let distanza = this.calcolaDistanza(puntoCorrente, punti[i]);
                if (distanza < distanzaMinima) {
                    distanzaMinima = distanza;
                    indicePuntoPiuVicino = i;
                }
            }
    
            puntoCorrente = punti[indicePuntoPiuVicino];
            puntiOrdinati.push(puntoCorrente);
            punti.splice(indicePuntoPiuVicino, 1);
        }
    
        return puntiOrdinati;
    }

    roomsOverlap(room1, room2) {
        return !(room2.x > room1.x + room1.width ||
            room2.x + room2.width < room1.x ||
            room2.y > room1.y + room1.height ||
            room2.y + room2.height < room1.y);
    }

    generateCorridors() {
        for (let i = 1; i < this.rooms.length; i++) {
            let prevRoom = this.rooms[i - 1];
            let currRoom = this.rooms[i];

            let prevCenter = { x: prevRoom.x + Math.floor(prevRoom.width / 2), y: prevRoom.y + Math.floor(prevRoom.height / 2) };
            let currCenter = { x: currRoom.x + Math.floor(currRoom.width / 2), y: currRoom.y + Math.floor(currRoom.height / 2) };

            if (Math.random() > 0.5) {
                this.createHorizontalCorridor(prevCenter.x, currCenter.x, prevCenter.y);
                this.createVerticalCorridor(prevCenter.y, currCenter.y, currCenter.x);
            } else {
                this.createVerticalCorridor(prevCenter.y, currCenter.y, prevCenter.x);
                this.createHorizontalCorridor(prevCenter.x, currCenter.x, currCenter.y);
            }
        }
    }

    generateCorridors2() {
        // Ordina le stanze per posizione x
        this.rooms.sort((a, b) => a.x - b.x);

        for (let i = 0; i < this.rooms.length - 1; i++) {
            let roomA = this.rooms[i];
            let roomB = this.rooms[i + 1];

            // Collegamento orizzontale
            let x1 = roomA.x + Math.floor(roomA.width / 2);
            let y1 = roomA.y + Math.floor(roomA.height / 2);
            let x2 = roomB.x + Math.floor(roomB.width / 2);
            let y2 = roomB.y + Math.floor(roomB.height / 2);

            this.createHorizontalCorridor(x1, x2, y1);
            this.createVerticalCorridor(y1, y2, x2);

        }
    }    

    createHorizontalCorridor(x1, x2, y) {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            this.grid[y][x] = 2;
        }
    }

    createVerticalCorridor(y1, y2, x) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            this.grid[y][x] = 2;
        }
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    printDungeon() {
        let rows = this.grid.map(row => row.join(' '));
        rows.forEach((row, index) => { console.log(row + "  - " + index); });
        this.rooms.forEach(room => {
            console.log(room.x + " " + room.y + " " + room.width + " " + room.height + " " + room.type.name);
        });
    }
}

export default function DungeonCreate(props) {
    const dungeon = new Dungeon(props.width, props.height, props.roomTypes);
    dungeon.generateRooms(props.roomMinSize, props.roomMaxSize);
    dungeon.generateCorridors2();

    return dungeon;
}

export function DungeonCreateTest() {
    const props = {
        width: 20,
        height: 20,
        roomTypes: [{ name: 'kitchen', occurrences: 1 }, { name: 'bedroom', occurrences: 3 }, { name: 'dining room', occurrences: 1 }, { name: 'bathroom', occurrences: 2 }, { name: 'study', occurrences: 2 }],
        roomMinSize: 3,
        roomMaxSize: 4
    };

    const dungeon = new Dungeon(props.width, props.height, props.roomTypes);
    dungeon.generateRooms(props.roomMinSize, props.roomMaxSize);
    dungeon.generateCorridors2();
    // dungeon.printDungeon();
    return dungeon;
}

// import DungeonCreate, { Dungeon, DungeonCreateTest } from '../../snippets/Dungeon.js';
// DungeonCreateTest();
