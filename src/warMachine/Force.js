import { Leader } from './Leader';
import Troop, { troopConfig, troopTypes, race } from './Troop';
import { randomIntFromInterval } from "../utils";

export const forceConfig = {
    'numberOfVictories' : 7,            //number of victories in last 10 years (max 10)
    'numberOfRouts': 0,                 //number of routs in last 10 years (max 10)
    'weeksTrained': 0,                  //weeks of training in the last 12 months
    'weeksTrainedWithLeader': 0,        //weeks of training with leader
    'monthsOnDuty': 0,                  //months force remains together
    'weaponQuality': 5,                 //5, 10 or 15: average, good, excellent (good = 2x cost, excellent = 3x cost)
    'secondWeapon': false,              //true if troops carry a second weapon of equal or better quality as first
    'armorQuality': false,              //true if AC >= 5
    'elvenOrDwarven': false,            //true if force is all Elven or Dwarven
    'percentSpecialMonsterTroops':0,    //percentage of troops with 2 or more * next to Hit Dice

}

export default class Force {
    constructor(randomise = true, config = forceConfig){
        for (let item in config){
            if(config.hasOwnProperty(item)){
                this[item] = config[item];
            }
        }

        this.leader = config.leader || new Leader();
        this.units = config.units || [];
        this.officers = config.officers || [];
        this.totalTroops = 0;
        this.basicForceRating = 0;
        this.troopClass = "";
        this.fatigue = "none";      // none, moderate or serious

     /*   this.numberOfVictories = config.numberOfVictories || 0;
        this.numberOfRouts = randomIntFromInterval(0, 5);
        this.weeksTrained = randomIntFromInterval(0,20);
        this.weeksTrainedWithLeader = randomIntFromInterval(0, this.weeksTrained);
        this.monthsOnDuty = randomIntFromInterval(0, 12);
        this.weaponQuality = randomIntFromInterval(1,3) * 5;
        this.secondWeapon = false;
        this.armorQuality = true;
        this.elvenOrDwarven = false;
        this.percentOfNameLevelTroops = 0;
        this.percentSpecialMonsterTroops = randomIntFromInterval(0, 25);*/

        this.battleRating = 0;
        this.battleRatingBonusTests = {
            "mounted20pc": false,       // 20% or more of force is mounted
            "mounted50pc": false,       // 50% or more of force is mounted
            "missile20pc": false,       // 20% or more of force can use missile weapons
            "missilesRange":false,      // 20% or more of force can use missiles to a range of 100' or more
            "magical1pc": false,        // 1% or more of force has magical abilities
            "magical20pc": false,       // 20% or more of force has magical abilities
            "magical100pc": false,      // 100% of force has magical abilities
            "spells5pc": false,         // 5% or more of force can use spells
            "spells30pc": false,        // 30% or more of force can use spells
            "flying1pc": false,         // 1% or more of force can fly
            "flying20pc": false,        // 20% or more of force can use spells
            "fastMovement": false              // The force has an average movement rate of 100' per turn
            };

        this.battlefieldModifiers = {
            'dominionOfLiege':false,        // +10 if force is in the dominion of their liege
            'beatenFoeBefore':false,        // +10 if they have beaten this foe before
            'troopClass':false,             // +10 if troop class is 2 levels higher than the enemy
            'attackOnTheMarch':false,       // +30 if attacking an enemy on the march
            'allyRouted':false,             // -10 if any accompanying force has routed
            'favourableEnv':false,          // +25 if extremely favourable environment
            'unfavourableEnv':false,        // -25 if extremely unfavourable environment
            'infravisionNight':false,       // +20 if night battle and entire force has infravision
            'higher':false,                 // +20 if higher than opponent
            'halflingFieldsWoods':false,    // +20 for halfling force in fields or woods
            'elvenWoods':false,             // +10 for elven force in woods
            'dwarvenHillsMtns':false,       // +20 for dwarven force in hills or mountains
            'mountedConstrained':false,     // -20 for mounted force in mountains, woods or stronghold
            'mire':false,                   // -20 for force in mire (mud or marsh)
            'shifting':false,               // -10 for force in shifting ground (snow/sand)
            'defendInPlace':false,          // +10 if defending in place
            'defendDefile':false,           // +50 if defending narrow defile, pass or bridge
            'deepWater':false,              // +40 if attacker must cross deep water
            'defendWall':false,             // +20 if defending in mountains, hills, rough terrain or behind wall
            'stronghold':false,             // +50 if force is in a stronghold
            'immuneFull':false,             // +150 if force is immune to enemy's attacks
            'immune1pc':false,              // + 50 if 1% of force is immune to enemy's attacks
            'immune80pc':false,             // +50 if force is immune to 80% of enemy's attacks
            'moderateFatigue':false,        // -10 if force is moderately fatigued
            'seriousFatigue':false          // -30 if force is seriously fatigued
        }

        if(randomise){
            this.numberOfVictories = randomIntFromInterval(1, 10);
            this.numberOfRouts = randomIntFromInterval(0, 5);
            this.weeksTrained = randomIntFromInterval(5, 25);
            this.weeksTrainedWithLeader = randomIntFromInterval(0, this.weeksTrained);
            this.monthsOnDuty = randomIntFromInterval(0, 12);
            this.weaponQuality = randomIntFromInterval(1,3) * 5;
            this.secondWeapon = false;
            this.armorQuality = true;
            this.elvenOrDwarven = false;
            this.fatigue = "none";
            this.generateUnits();
            this.generateOfficers();
        }

        this.calculateBasicForceRating();
        this.calculateTroopClass();
        this.calculateBattleRating();
        this.dump();

    }

