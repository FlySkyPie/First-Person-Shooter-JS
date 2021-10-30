import {
  TextureLoader, MeshPhongMaterial, Vector3, AmbientLight, SpotLight, Object3D
} from 'three';
import * as Physijs from 'physijs-webpack/browserify';
//import Physijs from 'physijs'

import Avatar from './Avatar';
import Bullets from './Bullets';
import Crosshair from './Crosshair';
import Enemies from './Enemies';
import Map from './Map';
import Skybox from './Skybox';
import { updateAmmo, updateLevel, updateScore } from './misc';

/**
 * The Model Facade class. The root node of the graph.
 * @author David Infante, Jose Ariza, Wei Ji
 */

class Scene extends Physijs.Scene {

  /**
   * 
   * @param {THREE.WebGLRenderer} renderer 
   * @param {THREE.PerspectiveCamera} aCamera 
   * @param {PointerLockControls} controls
   * @param {MoveController} moveController
   */
  constructor(renderer, aCamera, controls, moveController) {
    super();
    this.setGravity(new Vector3(0, -50, 0));

    /**
     * @type {THREE.PerspectiveCamera}
     */
    this.camera = aCamera;

    this.controls = controls;
    this.createCrosshair(renderer);

    this.avatar = new Avatar(this.camera, this, controls, moveController);

    /**
     * @type {Map}
     */
    this.map = null;
    this.enemies = new Enemies(this, this.level);
    this.skybox = null;

    this.maxBullets = 20;
    /**
     * @type {Bullets}
     */
    this.bullets = this.createBullets(this.maxBullets);
    this.index = 0;

    this.actualAmmo = 40; //Balas totales antes de acabar el juego
    this.score = 0;
    this.lastScore = 0;
    this.level = 1;

    this.moveController = moveController;

    this.avatar.loadWeapons();
    this.place = this.createPlace();

    this.ambientLight = null;
    this.spotLight = null;
    this.createLights();

    this.add(this.place);
  }

  /**
   * It creates the camera and adds it to the graph
   * @param {THREE.WebGLRenderer} renderer The renderer associated with the camera
   */
  createCrosshair(renderer) {
    // Create the Crosshair
    var crosshair = new Crosshair();
    this.camera.add(crosshair);

    // Place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
    crosshair.position.set((crosshairPercentX / 100) * 2 - 1, (crosshairPercentY / 100) * 2 - 1, -0.3);
  }

  dispara() {
    if (this.index >= this.maxBullets) {
      this.index = 0;
      this.bullets.reload();
    }
    if (!this.moveController.disparando) {
      this.bullets.shot(this.index,
        this.avatar.getPosition(),
        this.camera.getWorldDirection(new Vector3()),
        this.avatar.getActiveWeapon());
      this.index++;
      this.actualAmmo--;
      updateAmmo();
    }
  }

  /// It creates lights and adds them to the graph
  createLights() {
    // add subtle ambient lighting
    this.ambientLight = new AmbientLight(0xccddee, 0.35);
    this.add(this.ambientLight);

    // add spotlight for the shadows
    this.spotLight = new SpotLight(0xffffff);
    this.spotLight.position.set(0, 500, 1000);
    this.spotLight.intensity = 1;
    this.spotLight.castShadow = true;
    // the shadow resolution
    this.spotLight.shadow.mapSize.width = 2048;
    this.spotLight.shadow.mapSize.height = 2048;
    this.add(this.spotLight);
  }

  /// It creates the place
  /**
   * @return place
   */
  createPlace() {
    var place = new Object3D();

    this.skybox = new Skybox();
    place.add(this.skybox);

    //Creates the map
    this.map = new Map();
    for (var i = 0; i < this.map.getMapSize(); ++i) {
      this.add(this.map.getMap(i));
    }

    return place;
  }

  /**
   * It creates the bullets
   * @private
   * @param {number} maxBullets
   */
  createBullets(maxBullets) {
    const loader = new TextureLoader();
    const textura = loader.load("imgs/bullettext.jpg");
    return new Bullets(maxBullets, this, (new MeshPhongMaterial({ map: textura })));
  }

  endGame() {
    enableControls = false;
    this.controls.enabled = false;

    this.moveController.reset()

    /*this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.jumping = false;/** */

    blocker.style.display = 'block';
    instructions.style.display = '';
    instructions.style.fontSize = "50px";

    instructions.innerHTML = "Puntuacion total: " + this.score + ", pulsa la tecla P para jugar otra partida.";
  }

  /**
   * @controls - The GUI information
   */
  animate() {
    this.simulate();


    if (this.moveController.moveForward) this.avatar.moveForward();
    if (this.moveController.moveBackward) this.avatar.moveBackward();
    if (this.moveController.moveLeft) this.avatar.moveLeft();
    if (this.moveController.moveRight) this.avatar.moveRight();

    if (this.moveController.jumping) {
      this.avatar.jump();
    }

    if (this.moveController.disparando) {
      this.avatar.animateWeapon();
    }

    this.avatar.updateControls();

    this.enemies.animate();

    if (this.actualAmmo == 0) {
      this.endGame();
    }
  }

  changeWeapon() {
    this.avatar.changeWeapon();
  }

  /**
   * It returns the camera
   * @return The camera
   */
  getCamera() {
    return this.camera;
  }

  /**
   * It returns the camera controls
   * @return The camera controls
   */
  getCameraControls() {
    return this.controls;
  }

  /**
   * It updates the aspect ratio of the camera
   * @param anAspectRatio - The new aspect ratio for the camera
   */
  setCameraAspect(anAspectRatio) {
    this.camera.aspect = anAspectRatio;
    this.camera.updateProjectionMatrix();
  }

  newLevel() {
    this.avatar.setInitialPosition();

    if (this.score - this.lastScore != 40)
      this.score = this.lastScore + 40;

    updateLevel();

    for (var i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    this.createEnemies();
    this.lastScore = this.score;
  }

  newGame() {
    blocker.style.display = 'none';
    enableControls = true;
    this.controls.enabled = true;
    this.avatar.setInitialPosition();
    this.actualAmmo = 40;
    updateAmmo();
    this.score = 0;
    updateScore(this.score);
    this.level = 1;
    updateLevel();

    for (var i = 0; i < this.enemies.getEnemiesSize(); ++i) {
      this.remove(this.enemies.getEnemies(i));
    }
    this.createEnemies();
  }

  updateScore(score) {
    this.score += score;
    updateScore(this.score);
  }

}

export default Scene;