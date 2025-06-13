<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Helper;

use Magento\Csp\Helper\CspNonceProvider;
use Magento\Framework\App\Helper\AbstractHelper;

class CspHelper extends AbstractHelper
{
    /**
     * @param CspNonceProvider $nonceProvider
     */
    public function __construct(
      private readonly CspNonceProvider $nonceProvider
    ) {
    }

    public function getCspNonce(): string
    {
        return $this->nonceProvider->generateNonce();
    }
}