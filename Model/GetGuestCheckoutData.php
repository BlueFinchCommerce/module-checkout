<?php

declare(strict_types=1);

namespace BlueFinch\Checkout\Model;

use BlueFinch\Checkout\Api\GetCheckoutDataInterface;
use BlueFinch\Checkout\Api\GetGuestCheckoutDataInterface;
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
     * Return checkout data for guests
     *
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
