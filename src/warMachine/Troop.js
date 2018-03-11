import {randomBool, randomIntFromInterval} from "../utils";

export const troopTypes =  {
    UNKNOWN: 'Unknown',
    OFFICER: 'Officer',
    LEADER: 'Leader',
    TROOP: 'Troop'
}

export const race = {
    HUMAN: 'Human',
    DWARF: 'Dwarf',
    ELF: 'Elf',
    SPECIAL: 'Special',
    OTHER: 'Other',
    UNKNOWN: 'Unknown'
}


export const troopConfig = {
    troopType: troopTypes.UNKNOWN,
    hp: 8,
    level: 1,
    weaponQuality: "average",
    secondWeapon: false,
    armorQuality: "average",
    race: race.HUMAN,
    specialMonster: false,
    mounted: false,
    missiles: false,
    missilesRange: false,
    flying: false,
    magicalAbilities: false,
    spellCaster: false,
    fastMovement: false
};

export default class Troop {

    constructor (config = troopConfig) {

        for (let item in config){
            if(config.hasOwnProperty(item)){
                this[item] = config[item];
            }
        }
    }

    randomise(){
        this.secondWeapon = randomBool();
        this.specialMonster = randomBool();
        this.mounted = randomBool();
        this.missiles = randomBool();
        this.missilesRange = randomBool();
        this.flying = randomBool();
        this.magicalAbilities = randomBool();
        this.spellCaster = randomBool();
        this.fastMovement = randomBool();
        if(randomBool()){
            this.race = race.DWARF;
        }
        this.level = randomIntFromInterval(1, 4);
        this.hp = this.level * 8;
    }

    dump () {
        console.table(this);
    }
}


