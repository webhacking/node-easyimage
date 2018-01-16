/*
 EasyImage

 EasyImage is a promise-based image processing module
 for Node.js, it is built on top of ImageMagick, so
 make sure ImageMagick is installed on your system.

 Copyright (c) 2015 Hage Yaapa <http://www.hacksparrow.com>
 Maintained by Kevin Gravier <http://github.com/mrkmg>

 MIT License
 */

import * as Bluebird from "bluebird";
import {IBaseOptions} from "../Options";
import {ensureDestinationDirectoryExists, applyDefaultsToBaseOptions, applyBaseOptionsToArgs, checkForMissingOptions} from "../Utilities";
import {execute} from "../ImageMagick";
import {info, IInfoResult} from "./info";

Promise = Promise || Bluebird as any;

/**
 * Resizes an image.
 *
 * @param {IResizeOptions} options
 * @returns {Bluebird<IInfoResult>}
 */
export async function resize(options: IResizeOptions): Promise<IInfoResult> {
    checkForMissingOptions(options, ["src", "width"]);

    applyDefaultsToBaseOptions(options);
    applyDefaultsToResizeOptions(options);

    await ensureDestinationDirectoryExists(options);

    const args: string[] = [options.src];
    applyBaseOptionsToArgs(options, args);

    const resizeDefinition = `${options.width}x${options.height}${options.ignoreAspectRatio ? "!" : ""}`;

    args.push("-resize", resizeDefinition, options.dst);

    await execute("convert", args);
    return info(options.dst);
}

export interface IResizeOptions extends IBaseOptions {
    /**
     * Width of resized image.
     */
    width: number;

    /**
     * Height of resized image.
     * @default cropWidth
     */
    height?: number;

    /**
     * Ignore aspect ratio when resizing.
     * @default false;
     */
    ignoreAspectRatio?: boolean;
}

function applyDefaultsToResizeOptions(options: IResizeOptions) {
    if (options.ignoreAspectRatio === undefined) {
        options.ignoreAspectRatio = false;
    }
    if (!options.height) {
        options.height = options.width;
    }
}