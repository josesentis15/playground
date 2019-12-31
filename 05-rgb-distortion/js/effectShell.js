class EffectShell {
  constructor(container = document.body, itemsWrapper = null) {
    this.container = container;
    this.itemsWrapper = itemsWrapper;
    this.isMouseOver = true;
    this.image = document.getElementById('image');

    if (!this.container) return;

    this.setup();
    this.initEffectShell().then(() => {
      console.log('load finished');
      this.isLoaded = true;
      // this.onMouseMove();

      if (this.isMouseOver) this.onMouseOver(this.tempItemIndex);
      this.tempItemIndex = null;

      // this.uniforms.uTexture.value = this.currentItem.texture
    });

    this.createEventsListeners();
  }

  setup() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    // renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio = window.devicePixelRatio;
    this.container.appendChild(this.renderer.domElement);

    // scene
    this.scene = new THREE.Scene()

    // camera
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.viewport.aspectRatio,
      0.1,
      100
    )
    this.camera.position.set(0, 0, 3)

    //mouse
    this.mouse = new THREE.Vector2()

    // time
    this.timeSpeed = 2
    this.time = 0
    this.clock = new THREE.Clock()

    // animation loop
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  render() {
    // called every frame
    this.time += this.clock.getDelta() * this.timeSpeed
    this.renderer.render(this.scene, this.camera)
  }

  initEffectShell() {
    const link = document.querySelector('.link');
    let promises = [];

    // this.items = [{
    //   element: link,
    //   img: this.image,
    //   index: 0
    // }];

    this.item = {
      element: link,
      img: this.image,
      index: 0
    };

    // this.items = this.itemsElements;
    const THREEtextureLoader = new THREE.TextureLoader();

    // this.items.forEach((item, index) => {
      // create textures
    promises.push(
      this.loadTexture(
        THREEtextureLoader,
        this.item.img ? this.item.img.src : null,
        this.item.index
      )
    );
    // });

    return new Promise((resolve, reject) => {
      // resolve textures promises
      Promise.all(promises).then(promises => {
        // all textures are loaded
        promises.forEach((promise, index) => {
          // assign texture to item
          console.log(promise);

          // this.items[index].texture = promise.texture
          this.item.texture = promise.texture
        })

        resolve();
      });
    });
  }

  createEventsListeners() {
    // console.log('Items: ', this.items);

    // this.items.forEach((item, index) => {
    console.log('Item: ', this.item);

    this.item.element.addEventListener(
      'mouseover',
      this._onMouseOver.bind(this, this.item.index),
      false
    )
    // });

    this.container.addEventListener(
      'mousemove',
      this._onMouseMove.bind(this),
      false
    );
    this.itemsWrapper.addEventListener(
      'mouseleave',
      this._onMouseLeave.bind(this),
      false
    );
  }

  _onMouseLeave(event) {}

  _onMouseMove(event) {
    // get normalized mouse position on viewport
    this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
    this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

    this.onMouseMove();
  }

  _onMouseOver(event) {
    this.onMouseOver(event)
  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }

  onUpdate() {}

  onMouseEnter(event) {}

  onMouseLeave(event) {}

  onMouseMove(event) {}

  onMouseOver(event) {}

  get viewport() {
    let width = this.container.clientWidth
    let height = this.container.clientHeight
    let aspectRatio = width / height
    return {
      width,
      height,
      aspectRatio
    }
  }

  get viewSize() {
    // fit plane to screen
    // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

    let distance = this.camera.position.z
    let vFov = (this.camera.fov * Math.PI) / 180
    let height = 2 * Math.tan(vFov / 2) * distance
    let width = height * this.viewport.aspectRatio
    return { width, height, vFov }
  }

  // get itemsElements() {
  //   // convert NodeList to Array
  //   const items = [...this.itemsWrapper.querySelectorAll('.link')]

  //   //create Array of items including element, image and index
  //   return items.map((item, index) => ({
  //     element: item,
  //     img: item.querySelector('img') || null,
  //     index: index
  //   }))
  // }

  loadTexture(loader, url, index) {
    // https://threejs.org/docs/#api/en/loaders/TextureLoader
    return new Promise((resolve, reject) => {
      if (!url) {
        resolve({ texture: null, index })
        return
      }
      // load a resource
      loader.load(
        // resource URL
        url,

        // onLoad callback
        texture => {
          resolve({ texture });
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        error => {
          console.error('An error happened.', error)
          reject(error)
        }
      )
    })
  }
}
