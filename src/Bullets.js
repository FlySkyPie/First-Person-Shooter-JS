import {
    Vector3, SphereGeometry,
} from 'three';
import { SphereMesh, Scene } from 'physijs-webpack/webpack'

//import { SphereMesh, Scene } from 'physijs'
import { Howl } from 'howler';

/**
 * The flying object class
 * @author David Infante, Jose Ariza, Wei Ji
 */

class Bullets {

    /**
     * @param {*} maxBullets 
     * @param {Scene} scene 
     * @param {THREE.Material} aMaterial 
     */
    constructor(maxBullets, scene, aMaterial) {
        this.material = aMaterial;
        this.objWidth = 1;
        this.maxBullets = maxBullets;
        /**
         * @type {SphereMesh[]}
         */
        this.bullets = [];
        this.launched = [];
        this.target = [];
        for (var i = 0; i < maxBullets; ++i) {
            this.launched[i] = false;
            this.target[i] = new Vector3(0, 0, 0);
            this.bullets[i] = this.createObject(i);
            scene.add(this.bullets[i]);
        }
    }

    getLaunched(i) {
        return this.launched[i];
    }

    setLaunched(i) {
        this.launched[i] = false;
    }

    getParameters(i) {
        var parameters = {
            x: this.bullets[i].position.x, y: this.bullets[i].position.y,
            z: this.bullets[i].position.z, radio: this.objWidth / 2
        };
        return parameters;
    }

    reload() {
        for (let i = 0; i < this.maxBullets; ++i) {
            this.bullets[i].remove();
            this.launched[i] = false;
            this.target[i] = new Vector3(0, 0, 0);
            this.bullets[i] = this.createObject(i);
            this.scene.add(this.bullets[i]);
        }
    }

    createObject(i) {
        const bullet = new SphereMesh(new SphereGeometry(this.objWidth / 4, 20, 20), this.material, 50);
        bullet.position.set(i, -9.5, 0.0);
        bullet.castShadow = true;
        return bullet;
    }

    setInitPosition(i) {
        this.bullets[i].position.x = i;
        this.bullets[i].position.y = -9.5;
        this.bullets[i].position.z = 0;
        this.bullets[i].__dirtyPosition = true;
    }

    shot(i, position, target, weapon) {
        this.target[i].set(target.x, target.y, target.z);
        this.bullets[i].position.set(position.x - target.x, position.y + 5, position.z - target.z);

        //Detect more collisions per second
        this.bullets[i].setCcdMotionThreshold(10);
        this.bullets[i].setCcdSweptSphereRadius(this.objWidth / 4);

        this.bullets[i].__dirtyPosition = true;
        this.launched[i] = true;

        const bulletInfo = (weapon === 0) ? {
            power: 35000,
            sound: new Howl({ src: ['sounds/m4a1_s.mp3'], volume: 0.1 }),
        } : {
            power: 50000,
            sound: new Howl({ src: ['sounds/escopeta.mp3'], volume: 0.1 })
        };

        const { power, sound } = bulletInfo;

        const fuerza = new Vector3(this.target[i].x * power, this.target[i].y * power, this.target[i].z * power);
        this.bullets[i].applyCentralImpulse(fuerza);

        sound.play();
    }
}

export default Bullets;