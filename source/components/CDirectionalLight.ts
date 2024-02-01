/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import { Object3D, DirectionalLight, Vector3, Spherical } from "three";

import { Node, types } from "@ff/graph/Component";

import CLight from "./CLight";

////////////////////////////////////////////////////////////////////////////////

export default class CDirectionalLight extends CLight
{
    static readonly typeName: string = "CDirectionalLight";

    protected static readonly dirLightIns = {
        elevation: types.Number("Source.Elevation", {preset:90, min:0, max:90, bar: true}),
        azimuth: types.Number("Source.Azimuth", {preset:0, min:0, max:360, bar: true}),
        shadowSize: types.Number("Shadow.Size", 100),
    };

    ins = this.addInputs<CLight, typeof CDirectionalLight["dirLightIns"]>(CDirectionalLight.dirLightIns);

    constructor(node: Node, id: string)
    {
        super(node, id);

        this.object3D = new DirectionalLight();
        this.light.target.matrixAutoUpdate = false;
    }

    get light(): DirectionalLight {
        return this.object3D as DirectionalLight;
    }

    update(context)
    {
        super.update(context);

        const light = this.light;
        const ins = this.ins;

        if (ins.color.changed || ins.intensity.changed) {
            light.intensity = ins.intensity.value * Math.PI;  //TODO: Remove PI factor when we can support physically correct lighting units
        }

        if(ins.elevation.changed || ins.azimuth.changed){
            light.position.setFromSpherical(new Spherical(light.position.length(), (90-ins.elevation.value)*2*Math.PI/360,(90-ins.azimuth.value)*2*Math.PI/360));
            light.updateMatrix();
            light.target.updateMatrix();
        }

        if (ins.shadowSize.changed) {
            const camera = light.shadow.camera;
            const halfSize = ins.shadowSize.value * 0.5;
            camera.left = camera.bottom = -halfSize;
            camera.right = camera.top = halfSize;
            camera.updateProjectionMatrix();
        }

        return true;
    }

    protected onAddToParent(parent: Object3D)
    {
        super.onAddToParent(parent);
        parent.add(this.light.target);
    }

    protected onRemoveFromParent(parent: Object3D)
    {
        super.onRemoveFromParent(parent);
        parent.remove(this.light.target);
    }
}