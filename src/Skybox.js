import {
  BoxGeometry, Matrix4, TextureLoader, Object3D, BackSide, Mesh, MeshBasicMaterial,
} from 'three';

/**
 * The Skybox class
 * @author David Infante, Jose Ariza, Wei Ji
 */

class Skybox extends Object3D {

  constructor() {
    super();

    this.lenghtxz = 1000;
    this.heighty = 500;

    this.skybox = null;

    var geometry = new BoxGeometry(this.lenghtxz, this.heighty, this.lenghtxz);

    var loader = new TextureLoader();

    var material = [];
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/ft.JPG"), side: BackSide }));
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/bk.JPG"), side: BackSide }));
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/up.JPG"), side: BackSide }));
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/dn.JPG"), side: BackSide }));
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/rt.JPG"), side: BackSide }));
    material.push(new MeshBasicMaterial({ map: loader.load("imgs/Skybox/lf.JPG"), side: BackSide }));

    this.skybox = new Mesh(geometry, material);

    this.skybox.applyMatrix(new Matrix4().makeTranslation(0, 0, 0));

    this.add(this.skybox);
  }
}

export default Skybox;