/**
 * FF Typescript Foundation Library
 * Copyright 2019 Ralph Wiedemeier, Frame Factory GmbH
 *
 * License: MIT
 */

import System from "@ff/graph/System";

import Tree, { customElement, property, html } from "@ff/ui/Tree";

import { IAssetEntry, IAssetTreeChangeEvent } from "../components/CAssetManager";

////////////////////////////////////////////////////////////////////////////////

export interface IAssetDragEvent extends CustomEvent{
    detail: {
        node: IAssetEntry;
        event: DragEvent;
    };
}

@customElement("ff-asset-tree")
export default class AssetTree extends Tree<IAssetEntry>
{
    @property({ attribute: false, type: Array })
    selection: Array<IAssetEntry> = [];



    constructor()
    {
        super();
        this.includeRoot = true;
    }

    protected firstConnected()
    {
        super.firstConnected();
        this.classList.add("ff-asset-tree");


    }

    protected renderNodeHeader(treeNode: IAssetEntry)
    {
        const isFolder = treeNode.info.folder;
        const iconName = isFolder ? "folder" : "file";
        const iconClass = isFolder ? "ff-folder" : "ff-file";

        return html`<ff-icon class=${iconClass} name=${iconName}></ff-icon>
            <div class="ff-text ff-ellipsis">${treeNode.info.name}</div>`;
    }

    protected getChildren(treeNode: IAssetEntry): any[] | null
    {
        const children = treeNode.children;
        return children.sort((a, b) => {
            if (a.info.folder && !b.info.folder) return -1;
            if (!a.info.folder && b.info.folder) return 1;

            const aName = a.info.name.toLowerCase();
            const bName = b.info.name.toLowerCase();

            if (aName < bName) return -1;
            if (aName > bName) return 1;
            return 0;
        });
    }

    protected getClasses(treeNode: IAssetEntry): string
    {
        return treeNode.info.folder ? "ff-folder" : "ff-file";
    }

    protected getId(treeNode: IAssetEntry): string
    {
        return treeNode.info.path;
    }

    protected isNodeExpanded(treeNode: IAssetEntry): boolean
    {
        return treeNode.expanded;
    }

    protected isNodeSelected(treeNode: IAssetEntry): boolean
    {
        return this.selection.indexOf(treeNode) !== -1;
    }

    protected select(treeNode: IAssetEntry, toggle: boolean)
    {
        const selected = this.selection.indexOf(treeNode) !== -1;
        if(toggle && selected){
            this.selection = this.selection.filter(node => node !== treeNode);
        }else if(!toggle){
            this.selection = [treeNode];
        }else if(toggle){
            this.selection = [...this.selection, treeNode];
        }

        this.dispatchEvent(new CustomEvent("select", {
            bubbles: true,
            detail: this.selection,
        }));
    }

    protected onNodeClick(event: MouseEvent, treeNode: IAssetEntry)
    {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

        if (event.clientX - rect.left < 30) {
            this.toggleExpanded(treeNode);
        }
        else {
            this.select(treeNode, event.ctrlKey);
        }
    }

    protected onNodeDblClick(event: MouseEvent, treeNode: IAssetEntry)
    {
        this.dispatchEvent(new CustomEvent("open", {
            bubbles: true,
            detail: treeNode,
        }));
    }

    protected canDrop(event: DragEvent, targetTreeNode: IAssetEntry): boolean
    {
        // dropping assets and files into folders only
        return targetTreeNode.info.folder &&
            (super.canDrop(event, targetTreeNode) ||
                !!event.dataTransfer.types.find(type => type === "Files"));
    }

    protected onNodeDragStart(event: DragEvent, sourceTreeNode: IAssetEntry)
    {
        this.select(sourceTreeNode, event.ctrlKey);
        event.dataTransfer.setData("text/plain", sourceTreeNode.info.path);
        this.dispatchEvent(new CustomEvent("dragstart", {
            bubbles: true, 
            detail: {node:sourceTreeNode, event}
        }));
        return super.onNodeDragStart(event, sourceTreeNode);
    }

    protected onNodeDrop(event: DragEvent, targetTreeNode: IAssetEntry)
    {
        this.dispatchEvent(new CustomEvent("dragstart", {
            bubbles: true, 
            detail: {node:targetTreeNode, event}
        }));
        return super.onNodeDrop(event, targetTreeNode);
    }
}
