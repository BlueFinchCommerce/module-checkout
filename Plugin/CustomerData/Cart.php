<?php
declare(strict_types=1);

namespace Gene\BetterCheckout\Plugin\CustomerData;

use Magento\Catalog\Block\ShortcutButtons;
use Magento\Checkout\CustomerData\Cart as Subject;
use Magento\Checkout\Model\Session;
use Magento\Framework\Locale\Resolver;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;
use Magento\Store\Model\StoreManagerInterface;

class Cart
{
    /**
     * @var Session
     */
    private $checkoutSession;

    /**
     * @var QuoteIdToMaskedQuoteIdInterface
     */
    private $maskedQuote;

    /**
    * @var Resolver
    */
    private $localeResolver;

    /**
    * @var StoreManagerInterface
    */
    private $storeManager;

    /**
     * Cart constructor
     *
     * @param Session $checkoutSession
     * @param QuoteIdToMaskedQuoteIdInterface $maskedQuote
     * @param Resolver $localeResolver
     * @param StoreManagerInterface $storeManager
     */
    public function __construct(
        Session $checkoutSession,
        QuoteIdToMaskedQuoteIdInterface $maskedQuote,
        Resolver $localeResolver,
        StoreManagerInterface $storeManager
    ) {
        $this->checkoutSession = $checkoutSession;
        $this->maskedQuote = $maskedQuote;
        $this->localeResolver = $localeResolver;
        $this->storeManager = $storeManager;
    }

    /**
     * Intercept getSectionData and add extra information to improve performance in the checkout.
     *
     * @param Subject $subject
     * @param array $result
     * @return array
     */
    public function afterGetSectionData(
        Subject $subject,
        array $result
    ): array {
        $quote = $this->checkoutSession->getQuote();
        $quoteId = $quote ? (int) $quote->getId() : null;
        if ($quote &&
            !$quote->getCustomerId() &&
            $quoteId != null) {
            $maskedId = $this->maskedQuote->execute((int) $quote->getId());
            $result['guest_masked_id'] = $maskedId;
        }

        $result['currencyCode'] = $quote->getQuoteCurrencyCode();
        $result['locale'] = $this->localeResolver->getLocale();
        $result['storeCode'] = $this->storeManager->getStore()->getCode();

        return $result;
    }
}
