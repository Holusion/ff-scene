/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import * as THREE from "three";

import { types } from "@ff/graph/propertyTypes";

import Light from "./Light";

////////////////////////////////////////////////////////////////////////////////

export default class PointLight extends Light
{
    static readonly type: string = "PointLight";

    ins = this.ins.append({
        distance: types.Number("Distance"),
        decay: types.Number("Decay", 1)
    });

    get light(): THREE.PointLight
    {
        return this.object3D as THREE.PointLight;
    }

    create()
    {
        super.create();
        this.object3D = new THREE.PointLight();
    }

    update()
    {
        const light = this.light;
        const { color, intensity, distance, decay } = this.ins;

        light.color.fromArray(color.value);
        light.intensity = intensity.value;
        light.distance = distance.value;
        light.decay = decay.value;

        light.updateMatrix();
        return true;
    }
}