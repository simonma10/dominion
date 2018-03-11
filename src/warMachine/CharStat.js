import { randomIntFromInterval } from '../utils'

export class CharStat {
    constructor(str = 0, int = 0, dex = 0, wis = 0, con = 0, cha = 0){
        this.stats = [];
        this.stats.push({property:'str', value:str});
        this.stats.push({property:'int', value:int});
        this.stats.push({property:'wis', value:wis});
        this.stats.push({property:'dex', value:dex});
        this.stats.push({property:'con', value:con});
        this.stats.push({property:'cha', value:cha});
    }

    rollRandomStats (min = 3, max = 18){
        this.stats.forEach( function(stat) {
            stat.value = randomIntFromInterval(min, max);
        });
    }

    getStat (propertyName){
        for (let stat of stats){
            if(stat.property === propertyName){
                return stat.value;
            }
        }
    }

    getModifier (propertyName){
        for (let stat of this.stats){
            if(stat.property === propertyName){
                return Math.floor((stat.value - 10) / 2)
            }
        }
    }

    dump(){
        for (let stat of this.stats){
            let mod = this.getModifier(stat.property);
            let modStr="";
            if (mod < 0){
                modStr = mod.toString();
            } else {
                modStr = '+' + mod.toString();
            }
            console.log(stat.property, stat.value, modStr);
        }

    }
}