import Troop, { troopConfig, troopTypes } from './Troop';
import { randomIntFromInterval } from '../utils';
import {CharStat} from "./CharStat";

export class Leader extends Troop{
    constructor(title = "Sir", name = "Anonymous"){
        super(troopConfig);
        this.level = randomIntFromInterval(9, 16);
        this.hp = this.level * randomIntFromInterval(6, 10);

        this.charStat = new CharStat();
        this.charStat.rollRandomStats();


        this.leadershipFactor = this.level + this.charStat.getModifier('int') + this.charStat.getModifier('wis') + this.charStat.getModifier('cha');
        this.leaderTitle = title;
        this.leaderName = name;
        this.troopType = troopTypes.LEADER;

        console.log('=== Force Leader ===');
        console.log(this.leaderTitle + " " + this.leaderName + ", level: " + this.level + ", hp: " + this.hp + ", leadership: " + this.leadershipFactor);
    }

}