<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\CheckoutAgreements\Model\AgreementsConfigProvider;

class AgreementsDataProvider implements DataProviderInterface
{
    /**
     * @param AgreementsConfigProvider $agreementsConfigProvider
     */
    public function __construct(
        private readonly AgreementsConfigProvider $agreementsConfigProvider
    ) {
    }

    /**
     * @param int $quoteId
     * @return array
     */
    public function getData(
        int $quoteId
    ): array {
        $data = [];
        $checkoutAgreements = $this->agreementsConfigProvider->getConfig();
        if (isset($checkoutAgreements['checkoutAgreements']['agreements'])) {
            foreach ($checkoutAgreements['checkoutAgreements']['agreements'] as $agreement) {
                $data[$agreement['agreementId']] = $agreement;
            }
        }
        return ['agreements' => $data];
    }
}
