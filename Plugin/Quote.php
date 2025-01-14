<?php
declare(strict_types=1);

namespace Bluefinch\Checkout\Plugin;

use Bluefinch\Checkout\Model\DataCollector;
use Bluefinch\Checkout\Model\ConfigurationInterface;
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
            $this->logger->critical('Bluefinch Checkout: collectTotals called');
        }
        return [];
    }
}
