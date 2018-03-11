export function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
};

export function randomBool(){
    return Math.random() > 0.5;
}

