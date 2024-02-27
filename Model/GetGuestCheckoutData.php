<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Gene\BetterCheckout\Api\GetCheckoutDataInterface;
use Gene\BetterCheckout\Api\GetGuestCheckoutDataInterface;
use Magento\Framework\Event\ManagerInterface;
use Magento\Framework\Serialize\SerializerInterface;
use Magento\Quote\Model\QuoteIdMask;
use Magento\Quote\Model\QuoteIdMaskFactory;

class GetGuestCheckoutData implements GetGuestCheckoutDataInterface
{
    /**
     * @var GetCheckoutDataInterface
     */
    private $getCheckoutData;

    /**
     * @var QuoteIdMaskFactory
     */
    private $quoteMaskedIdFactory;

    /**
     * @param GetCheckoutDataInterface $getCheckoutData
     * @param QuoteIdMaskFactory $quoteMaskedIdFactory
     */
    public function __construct(
        GetCheckoutDataInterface $getCheckoutData,
        QuoteIdMaskFactory $quoteMaskedIdFactory
    ) {
        $this->getCheckoutData = $getCheckoutData;
        $this->quoteMaskedIdFactory = $quoteMaskedIdFactory;
    }

    /**
     * @param string $cartId
     * @return string
     */
    public function execute(
        string $cartId
    ): string {
        $quoteIdMask = $this->quoteMaskedIdFactory->create()->load(
            $cartId,
            'masked_id'
        );
        return $this->getCheckoutData->execute(
            $quoteIdMask->getQuoteId()
        );
    }
}
