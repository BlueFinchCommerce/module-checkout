<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model\Config\Backend;

use Magento\Config\Model\Config\Backend\File as CoreFile;

class File extends CoreFile
{
    /**
     * Return allowed file extensions
     *
     * @return string[]
     */
    protected function _getAllowedExtensions()
    {
        return [
            'woff',
            'woff2'
        ];
    }
}
