<?php
declare(strict_types=1);

namespace BlueFinch\Checkout\Plugin\Quote;

use BlueFinch\Checkout\Model\DataCollector;
use BlueFinch\Checkout\Model\ConfigurationInterface;
use Magento\Quote\Model\Quote\Address as Subject;
use Psr\Log\LoggerInterface;

class Address
{
    /**
     * @param DataCollector $dataCollector
     * @param ConfigurationInterface $configuration
     * @param LoggerInterface $logger
     */
    public function __construct(
        private readonly DataCollector $dataCollector,
        private readonly ConfigurationInterface $configuration,
        private readonly LoggerInterface $logger
    ) {
    }

    /**
     * Check dataCollector to skip collectShippingRates if applicable
     *
     * @param Subject $subject
     * @return array
     */
    public function beforeCollectShippingRates(
        Subject $subject
    ): array {
        if ($this->dataCollector->getRatesCollected()) {
            $subject->setCollectShippingRates(false);
        } elseif ($this->configuration->getIsDebugEnabled() &&
            $this->dataCollector->getRatesCollected() === false &&
            $subject->getCollectShippingRates()
        ) {
            $this->logger->critical('BlueFinch Checkout: requestShippingRates called');
        }
        return [];
    }
}
