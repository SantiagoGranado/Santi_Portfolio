import Phaser from "../lib/phaser.js";

export default class Scene extends Phaser.Scene
{
    constructor(name)
    {
        super(name);
    }

    init()
    {
        this.activeEntities = [];
        this.entityMap = new Map();
    }

    addEntity(entity, autoActivate = true)
    {
        if(!this.entityMap.has(entity.getName()))
        {
            this.entityMap.set(entity.getName(),entity);
            if(autoActivate)
                this.activeEntities.push(entity);
        }
        else
            console.error("Duplicate entity "+entity.getName());

    }

    deleteEntity(entity)
    {
        this.deactivateEntity(entity);
    }

    activateEntity(entity)
    {
        var index = this.activeEntities.indexOf(entity);
        if (index == -1) {
            this.activeEntities.push(entity);
        }
        else
            console.error("Entity is already active "+entity.getName());
        this.start();
    }

    deactivateEntity(entity)
    {
        var index = this.activeEntities.indexOf(entity);
        if (index > -1) {
            this.activeEntities.splice(index, 1);
        }
    }

    findEntityByName(name)
    {
        return this.entityMap.get(name);
    }

    start ()
    {

        for(var i = 0; i < this.activeEntities.length; i++ )
        {
            this.activeEntities[i].start();
        }
    }

    update (time, delta)
    {
        for(var i = 0; i < this.activeEntities.length; i++ )
        {
            this.activeEntities[i].update(time,delta);
        }
    }
}