    calculateBasicForceRating(debug = true) {

        // calculate factors
        let totalElvenDwarven = 0;
        let totalSpecial = 0;
        let totalName = 0;
        this.units.forEach( (unit) => {
            this.totalTroops += unit.quantity;

            if (unit.troop.race === race.DWARF || unit.troop.race === race.ELF){
                totalElvenDwarven += unit.quantity
            }
            if (unit.troop.specialMonster) {
                totalSpecial += unit.quantity;
            }
            if (unit.troop.level >= 9) {
                totalName += unit.quantity;
            }
        });
        if (totalElvenDwarven === this.totalTroops){this.elvenOrDwarven = true};
        console.log(this.totalTroops, totalSpecial, totalName);
        this.percentSpecialMonsterTroops = totalSpecial === 0 ? 0 : Math.floor(this.totalTroops / totalSpecial) * 100;
        this.percentOfNameLevelTroops = totalName === 0 ? 0:  Math.floor(this.totalTroops / totalName ) * 100;


        let leadershipFactor = this.leader.leadershipFactor + (this.percentOfNameLevelTroops * 2);
        let experienceFactor = (this.getAverageOfficerLevel() * 3)
            + (this.getAverageTroopLevel() * 2)
            + this.numberOfVictories
            - this.numberOfRouts;
        let trainingFactor = this.weeksTrained + this.weeksTrainedWithLeader + this.monthsOnDuty;
        let equipmentFactor = this.weaponQuality + (this.secondWeapon ? 5 : 0) + (this.armorQuality ? 5 : 0);
        let specialTroopFactor = this.elvenOrDwarven ? 15 : this.percentSpecialMonsterTroops * 2;

        this.basicForceRating = leadershipFactor + experienceFactor + trainingFactor + equipmentFactor + specialTroopFactor;

        if (debug){
            console.log('=== Basic Force Rating ===');
            console.log ('Leadership Factor:', leadershipFactor);
            console.log ('Experience Factor:', experienceFactor);
            console.log ('Training Factor:', trainingFactor);
            console.log ('Equipment Factor:', equipmentFactor);
            console.log ('Special Troop Factor:', specialTroopFactor);
        }
        console.log('BFR: ', this.basicForceRating);
    }

    generateOfficers(numberOfOfficers = 20) {
        for(let i = 0; i < numberOfOfficers; i++){
            //let randomLevel = randomIntFromInterval(4, 12);
            //let hp = randomLevel * 8;
            let config = troopConfig;
            config.level = randomIntFromInterval(4, 12);
            config.hp = config.level * 8;
            config.troopType = troopTypes.OFFICER;
            this.officers.push(new Troop(config));
        }
    }

    getAverageOfficerLevel(){
        let total = 0;
        for (let i = 0; i < this.officers.length; i++){
            total += this.officers[i].level;
        }
        return Math.floor(total / this.officers.length);
    }

    generateUnits(numberOfUnits = 3){
        for (let i = 0; i < numberOfUnits; i++){
            let unit = {};
            let config = troopConfig;
            config.level = randomIntFromInterval(1, 3);
            config.hp = config.level * 8;
            config.troopType = troopTypes.TROOP;
            unit.troop = new Troop(config);
            unit.troop.randomise();
            unit.quantity = randomIntFromInterval(100, 1000);
            console.log('new unit, qty', unit.quantity, 'level', unit.troop.level);
            this.units.push(unit);
        }
    }

    getAverageTroopLevel(){
        let totalLevels = 0;
        let totalTroops = 0;
        for (let i = 0; i < this.units.length; i++){
            let unit = this.units[i];
            totalTroops += unit.quantity;
            totalLevels += (unit.troop.level * unit.quantity);
        }
        return Math.floor(totalLevels / totalTroops);
    }

