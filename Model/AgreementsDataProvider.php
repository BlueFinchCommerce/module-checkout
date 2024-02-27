<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Magento\CheckoutAgreements\Model\AgreementsConfigProvider;

class AgreementsDataProvider implements DataProviderInterface
{
    /**
     * @var AgreementsConfigProvider
     */
    private $agreementsConfigProvider;

    /**
     * @param AgreementsConfigProvider $agreementsConfigProvider
     */
    public function __construct(
        AgreementsConfigProvider $agreementsConfigProvider
    ) {
        $this->agreementsConfigProvider = $agreementsConfigProvider;
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
