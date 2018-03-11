import { randomIntFromInterval } from '../utils'

export default class Battle {
    constructor(sideA, sideB){
        this.sideA = sideA;
        this.sideB = sideB;
        this.modifiedBRsideA = sideA.battleRating;
        this.modifiedBRsideB = sideB.battleRating;
        this.battleResults=[];
        /*console.log("##############################");
        console.log("###  Let Battle Commence!  ###");
        console.log("##############################");*/
        this.writeResult("Let Battle Commence!");
        this.calculateModifiedBR(sideA, sideB);
        this.calculateResults();
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


    calculateResults(){
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
            //console.log('Side A wins! Difference is', this.modifiedBRsideA - this.modifiedBRsideB);
            this.writeResult("Side A wins!  Difference in scores is " +
                (this.modifiedBRsideA - this.modifiedBRsideB).toString());
        } else {
            //console.log('Side B wins! Difference is', this.modifiedBRsideB - this.modifiedBRsideA);
            this.writeResult("Side B wins!  Difference in scores is " +
                (this.modifiedBRsideB - this.modifiedBRsideA).toString());
        }
    }

    writeResult(string){
        this.battleResults.push(string);
    }

}