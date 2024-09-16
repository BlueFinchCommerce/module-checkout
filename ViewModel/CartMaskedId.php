<?php

namespace Gene\BetterCheckout\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Quote\Model\QuoteIdMaskFactory;
use Magento\Checkout\Model\Session as CheckoutSession;

class CartMaskedId implements ArgumentInterface
{
    /**
     * @var QuoteIdMaskFactory
     */
    protected $quoteIdMaskFactory;

    /**
     * @var CheckoutSession
     */
    protected $checkoutSession;

    /**
     * @param QuoteIdMaskFactory $quoteIdMaskFactory
     * @param CheckoutSession $checkoutSession
     */
    public function __construct(
      QuoteIdMaskFactory $quoteIdMaskFactory,
      CheckoutSession $checkoutSession
    ) {
        $this->quoteIdMaskFactory = $quoteIdMaskFactory;
        $this->checkoutSession = $checkoutSession;
    }

    /**
     * Get Masked Cart ID
     *
     * @return string|null
     */
    public function getMaskedCartId()
    {
        $quoteId = $this->checkoutSession->getQuoteId();
        $quoteIdMask = $this->quoteIdMaskFactory->create()->load($quoteId, 'quote_id');

        if ($quoteIdMask->getMaskedId()) {
            return $quoteIdMask->getMaskedId();
        }

        return null;
    }
}
