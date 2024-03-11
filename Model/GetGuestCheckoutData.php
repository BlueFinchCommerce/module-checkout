<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Gene\BetterCheckout\Api\GetCheckoutDataInterface;
use Gene\BetterCheckout\Api\GetGuestCheckoutDataInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Quote\Model\QuoteIdMask;

class GetGuestCheckoutData implements GetGuestCheckoutDataInterface
{
    /**
     * @var GetCheckoutDataInterface
     */
    private $getCheckoutData;

    /**
     * @var QuoteIdMask
     */
    private $quoteMaskedId;

    /**
     * @param GetCheckoutDataInterface $getCheckoutData
     * @param QuoteIdMask $quoteMaskedId
     */
    public function __construct(
        GetCheckoutDataInterface $getCheckoutData,
        QuoteIdMask $quoteMaskedId
    ) {
        $this->getCheckoutData = $getCheckoutData;
        $this->quoteMaskedId = $quoteMaskedId;
    }

    /**
     * @param string $cartId
     * @return string
     */
    public function execute(
        string $cartId
    ): string {
        $quoteIdMask = $this->quoteMaskedId->create()->load(
            $cartId,
            'masked_id'
        );
        return $this->getCheckoutData->execute(
            $quoteIdMask->getQuoteId()
        );
    }
}
