/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { types } from "@ff/graph/propertyTypes";

import UniversalCamera, { EProjectionType } from "@ff/three/UniversalCamera";
import Object3D from "./Object3D";

////////////////////////////////////////////////////////////////////////////////

export { EProjectionType };

export default class Camera extends Object3D
{
    static readonly type: string = "Camera";

    ins = this.ins.append({
        activate: types.Event("Activate"),
        autoActivate: types.Boolean_true("AutoActivate"),
        offset: types.Vector3("Transform.Offset"),
        rotation: types.Vector3("Transform.Rotation"),
        projection: types.Enum("Projection.Type", EProjectionType, EProjectionType.Perspective),
        fov: types.Number("Projection.FovY", 52),
        size: types.Number("Projection.Size", 20),
        zoom: types.Number("Projection.Zoom", 1),
        near: types.Number("Frustum.ZNear", 0.01),
        far: types.Number("Frustum.ZFar", 10000)
    });

    get camera() {
        return this.object3D as UniversalCamera;
    }

    create()
    {
        super.create();
        this.object3D = new UniversalCamera();
    }

    update()
    {
        const { activate, autoActivate } = this.ins;

        if (autoActivate.changed && autoActivate.value) {
            if (!this.system.activeCameraComponent) {
                this.system.activeCameraComponent = this;
            }
        }
        if (activate.value) {
            this.system.activeCameraComponent = this;
        }

        const { offset, rotation, projection, fov, size, zoom, near, far } = this.ins;
        const camera = this.camera;

        if (offset.changed || rotation.changed) {
            camera.position.fromArray(offset.value);
            camera.rotation.fromArray(rotation.value);
            camera.updateMatrix();
        }

        if (projection.changed) {
            camera.setProjection(types.getEnumIndex(EProjectionType, projection.value));
        }

        camera.fov = fov.value;
        camera.size = size.value;
        camera.zoom = zoom.value;
        camera.near = near.value;
        camera.far = far.value;

        camera.updateProjectionMatrix();
        return true;
    }
}