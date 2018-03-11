import { randomIntFromInterval } from '../utils'

export default class Battle {
    constructor(sideA, sideB){
        this.sideA = sideA;
        this.sideB = sideB;
        this.modifiedBRsideA = sideA.battleRating;
        this.modifiedBRsideB = sideB.battleRating;
        this.battleResults=[];

        this.battlefieldModiferValues = {
            'dominionOfLiege': 10,           // +10 if force is in the dominion of their liege
            'beatenFoeBefore': 10,           // +10 if they have beaten this foe before
            'troopClass': 10,                // +10 if troop class is 2 levels higher than the enemy
            'attackOnTheMarch': 30,          // +30 if attacking an enemy on the march
            'allyRouted': -10,               // -10 if any accompanying force has routed
            'favourableEnv': 25,             // +25 if extremely favourable environment
            'unfavourableEnv': -25,          // -25 if extremely unfavourable environment
            'infravisionNight': 20,          // +20 if night battle and entire force has infravision
            'higher': 20,                    // +20 if higher than opponent
            'halflingFieldsWoods': 20,       // +20 for halfling force in fields or woods
            'elvenWoods': 10,                // +10 for elven force in woods
            'dwarvenHillsMtns': 20,          // +20 for dwarven force in hills or mountains
            'mountedConstrained': -20,       // -20 for mounted force in mountains, woods or stronghold
            'mire': -20,                     // -20 for force in mire (mud or marsh)
            'shifting': -10,                 // -10 for force in shifting ground (snow/sand)
            'defendInPlace': 10,             // +10 if defending in place
            'defendDefile': 50,              // +50 if defending narrow defile, pass or bridge
            'deepWater': 40,                 // +40 if attacker must cross deep water
            'defendWall': 20,                // +20 if defending in mountains, hills, rough terrain or behind wall
            'stronghold': 50,                // +50 if force is in a stronghold
            'immuneFull': 150,               // +150 if force is immune to enemy's attacks
            'immune1pc': 50,                 // + 50 if 1% of force is immune to enemy's attacks
            'immune80pc': 50,                // +50 if force is immune to 80% of enemy's attacks
            'moderateFatigue': -10,          // -10 if force is moderately fatigued
            'seriousFatigue': -30            // -30 if force is seriously fatigued
        }
        /*console.log("##############################");
        console.log("###  Let Battle Commence!  ###");
        console.log("##############################");*/
        this.writeResult("Let Battle Commence!");
        this.calculateModifiedBR(sideA, sideB);
        this.calculateResults(sideA, sideB);
    }

    calculateModifiedBR(sideA, sideB){

        //==================================================================================
        // Calculate Troop Ratio
        //==================================================================================
        let troopNumberSideA = sideA.totalTroops;
        let troopNumberSideB = sideB.totalTroops;
        /*console.log('Side A has ', troopNumberSideA, 'troops');
        console.log('Side B has ', troopNumberSideB, 'troops');*/

        if (troopNumberSideA > troopNumberSideB){
            let troopRatio = troopNumberSideA / troopNumberSideB
            this.modifiedBRsideA += this.getTroopRatioBonus(troopRatio);
            console.log('Troop Ratio is ', Number(troopRatio).toFixed(2), ' to 1 in favour of Side A');
            this.writeResult("The troop ratio is " + Number(troopRatio).toFixed(2) + " to 1 in favour of Side A");
        } else {
            let troopRatio = troopNumberSideB / troopNumberSideA
            this.modifiedBRsideB += this.getTroopRatioBonus(troopRatio);
            console.log('Troop Ratio is ', Number(troopRatio).toFixed(2), ' to 1 in favour of Side B');
            this.writeResult("The troop ratio is " + Number(troopRatio).toFixed(2) + " to 1 in favour of Side B");
        }

        //==================================================================================
        // Calculate other modifiers (morale, environment, terrain, immunities, fatigue)
        //==================================================================================
        this.modifiedBRsideA += this.calculateBattlefieldModifiers(sideA);
        this.modifiedBRsideB += this.calculateBattlefieldModifiers(sideB);

        //==================================================================================
        // display modified BR
        //==================================================================================
        console.log('Side A modified Battle Rating: ', this.modifiedBRsideA);
        console.log('Side B modified Battle Rating: ', this.modifiedBRsideB);
        this.writeResult("Side A modified Battle Rating: " + this.modifiedBRsideA.toString());
        this.writeResult("Side B modified Battle Rating: " + this.modifiedBRsideB.toString());
    }

    getTroopRatioBonus(troopRatio){
        if(troopRatio <= 1.5){
            return 15;
        } else if (troopRatio <= 2){
            return 30;
        } else if (troopRatio <= 3){
            return 45;
        } else if (troopRatio <= 4){
            return 60;
        } else if (troopRatio <= 5){
            return 70;
        } else if (troopRatio <= 6){
            return 80;
        } else if (troopRatio <= 7){
            return 90;
        } else if (troopRatio <= 8 || troopRatio > 8){
            return 100;
        } else {
            return 0;
        }
    }

