<?php
declare(strict_types=1);

namespace BlueFinch\Checkout\Plugin;

use BlueFinch\Checkout\Model\DataCollector;
use BlueFinch\Checkout\Model\ConfigurationInterface;
use Magento\Quote\Model\Quote as Subject;
use Psr\Log\LoggerInterface;

class Quote
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
     * Check dataCollector to skip collectTotals if applicable
     *
     * @param Subject $subject
     * @return array
     */
    public function beforeCollectTotals(
        Subject $subject
    ): array {
        if ($this->dataCollector->getTotalsCollected()) {
            $subject->setTotalsCollectedFlag(true);
        } elseif ($this->configuration->getIsDebugEnabled() &&
            $this->dataCollector->getTotalsCollected() === false &&
            !$subject->getTotalsCollectedFlag()
        ) {
            $this->logger->critical('BlueFinch Checkout: collectTotals called');
        }
        return [];
    }
}
