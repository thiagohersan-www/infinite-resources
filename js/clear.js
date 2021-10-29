
function clearScene(obj) {
  while (obj.children.length > 0) { 
    clearScene(obj.children[0]);
    obj.remove(obj.children[0]);
  }

  if (obj.geometry) obj.geometry.dispose();

  if (obj.material) {
    //in case of map, bumpMap, normalMap, envMap ...
    Object.keys(obj.material).forEach(prop => {
      const mObjProp = obj.material[prop];
      if (!mObjProp) return;
      if (mObjProp !== null && typeof mObjProp.dispose === 'function') mObjProp.dispose();
    });
    obj.material.dispose();
  }
}

export { clearScene };