    calculateBattlefieldModifiers(side){
        let modifierValue = 0;
        for (let property in side.battlefieldModifiers){
            if (side.battlefieldModifiers[property]){
                console.log(property, this.battlefieldModiferValues[property]);
                modifierValue += this.battlefieldModiferValues[property];
            }
        }
        return modifierValue;
    }


    calculateResults(sideA, sideB){
        let difference = 0;
        let d100SideA = randomIntFromInterval(1,100);
        let d100SideB = randomIntFromInterval(1,100);
/*        console.log('Side A rolls d% - ', d100SideA);
        console.log('Side B rolls d% - ', d100SideB);*/
        this.writeResult("Side A rolls d% - " + d100SideA.toString());
        this.writeResult("Side B rolls d% - " + d100SideB.toString());


        this.modifiedBRsideA += d100SideA;
        this.modifiedBRsideB += d100SideB;

/*
        console.log('__Final Scores__');
        console.log('Side A:', this.modifiedBRsideA);
        console.log('Side B:', this.modifiedBRsideB);
*/
        this.writeResult("=== Final Scores ===");
        this.writeResult("Side A: " + this.modifiedBRsideA.toString());
        this.writeResult("Side B: " + this.modifiedBRsideB.toString());

        if (this.modifiedBRsideA > this.modifiedBRsideB){
            difference = this.modifiedBRsideA - this.modifiedBRsideB;
            //console.log('Side A wins! Difference is', this.modifiedBRsideA - this.modifiedBRsideB);
            this.writeResult("Side A wins!  Difference in scores is " + (difference).toString());
            this.getCombatResults(sideA, sideB, difference)
        } else {
            difference = this.modifiedBRsideB - this.modifiedBRsideA;
            //console.log('Side B wins! Difference is', this.modifiedBRsideB - this.modifiedBRsideA);
            this.writeResult("Side B wins!  Difference in scores is " + (difference).toString());
            this.getCombatResults(sideB, sideA, difference)
        }

    }

    getCombatResults(winner, loser, diff){
        // percentage losses (winner, loser)
        // fatigue( 0 = none, 5 = moderate, 10 = serious, 99 = rout, 100 = destroyed)
        // location (1 = F, -1 = R, -99 = rout, -100 = destroyed)
        let result = [0,0,0,0,0,0];

        if (diff <=  8){
            result = [0,10,0,0,1,-1];
        } else if (diff <= 15){
            result = [0,20,0,0,1,-1];
        } else if (diff <= 24){
            result = [10,20,0,5,1,-1];
        } else if (diff <= 30){
            result = [10,30,0,5,1,-2];
        } else if (diff <= 38){
            result = [20,40,5,10,-1,-1];
        } else if (diff <= 50){
            result = [0,30,0,10,1,-3];
        } else if (diff <= 63){
            result = [20,50,5,10,2,-4];
        } else if (diff <= 80){
            result = [30,60,5,10,2,-4];
        } else if (diff <= 90){
            result = [10,50,0,10,4,-3];
        } else if (diff <= 100){
            result = [0,30,0,99,4,-99];
        } else if (diff <= 120){
            result = [20,70,0,99,4,-99];
        } else if (diff <= 150){
            result = [10,10,0,99,4,-99];
        } else if (diff > 150){
            result = [10,100,0,100,6,-100];
        }

        this.takeCasualties(winner, result[0], loser, result[1]);
        this.setFatigue(winner, result[2], loser, result[3]);
        this.setLocation(winner, result[4], loser, result[5]);
    }


    takeCasualties(winner, winnerPercent, loser, loserPercent){
        this.writeResult('Winner takes ' + winnerPercent.toString() + '% casualties');
        this.writeResult('Loser takes ' + loserPercent.toString() + '% casualties');
    }

    setFatigue(winner, winnerFatigue, loser, loserFatigue){
        this.writeResult('Winner ' + this.getFatigueString(winner, winnerFatigue));
        this.writeResult('Loser ' + this.getFatigueString(loser, loserFatigue));
    }

    setLocation(winner, winnerLocation, loser, loserLocation){
        this.writeResult('Winner ' + this.getLocationString(winner, winnerLocation));
        this.writeResult('Loser ' + this.getLocationString(loser, loserLocation));
    }

    getFatigueString(side, fatigueCode){
        switch (fatigueCode){
            case 0:
                return "is not fatigued.";
            case 5:
                return "is moderately fatigued";
            case 10:
                return "is seriously fatigued.";
            case 99:
                return "has been routed!";
            case 100:
                return "has been destroyed!";
        }
    }

    getLocationString(side, locationCode){
        let locationString = "";

        if (locationCode === -1) {
            locationString = "must retreat from the battlefield"
        } else if (locationCode === -99){
            locationString = "has been routed!";
        } else if (locationCode === -100){
            locationString = "has been destroyed!";
        } else if (locationCode < -1){
            locationString = "must retreat " + (Math.abs(locationCode) - 1).toString() + " terrain units";
        } else if (locationCode === 1) {
            locationString = "holds the battlefield.";
        } else if (locationCode > 1) {
            locationString = "may advance " + (Math.abs(locationCode) - 1).toString() + " terrain units";;
        }
        return locationString;
    }


    writeResult(string){
        this.battleResults.push(string);
    }

}