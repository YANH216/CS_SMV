import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export const initGUI = (material, light) => {
  console.log(material);
  const gui = new GUI();
  gui
    .add(material, 'refractionRatio')
    .min(0)
    .max(1)
    .step(0.01)
  
  gui
    .add(material, 'reflectivity')
    .min(0)
    .max(1)
    .step(0.01)

  gui
    .add(light, 'intensity')
    .min(0)
    .max(10)
    .step(0.01)

  const destroyGUI = () => {
    gui.destroy()
  }
  return destroyGUI
}