export enum LoaderType {
  OBJ = "obj",
  OBJMTL = "obj/mtl",
  PIXI = "pixi",
  FBX = "fbx",
  GLTF = "gltf",
}

export const BootAssets: Array<{key: string, path: string, type: LoaderType}> = [];