    calculateTroopClass(){
        let bfr = this.basicForceRating;
        if (bfr <= 20){
            this.troopClass = "Untrained"
        } else if (bfr <= 35){
            this.troopClass = "Poor"
        } else if (bfr <= 55){
            this.troopClass = "Below Average"
        } else if (bfr <= 70){
            this.troopClass = "Fair"
        } else if (bfr <= 80){
            this.troopClass = "Average"
        } else if (bfr <= 100){
            this.troopClass = "Good"
        } else if (bfr <= 125) {
            this.troopClass = "Excellent"
        } else if (bfr > 125) {
            this.troopClass = "Elite"
        } else {
            this.troopClass = "Unknown"
        }
        console.log('Troop Class:', this.troopClass);
    }

    calculateBattleRating(){
        this.calculateBattleRatingBonuses();
        let bonus = Math.ceil(this.basicForceRating / 10);
        console.log('Bonus (BFR/10):', bonus);
        let bonusCount = 0;
        for (let key in this.battleRatingBonusTests){
            if (this.battleRatingBonusTests.hasOwnProperty(key)){
                //console.log(key, this.battleRatingBonusTests[key]);
                if (this.battleRatingBonusTests[key]){
                    bonusCount += 1;
                }
            }
        }
        console.log('Applying ' + bonusCount + ' bonuses.');
        this.battleRating = this.basicForceRating + (bonusCount * bonus);
        console.log('Battle Rating (BR):', this.battleRating);
    }


    calculateBattleRatingBonuses(debug = true){
        let totalMounted = 0;
        let totalMissiles = 0;
        let totalMissilesRange = 0;
        let totalMagical = 0;
        let totalSpells = 0;
        let totalFlying = 0;
        let totalFast = 0;
        this.units.forEach( (unit) => {
            if (unit.troop.mounted){
                totalMounted += unit.quantity
            }
            if (unit.troop.missiles) {
                totalMissiles += unit.quantity;
            }
            if (unit.troop.missilesRange) {
                totalMissilesRange += unit.quantity;
            }
            if (unit.troop.magicalAbilities) {
                totalMagical += unit.quantity;
            }
            if(unit.troop.spellCaster){
                totalSpells += unit.quantity;
            }
            if (unit.troop.flying) {
                totalFlying += unit.quantity;
            }
            if (unit.troop.fastMovement) {
                totalFast += unit.quantity;
            }
        });

        if(debug){
            console.log('=== Battle Rating Bonuses ===');
            console.log('Mounted:',totalMounted,'/',this.totalTroops);
            console.log('Missiles:',totalMissiles,'/',this.totalTroops);
            console.log('Missiles @ Range:',totalMissilesRange,'/',this.totalTroops);
            console.log('Magical:',totalMagical,'/',this.totalTroops);
            console.log('Spellcasters:',totalSpells,'/',this.totalTroops);
            console.log('Flying:',totalFlying,'/',this.totalTroops);
            console.log('Fast Mvmt:',totalFast,'/',this.totalTroops);
        }

        if (totalMounted > 0){
            if ((totalMounted / this.totalTroops) > 0.2 ){
                this.battleRatingBonusTests.mounted20pc = true;
            }
            if ((totalMounted / this.totalTroops) > 0.5 ){
                this.battleRatingBonusTests.mounted50pc = true;
            }
        }
        if (totalMissiles > 0){
            if ((totalMissiles / this.totalTroops) > 0.2){
                this.battleRatingBonusTests.missile20pc = true;
            }
        }
        if (totalMissilesRange > 0){
            if ((totalMissilesRange / this.totalTroops) > 0.2){
                this.battleRatingBonusTests.missilesRange = true;
            }
        }
        if (totalMagical > 0){
            if ((totalMagical / this.totalTroops) > 0.01){
                this.battleRatingBonusTests.magical1pc = true;
            }
            if ((totalMagical / this.totalTroops) > 0.2){
                this.battleRatingBonusTests.magical20pc = true;
            }
            if ((totalMagical / this.totalTroops) === 1){
                this.battleRatingBonusTests.magical100pc = true;
            }
        }
        if (totalSpells > 0){
            if ((totalSpells / this.totalTroops) > 0.05){
                this.battleRatingBonusTests.spells5pc = true;
            }
            if ((totalSpells / this.totalTroops) > 0.3){
                this.battleRatingBonusTests.spells30pc = true;
            }
        }
        if (totalFlying > 0){
            if ((totalFlying / this.totalTroops) > 0.01){
                this.battleRatingBonusTests.flying1pc = true;
            }
            if ((totalFlying / this.totalTroops) > 0.2){
                this.battleRatingBonusTests.flying20pc = true;
            }
        }
        if(totalFast === this.totalTroops){
            this.battleRatingBonusTests.fastMovement = true;

        }
        console.table(this.battleRatingBonusTests);

    }

    dump(){
        console.table(this);
    }



}