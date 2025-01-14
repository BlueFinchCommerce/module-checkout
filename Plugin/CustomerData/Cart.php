<?php
declare(strict_types=1);

namespace Bluefinch\Checkout\Plugin\CustomerData;

use Magento\Checkout\CustomerData\Cart as Subject;
use Magento\Checkout\Model\Session;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Exception\NoSuchEntityException;
use Magento\Framework\Locale\Resolver;
use Magento\Payment\Model\MethodInterface;
use Magento\Payment\Model\MethodList;
use Magento\Quote\Api\Data\CartInterface;
use Magento\Quote\Model\QuoteIdToMaskedQuoteIdInterface;
use Magento\Store\Model\StoreManagerInterface;
use PayPal\Braintree\Helper\CcType;

class Cart
{
    /**
     * Cart constructor
     *
     * @param Session $checkoutSession
     * @param QuoteIdToMaskedQuoteIdInterface $maskedQuote
     * @param Resolver $localeResolver
     * @param StoreManagerInterface $storeManager
     * @param MethodList $methodList
     * @param CcType $ccTypeHelper
    */
    public function __construct(
        private readonly Session $checkoutSession,
        private readonly QuoteIdToMaskedQuoteIdInterface $maskedQuote,
        private readonly Resolver $localeResolver,
        private readonly StoreManagerInterface $storeManager,
        private readonly MethodList $methodList,
        private readonly CcType $ccTypeHelper
    ) {
    }

    /**
     * Intercept getSectionData and add extra information to improve performance in the checkout.
     *
     * @param Subject $subject
     * @param array $result
     * @return array
     * @throws LocalizedException
     * @throws NoSuchEntityException
     */
    public function afterGetSectionData(
        Subject $subject,
        array $result
    ): array {
        $quote = $this->checkoutSession->getQuote();
        $quoteId = $quote ? (int) $quote->getId() : null;

        if ($quote instanceof CartInterface) {
            if ($quoteId !== null && $quoteId !== 0) {
                if (!$quote->getCustomerId()) {
                    $maskedId = $this->maskedQuote->execute((int) $quote->getId());
                    $result['guest_masked_id'] = $maskedId;
                }

                $methodList = $this->methodList->getAvailableMethods($quote);
                $result['paymentMethodList'] = array_map(function (MethodInterface $method) {
                    return ['code' => $method->getCode(), 'title' => $method->getTitle()];
                }, $methodList);
            }
        }

        $result['currencyCode'] = $quote->getQuoteCurrencyCode();
        $result['locale'] = $this->localeResolver->getLocale();
        $result['storeCode'] = $this->storeManager->getStore()->getCode();
        $result['braintreeCcTypes'] = $this->ccTypeHelper->getCcTypes();

        return $result;
    }
}
