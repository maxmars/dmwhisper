const initialContent = {"tree":[{"id":"readme","label":"Read me first!","type":"information","data":{"textContent":"<h1>Important!</h1><p>In order to keep the loading times of this web app in check, the author decided to publish the user manual as a separate PDF file.</p><p>Grab it from here:</p><p><a href=\"https://marsiglietti.it/DMWhisper-manual-1.26.0.pdf\">https://marsiglietti.it/DMWhisper-manual-1.26.0.pdf</a></p><p>Enjoy The Whisperer!</p><p>&nbsp;</p>"}},{"id":"farm","label":"A farm just out of the town","type":"menu","data":{"textContent":"The farm just out of the town","children":[{"id":"farm-map","label":"Map of the surroundings of the farm","type":"map","data":{"textContent":"","map":{"setpiece":"farm-setpiece","density":"3","grid":"1"}}},{"id":"farm-description","label":"A description of the farm","type":"information","data":{"textContent":"<h1>Description of the farm</h1><p><strong>The farm is located between the city gates, the forest and the wizard's castle, which is located on the hill.</strong><br><i>The farm is run by an old farmer and his wife, who have a 10 year old son.</i><br><strong>The farm is surrounded by a stone wall, with a wooden gate.</strong><br><i>The house is a wooden construction with a thatched roof.</i><br><strong>The farm has a small vegetables garden, a chicken coop, a sheep pen and a pig pen. The farm also has a water well.</strong></p>"}},{"id":"events-farm","label":"The events around the farm","type":"table","data":{"textContent":"<h1>Events around the farm</h1><p><i>Note: this is an example of using a macro to substitute table rolls into descriptive rich text content.</i></p><p>Currently, this is what's happening around the farm:</p><blockquote><p>@@01</p></blockquote>","table":"farm-events"}},{"id":"npc-farm","label":"The NPCs encountered at the farm","type":"table","data":{"textContent":"NPC near the farm","table":"farm-npc"}},{"id":"weather-farm","label":"The weather around the farm","type":"table","data":{"textContent":"Typical farm weather conditions","table":"farm-weather"}},{"id":"farm-basement-dungeon","label":"The farm basement { dungeon }","type":"dungeon","data":{"textContent":"","dungeon":{"setpiece":"farm-basement","monsterSet":"farm-basement-monsters","trapSet":"farm-traps","treasureSet":"farm-basement-treasures","puzzleSet":"farm-puzzles","rooms":"5"}}}]}},{"id":"explanation","label":"Explanation of the example tables","type":"information","data":{"textContent":"<h1>The data herein is only an example of rich text content.</h1><p><i><strong>The other items in this menu are:</strong></i></p><ul><li>A rich text content page with a link to the app's manual.</li><li>An example of a sub-menu – inside of it there are a map of the surroundings of the farm, a description of the farm and three tables:&nbsp;<ul><li>The farm weather is a content of type “table”, with no rich text or other kinds of content;</li><li>Farm NPCs is a table where some values are simple strings and others are actually rolls on two other tables (NPC from Castle and NPC from Town).</li><li>The last table is that of the farm events: in it there are simple strings, rolls on the farm animals table and rolls on the farm NPC table which, as seen before, in turn contains rolls on other tables.</li></ul></li></ul>"}}],"tables":[{"id":"farm-events","description":"Farm Events","tags":["events","farm"],"rng":[{"min":1,"max":2,"result":"A sound of heavy footsteps in the woods"},{"min":3,"max":4,"result":"A group of Goblins approaching"},{"min":5,"max":8,"prefix":"NPC encounter: ","table":"farm-npc"},{"min":9,"max":11,"prefix":"You meet an animal: ","table":"farm-animals"},{"min":12,"max":12,"prefix":"Weather is changing: ","table":"farm-weather"},{"min":13,"max":15,"result":"A hum of insects coming from the woods"},{"min":16,"max":17,"result":"A whirlwind that kicks up the dust"},{"min":18,"max":18,"result":"A dull thud coming from the woods"},{"min":19,"max":20,"prefix":"Weather is changing: ","table":"farm-weather"}]},{"id":"farm-weather","description":"Weather around the farm","tags":["weather","farm"],"rng":[{"min":1,"max":1,"result":"Cold and foggy"},{"min":2,"max":4,"result":"Cool"},{"min":5,"max":8,"result":"Wind and rain"},{"min":9,"max":11,"result":"Warm and sunny"},{"min":12,"max":18,"result":"Temperate and variable"},{"min":19,"max":20,"result":"Unbearable heat"}]},{"id":"farm-npc","description":"NPCs around the farm","tags":["npc","farm"],"rng":[{"min":1,"max":1,"result":"Marius the farmer, leaning on his shovel"},{"min":2,"max":4,"prefix":"From the castle.. ","table":"castle-npc"},{"min":5,"max":8,"result":"Marius the farmer, harvesting potatoes"},{"min":9,"max":11,"result":"Evelina the peasant woman who cleans the farmyard"},{"min":12,"max":16,"result":"Raimondo the little rascal, who makes faces"},{"min":17,"max":20,"prefix":"From the city.. ","table":"city-npc"}]},{"id":"castle-npc","description":"NPCs around the castle","tags":["npc","castle"],"rng":[{"min":1,"max":1,"result":"The wizard, who looks at you curiously"},{"min":2,"max":4,"result":"Battista the butler, who looks at you suspiciously"},{"min":5,"max":8,"result":"Maria the cook, who looks at you distractedly"},{"min":9,"max":11,"result":"The castle gamekeeper"},{"min":12,"max":18,"result":"Two students of magic, disciples of the castle wizard"},{"min":19,"max":20,"result":"The wizard of the castle looking out of breath"}]},{"id":"city-npc","description":"NPCs around the city","tags":["npc","city"],"rng":[{"min":1,"max":1,"result":"The mayor's wife"},{"min":2,"max":4,"result":"The mayor"},{"min":5,"max":8,"result":"A market trader"},{"min":9,"max":11,"result":"Two city guards"},{"min":12,"max":18,"result":"A citizen who looks at you with curiosity"},{"min":19,"max":20,"result":"A schoolgirl from the city"}]},{"id":"farm-animals","description":"Animals around the farm","tags":["animals","farm"],"rng":[{"min":1,"max":1,"result":"A lone wolf, out of the woods"},{"min":2,"max":4,"result":"A stray cat purring around your legs"},{"min":5,"max":8,"result":"One of the farm dogs, barking at you"},{"min":12,"max":18,"result":"Hens squawking and chasing each other"},{"min":19,"max":20,"result":"Castle hunting dogs, chasing a rabbit"},{"min":9,"max":11,"prefix":"","table":"","postfix":"","result":"A group of sheep, looking at you with curiosity"}]}],"setpieces":[{"id":"farm-setpiece","description":"Places in the farm","tags":[],"rng":[{"min":1,"max":1,"description":"Courtyard","textContent":"<h1>Courtyard</h1><p>In this courtyard you find the following animals:</p><ul><li>@@01</li><li>@@02</li><li>@@03</li></ul>","table":"farm-animals! farm-animals! farm-animals!","minAppears":0,"maxAppears":1000,"width":1,"height":1,"imgUrl":""},{"min":2,"max":2,"description":"Booth","textContent":"<h1>Booth</h1><p>In this booth you find:</p><ul><li>@@01</li><li>@@02</li></ul>","table":"farm-animals! farm-npc!","minAppears":0,"maxAppears":1000,"width":1,"height":1,"imgUrl":""},{"min":3,"max":3,"description":"Orchard","textContent":"<h1>Orchard</h1><p>In this orchard you find an animal, @@01&nbsp;</p><p>There is also an intruder from the city: @@02</p>","table":"farm-animals! city-npc!","minAppears":0,"maxAppears":1000,"width":1,"height":1,"imgUrl":""}]}],"copiedContent":null,"clipboardAction":null,"tabPaths":["","","","",""],"lastTableContent":{},"dungeonMonsterSets":[{"id":"farm-basement-monsters","description":"Farm basement monsters","tags":[],"rng":[{"min":1,"max":30,"description":" Nothing","textContent":"<h1>Nothing</h1><p>No monsters in this room. Better luck next room!</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""},{"min":61,"max":90,"description":" Mimic","textContent":"<h1>Mimic</h1><p style=\"margin-left:0px;\"><strong>Description</strong>: Mimics are shape-shifting creatures that can take the form of inanimate objects, most commonly furniture or doors. They lie in wait, disguised as a mundane object, until an unsuspecting adventurer comes too close.</p><p style=\"margin-left:0px;\"><strong>Abilities</strong>:</p><ul><li><strong>Adhesive</strong>: A mimic’s surface is incredibly sticky, making it difficult for prey to escape once they are caught.</li><li><strong>Shapechanger</strong>: The mimic can transform into any object of similar size, making it a master of ambush.</li><li><strong>Pseudopod Attack</strong>: When in its true form, the mimic can lash out with pseudopods to bludgeon and grapple its prey.</li></ul><p style=\"margin-left:0px;\"><strong>Behavior</strong>: In a basement setting, a mimic might disguise itself as an old chest, a dusty bookshelf, or even a section of the wall. It waits patiently for someone to come close, then strikes with surprise and ferocity.</p>","minAppears":0,"maxAppears":"2","width":1,"height":1,"imgUrl":""},{"min":91,"max":100,"description":"Gelatinous Sphere","textContent":"<h1>Gelatinous Sphere</h1><p style=\"margin-left:0px;\"><strong>Description</strong>: The Gelatinous Sphere is a large, transparent ooze that moves silently through dungeons, consuming everything in its path. Its nearly invisible nature makes it a deadly trap for unwary adventurers.</p><p style=\"margin-left:0px;\"><strong>Abilities</strong>:</p><ul><li><strong>Engulf</strong>: The sphere can engulf creatures, trapping them inside its gelatinous body where they are slowly digested.</li><li><strong>Transparent</strong>: Its transparency makes it difficult to spot, especially in dimly lit environments like basements.</li><li><strong>Acidic Body</strong>: Anything that comes into contact with the sphere body is subjected to its corrosive acid, which can dissolve organic material and metal.</li></ul><p style=\"margin-left:0px;\"><strong>Behavior</strong>: In a basement, a Gelatinous Sphere might patrol the corridors, absorbing any debris or creatures it encounters. It could be lurking in a dark corner or slowly moving along the walls, making it a constant threat to anyone exploring the area.</p>","minAppears":0,"maxAppears":"2","width":1,"height":1,"imgUrl":""},{"min":31,"max":60,"description":" Shadowlurker","textContent":"<h1>Shadowlurker</h1><p style=\"margin-left:0px;\"><strong>Appearance</strong>: The Shadowlurker is a humanoid figure, but its form is shrouded in darkness. Its body seems to be made of shadows, constantly shifting and blending into the surrounding gloom. Its eyes glow with an eerie, pale light, and its movements are almost silent, making it difficult to detect.</p><p style=\"margin-left:0px;\"><strong>Abilities</strong>:</p><ul><li><strong>Shadow Blend</strong>: The Shadowlurker can merge with the shadows, becoming nearly invisible in dim light or darkness. This makes it an expert at ambushing unsuspecting adventurers.</li><li><strong>Life Drain</strong>: With a touch, the Shadowlurker can sap the life force from its victims, weakening them and healing itself in the process.</li><li><strong>Fear Aura</strong>: The presence of a Shadowlurker instills a deep sense of dread in those nearby, causing them to hesitate and potentially flee in terror.</li></ul><p style=\"margin-left:0px;\"><strong>Habitat</strong>: The Shadowlurker thrives in dark, enclosed spaces like basements, where it can easily blend into the shadows. It often haunts places with a history of sorrow or tragedy, feeding off the lingering negative emotions.</p><p style=\"margin-left:0px;\"><strong>Behavior</strong>: This creature is cunning and patient, preferring to stalk its prey from the darkness before striking. It is drawn to areas where it can find isolated victims, making a mysterious basement an ideal lair.</p><p style=\"margin-left:0px;\"><strong>Weaknesses</strong>: While formidable in the dark, the Shadowlurker is vulnerable to bright light and radiant energy, which can disrupt its shadowy form and weaken its abilities.</p>","minAppears":0,"maxAppears":"2","width":1,"height":1,"imgUrl":""}]}],"dungeonPuzzleSets":[{"id":"farm-puzzles","description":"Farm basement puzzles","tags":[],"rng":[{"min":1,"max":1,"description":"No puzzle","textContent":"<h1>No puzzle</h1><p>No puzzles in this basement room.</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""}]}],"dungeonTrapSets":[{"id":"farm-traps","description":"Traps in the farm basement","tags":[],"rng":[{"min":1,"max":49,"description":"Nothing","textContent":"<h1>Nothing</h1><p>No traps in this room. Phew!</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""},{"min":50,"max":73,"description":"Nails on the floor","textContent":"<h1>Nails on the floor</h1><p>Nasty nails lie on the floor. Presence check or suffer d4 damage.</p>","minAppears":0,"maxAppears":"2","width":1,"height":1,"imgUrl":""},{"min":74,"max":100,"description":"Bloodied iron trap","textContent":"<h1>Bloodied iron trap</h1><p style=\"margin-left:0px;\">an old, iron trap, its once sharp edges now dulled by rust and time. The metal is dark and mottled, with patches of reddish-brown corrosion spreading across its surface. The trap’s jaws are jagged and menacing, designed to snap shut with brutal force.</p><p style=\"margin-left:0px;\">Dried blood stains the iron, a grim reminder of its deadly purpose. The blood has darkened to a deep, almost black hue, contrasting starkly with the rust. The mechanism is intricate, with gears and springs that, despite their age, still look capable of delivering a swift and powerful strike.</p><p style=\"margin-left:0px;\">The trap lies partially buried in the dirt, hidden among the underbrush, waiting silently for its next victim. Its presence is both ominous and sorrowful, a relic of a time when survival often meant setting such cruel devices.</p><p style=\"margin-left:0px;\">Presence check or suffer d4 damage.</p>","minAppears":0,"maxAppears":"2","width":1,"height":1,"imgUrl":""}]}],"dungeonTreasureSets":[{"id":"farm-basement-treasures","description":"Farm basement treasures","tags":[],"rng":[{"min":1,"max":50,"description":"No treasure here","textContent":"<h1>No treasure here</h1><p>No treasure in this basement room. Too bad!</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""},{"min":51,"max":70,"description":"A few coins","textContent":"<h1>A few coins</h1><p>{2d20+5} gold coins. Whohoo!</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""},{"min":71,"max":100,"description":"A freaking gem!","textContent":"<h1>A freaking gem!</h1><p>Hmmm.. Wonder how much it's worth..</p>","minAppears":0,"maxAppears":"100","width":1,"height":1,"imgUrl":""}]}],"dungeonSetpieces":[{"id":"farm-basement","description":"The mysterious farm basement","tags":[],"rng":[{"description":"farm-basement-hallway","textContent":"<h1>Basement hallway</h1><p style=\"margin-left:0px;\">Imagine stepping into a dimly lit basement hallway. The air is cool and slightly damp, carrying a faint, musty scent. The walls are lined with old, weathered bricks, some of which are covered in creeping ivy that seems to thrive in the shadows.</p><p style=\"margin-left:0px;\">Flickering candle light casts eerie, dancing shadows that play tricks on your eyes. The floor is made of uneven stone tiles, and your footsteps echo softly as you walk.</p><p style=\"margin-left:0px;\">Along the hallway, there are several heavy wooden doors, each with rusted iron handles and hinges that creak ominously when moved. Some doors are slightly ajar, revealing glimpses of dark, unknown rooms beyond.</p><p style=\"margin-left:0px;\">At the far end of the hallway, a faint, almost imperceptible sound can be heard – perhaps the distant drip of water or the soft whisper of a draft. The atmosphere is thick with mystery, making you wonder what secrets this basement hallway holds.</p><p style=\"margin-left:0px;\">What do you think might be behind those doors?</p>","minAppears":0,"maxAppears":100,"positionInDungeon":"start","appearanceRate":"common","width":1,"height":1,"imgUrl":""},{"description":"farm-basement-library","textContent":"<h1>Basement library</h1><p style=\"margin-left:0px;\">The walls are lined with ancient, dusty shelves filled with forgotten relics: old books with cracked spines, glass jars containing unidentifiable substances, and peculiar trinkets that seem to whisper secrets of the past. In one corner, an antique wooden chest sits, its surface covered in cobwebs, hinting at treasures or mysteries locked away inside.</p>","minAppears":0,"maxAppears":"1","positionInDungeon":"middle","appearanceRate":"common","width":1,"height":1,"imgUrl":""},{"description":"farm-basement-laundry","textContent":"<h1>Basement laundry</h1><p>Picture a mysterious basement laundry room. The entrance is marked by a heavy, wooden door that groans as it opens. Inside, the room is dimly lit by a single, flickering fluorescent light, casting long, wavering shadows across the space.</p><p>The walls are made of rough, unfinished concrete, cold to the touch and slightly damp. In one corner, an old, rusted washing machine stands, its surface covered in a thin layer of dust and cobwebs. Next to it, a matching dryer, equally ancient, sits silently, as if holding its breath.</p><p>A large, deep sink made of stained porcelain is mounted against one wall, with a dripping faucet that echoes softly in the stillness. Above the sink, a small, grimy window lets in just enough light to create eerie patterns on the floor.</p><p>Shelves line one wall, cluttered with mysterious bottles and boxes, their labels faded and unreadable. An old ironing board, its cover worn and tattered, leans against the wall, and a basket of laundry, filled with clothes that seem decades old, sits untouched in the corner.</p><p>The air is thick with the scent of mildew and detergent, mingling to create an oddly nostalgic aroma. As you stand in the room, you can’t shake the feeling that you’re not alone, that the shadows are watching, and that the laundry room holds secrets long forgotten.</p><p>What do you think might be hidden among those old bottles and boxes?</p>","minAppears":0,"maxAppears":"1","positionInDungeon":"middle","appearanceRate":"common","width":1,"height":1,"imgUrl":""},{"description":"farm-basement-tools-room","textContent":"<h1>Basement room</h1><p>The walls are lined with rough-hewn stone, and wooden beams support the low ceiling, giving the room a rustic, yet sturdy feel. In one corner, you see a large wooden workbench, its surface scarred from years of use. Scattered across it are various tools: rusted sickles, heavy hammers, and iron tongs, each telling a story of hard labor and craftsmanship.</p><p>Hanging from the walls are more tools, some recognizable, like hoes and shovels, while others are more enigmatic, their purposes lost to time. A large, iron-bound chest sits against one wall, its lock long since broken. Inside, you find old farming ledgers, mysterious trinkets, and perhaps even a hidden compartment containing a long-forgotten treasure.</p><p>In another corner, a pile of straw and old sacks hint at the room’s use for storage. Among them, you might find ancient seeds, dried herbs, and remnants of past harvests. The room is filled with shadows, and the faint sound of dripping water echoes from somewhere deeper within the basement, adding to the sense of mystery.</p><p>This room, with its blend of the familiar and the unknown, feels like a portal to another time, where every object has a story waiting to be uncovered. What secrets do you think this mysterious basement holds?</p>","minAppears":0,"maxAppears":"1","positionInDungeon":"middle","appearanceRate":"common","width":1,"height":1,"imgUrl":""},{"description":"farm-basement-chapel","textContent":"<h1>Basement chapel</h1><p>Imagine descending into a hidden basement beneath an ancient medieval farm, where you discover a small, mysterious chapel. The air is cool and carries a faint scent of incense and aged stone. As you step down the narrow, winding staircase, the flickering light from your torch reveals a room filled with an aura of reverence and mystery.</p><p>The chapel is modest, with rough-hewn stone walls and a low, vaulted ceiling supported by wooden beams. At the far end, an altar stands, carved from a single piece of stone, adorned with faded religious symbols and intricate carvings. A simple wooden cross hangs above it, casting long shadows in the dim light.</p><p>On either side of the altar, you see ancient wooden pews, their surfaces worn smooth by centuries of use. The floor is made of uneven stone slabs, and a few scattered rushes hint at the room’s age. Small, narrow windows high up on the walls allow slivers of light to penetrate, creating an ethereal glow that dances across the room.</p><p>The walls are adorned with faded frescoes, depicting scenes of saints and biblical stories, their colors muted by time but still hinting at their former glory. In one corner, a small alcove holds a statue of a saint, its features softened by the passage of time. Nearby, a wrought-iron candelabrum stands, its candles long since melted away, leaving only hardened wax drippings as a testament to past vigils.</p><p>A sense of tranquility and mystery pervades the space, as if it holds secrets and stories from a bygone era. The faint sound of dripping water echoes from somewhere deeper within the basement, adding to the chapel’s enigmatic atmosphere.</p>","minAppears":0,"maxAppears":"1","positionInDungeon":"end","appearanceRate":"common","width":1,"height":1,"imgUrl":""}]}],"dungeonExploreDefaults":{"setpiece":"","monsterset":"","treasureset":"","trapset":"","puzzleset":"","numberOfRooms":10}}

export default initialContent;
