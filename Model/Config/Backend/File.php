<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model\Config\Backend;

use Magento\Config\Model\Config\Backend\File as CoreFile;

class File extends CoreFile
{
    /**
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
