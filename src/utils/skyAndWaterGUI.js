import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export const initGUI = (parameters, updateSun, waterUniforms) => {
  const gui = new GUI();
  
    const folderSky = gui.addFolder( 'Sky' );
    // 海拔
    folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
    // 方位角
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
    folderSky.open();
  
    const folderWater = gui.addFolder( 'Water' );
    // 失真比例
    folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    // 大小
    folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
    folderWater.open();

  const destroyGUI = () => {
    gui.destroy()
  }
  return destroyGUI
}