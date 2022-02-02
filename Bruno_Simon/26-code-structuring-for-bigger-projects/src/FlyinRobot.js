import Robot from './Robot'

export default class FlyingRobot extends Robot
{
    constructor(name, legs)
    {
        super(name, legs)
    }

    takeOff()
    {
        console.log(`Have a good flight ${this.name}`);
    }

    land()
    {
        console.log(`Welcome back ${this.name}`);
    }
}