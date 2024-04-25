<?php

declare(strict_types=1);

namespace Gene\BetterCheckout\Model;

use Exception;
use Magento\Framework\Exception\LocalizedException;
use Psr\Log\LoggerInterface;

class CompositeDataProvider implements CompositeDataProviderInterface
{
    /**
     * @param DataProviderInterface[] $dataProviders
     */
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly array $dataProviders = []
    ) {
    }

    /**
     * @param int $quoteId
     * @return array
     */
    public function getData(int $quoteId): array
    {
        $result = [];
        foreach ($this->dataProviders as $dataProvider) {
            try {
                if (!in_array(DataProviderInterface::class, class_implements($dataProvider))) {
                    throw new LocalizedException(__(
                        "Data provider %1 should implement %2",
                        get_class($dataProvider),
                        DataProviderInterface::class
                    ));
                }
                $result = array_replace_recursive($result, $dataProvider->getData($quoteId));
            } catch (Exception $exception) {
                $this->logger->error($exception->getMessage());
                continue;
            }
        }
        return $result;
    }
}
