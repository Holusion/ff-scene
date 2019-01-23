/**
 * FF Typescript Foundation Library
 * Copyright 2018 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import NLight from "./NLight";
import CSpotLight from "../components/CSpotLight";

////////////////////////////////////////////////////////////////////////////////

export default class NSpotLight extends NLight
{
    static readonly type: string = "NSpotLight";

    get light() {
        return this.components.get(CSpotLight);
    }

    createComponents()
    {
        super.createComponents();
        this.createComponent(CSpotLight);
    }
}