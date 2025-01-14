<?php

declare(strict_types=1);

namespace Bluefinch\Checkout\Model;

use Bluefinch\Checkout\Api\GetCheckoutDataInterface;
use Bluefinch\Checkout\Api\GetGuestCheckoutDataInterface;
use Magento\Quote\Model\QuoteIdMask;

class GetGuestCheckoutData implements GetGuestCheckoutDataInterface
{
    /**
     * @param GetCheckoutDataInterface $getCheckoutData
     * @param QuoteIdMask $quoteMaskedId
     */
    public function __construct(
        private readonly GetCheckoutDataInterface $getCheckoutData,
        private readonly QuoteIdMask $quoteMaskedId
    ) {
    }

    /**
     * @param string $cartId
     * @return string
     */
    public function execute(
        string $cartId
    ): string {
        $quoteIdMask = $this->quoteMaskedId->create()->load($cartId, 'masked_id');
        return $this->getCheckoutData->execute($quoteIdMask->getQuoteId());
    }
}
